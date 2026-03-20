'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import type { FlagColor, NormalizedCarPosition } from '@/types/racing';

// ── Class colors matching Sector1 main app ──────────────────────────
const CLASS_COLORS: Record<string, string> = {
  'GTO': '#ef4444',
  'GTU': '#22c55e',
  'GP1': '#3b82f6',
  'GP2': '#eab308',
  'GP3': '#a855f7',
  'Prototype': '#ec4899',
  'GT3': '#06b6d4',
  'GT4': '#f97316',
  'TCR': '#14b8a6',
  'LMP': '#8b5cf6',
};

const FLAG_BAR_COLORS: Record<string, string> = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
  checkered: '#ffffff',
  unknown: '#333333',
};

function getClassColor(carClass: string): string {
  if (!carClass) return '#666';
  const upper = carClass.toUpperCase();
  for (const [key, color] of Object.entries(CLASS_COLORS)) {
    if (upper.includes(key.toUpperCase())) return color;
  }
  let hash = 0;
  for (let i = 0; i < carClass.length; i++) hash = carClass.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 55%)`;
}

function formatLapTime(time: string): string {
  if (!time || time === '0' || time === '00:00:00.000') return '—:——.———';
  return time;
}

// ── Grid template (shared between header & rows) ────────────────────
const GRID_COLS = 'grid-cols-[3rem_4rem_5.5rem_1fr_7rem_7rem_7rem_5.5rem_3.5rem_3.5rem_4.5rem]';

type SortKey = 'position' | 'carNumber' | 'lastLap' | 'bestLap' | 'gap';

// ── Position change tracking ────────────────────────────────────────
interface PositionDelta {
  delta: number;      // positive = gained, negative = lost
  timestamp: number;  // when the change was detected
}

const DELTA_FADE_MS = 8000;

// ── Pit flash tracking ──────────────────────────────────────────────
interface PitFlash {
  type: 'entered' | 'exited';
  timestamp: number;
}

const PIT_FLASH_MS = 1500;

export default function TimingPanel() {
  const bridge = useBridgeSocket();
  const [flagColor, setFlagColor] = useState<FlagColor | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('position');
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [positionDeltas, setPositionDeltas] = useState<Record<string, PositionDelta>>({});
  const [pitFlashes, setPitFlashes] = useState<Record<string, PitFlash>>({});
  const [flagFlash, setFlagFlash] = useState<FlagColor | null>(null);

  // Track previous positions for delta computation
  const prevPositionsRef = useRef<Map<string, number>>(new Map());

  const { broadcast } = useBroadcastChannel({
    onEventSelected: (msg) => bridge.selectEvent(msg.eventId),
    onFlagChange: (msg) => setFlagColor(msg.flagColor),
    onCarSelected: (msg) => setSelectedCar(msg.carNumber),
  });

  const eventName = bridge.availableEvents.find(
    (e) => e.eventId === bridge.selectedEventId
  )?.name ?? bridge.selectedEventId ?? null;

  const currentFlag = bridge.raceState?.flagColor ?? flagColor;

  // ── Flag flash effect ─────────────────────────────────────────────
  const prevFlagRef = useRef<FlagColor | null | undefined>(null);
  useEffect(() => {
    if (currentFlag && currentFlag !== prevFlagRef.current) {
      if (currentFlag === 'yellow' || currentFlag === 'red') {
        setFlagFlash(currentFlag);
        const timer = setTimeout(() => setFlagFlash(null), 2000);
        return () => clearTimeout(timer);
      }
    }
    prevFlagRef.current = currentFlag;
  }, [currentFlag]);

  // ── Position delta & pit flash tracking ───────────────────────────
  useEffect(() => {
    if (bridge.positions.length === 0) return;

    const prev = prevPositionsRef.current;
    const useClassPos = classFilter !== null;
    const newDeltas: Record<string, PositionDelta> = {};
    const newFlashes: Record<string, PitFlash> = {};
    const now = Date.now();

    for (const car of bridge.positions) {
      const pos = useClassPos ? car.classPosition : car.overallPosition;
      const prevPos = prev.get(car.carNumber);
      if (prevPos !== undefined && prevPos !== pos && pos > 0) {
        const delta = prevPos - pos; // positive = gained positions
        if (delta !== 0) {
          newDeltas[car.carNumber] = { delta, timestamp: now };
        }
      }
      // Pit transitions
      if (car.isEnteredPit) {
        newFlashes[car.carNumber] = { type: 'entered', timestamp: now };
      } else if (car.isExitedPit) {
        newFlashes[car.carNumber] = { type: 'exited', timestamp: now };
      }
    }

    // Update prev positions map
    const next = new Map<string, number>();
    for (const car of bridge.positions) {
      next.set(car.carNumber, useClassPos ? car.classPosition : car.overallPosition);
    }
    prevPositionsRef.current = next;

    if (Object.keys(newDeltas).length > 0) {
      setPositionDeltas((prev) => ({ ...prev, ...newDeltas }));
    }
    if (Object.keys(newFlashes).length > 0) {
      setPitFlashes((prev) => ({ ...prev, ...newFlashes }));
    }
  }, [bridge.positions, classFilter]);

  // ── Expire stale deltas and pit flashes ───────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPositionDeltas((prev) => {
        const next: Record<string, PositionDelta> = {};
        for (const [k, v] of Object.entries(prev)) {
          if (now - v.timestamp < DELTA_FADE_MS) next[k] = v;
        }
        return Object.keys(next).length === Object.keys(prev).length ? prev : next;
      });
      setPitFlashes((prev) => {
        const next: Record<string, PitFlash> = {};
        for (const [k, v] of Object.entries(prev)) {
          if (now - v.timestamp < PIT_FLASH_MS) next[k] = v;
        }
        return Object.keys(next).length === Object.keys(prev).length ? prev : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Unique classes present in current data ────────────────────────
  const uniqueClasses = useMemo(() => {
    const classes = new Set<string>();
    for (const p of bridge.positions) {
      if (p.carClass) classes.add(p.carClass);
    }
    return Array.from(classes).sort();
  }, [bridge.positions]);

  // ── Filter and sort ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!classFilter) return bridge.positions;
    return bridge.positions.filter((p) => p.carClass === classFilter);
  }, [bridge.positions, classFilter]);

  const sorted = useMemo(() => {
    const positions = [...filtered];
    const posField = classFilter ? 'classPosition' : 'overallPosition';
    switch (sortKey) {
      case 'position':
        return positions.sort((a, b) => (a[posField] || 999) - (b[posField] || 999));
      case 'carNumber':
        return positions.sort((a, b) => a.carNumber.localeCompare(b.carNumber, undefined, { numeric: true }));
      case 'lastLap':
        return positions.sort((a, b) => (a.lastLapTime || 'zzz').localeCompare(b.lastLapTime || 'zzz'));
      case 'bestLap':
        return positions.sort((a, b) => (a.bestTime || 'zzz').localeCompare(b.bestTime || 'zzz'));
      case 'gap':
        return positions.sort((a, b) => (a[posField] || 999) - (b[posField] || 999));
      default:
        return positions;
    }
  }, [filtered, sortKey, classFilter]);

  // Find overall best lap (within filtered set)
  const overallBest = useMemo(() => {
    let best = '';
    for (const p of filtered) {
      if (p.bestTime && p.bestTime !== '0' && (!best || p.bestTime < best)) {
        best = p.bestTime;
      }
    }
    return best;
  }, [filtered]);

  const carCount = bridge.positions.length;
  const inPitCount = bridge.positions.filter((p) => p.isInPit).length;

  const handleSelectCar = useCallback((carNumber: string) => {
    const next = selectedCar === carNumber ? null : carNumber;
    setSelectedCar(next);
    broadcast({ type: 'car_selected', carNumber: next });
  }, [selectedCar, broadcast]);

  return (
    <>
      {/* Flag state bar — always visible at very top */}
      <div
        className="shrink-0 transition-colors duration-300"
        style={{
          height: '4px',
          background: currentFlag === 'checkered'
            ? 'repeating-linear-gradient(90deg, #000 0 8px, #fff 8px 16px)'
            : FLAG_BAR_COLORS[currentFlag ?? 'unknown'] ?? '#333',
          animation: (currentFlag === 'yellow' || currentFlag === 'red') ? 'flag-pulse 0.6s ease-in-out infinite' : undefined,
        }}
      />

      {/* Panel header with conditional flag flash */}
      <div
        className="shrink-0 transition-colors duration-500"
        style={flagFlash ? {
          backgroundColor: flagFlash === 'yellow' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          animation: 'flag-header-flash 2s ease-out forwards',
        } : undefined}
      >
        <PanelHeader
          panelName="Live Timing"
          panelIcon="⏱"
          connectionState={bridge.connectionState}
          eventName={eventName}
          flagColor={currentFlag}
        />
      </div>

      {/* Event selector when no event selected */}
      {!bridge.selectedEventId && bridge.availableEvents.length > 0 && (
        <div className="px-3 py-2 bg-bg-card border-b border-border-default shrink-0">
          <select
            className="bg-bg-elevated border border-border-subtle rounded px-2 py-1 text-sm text-text-primary w-full"
            defaultValue=""
            onChange={(e) => {
              bridge.selectEvent(e.target.value);
              broadcast({ type: 'event_selected', eventId: e.target.value });
            }}
          >
            <option value="" disabled>Select event...</option>
            {bridge.availableEvents.map((evt) => (
              <option key={evt.eventId} value={evt.eventId}>
                {evt.name ?? evt.eventId}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-surface border-b border-border-default shrink-0">
        <div className="flex items-center gap-4 text-[0.6875rem] uppercase tracking-wider text-text-muted">
          <span>Cars: <span className="text-text-primary font-semibold font-[var(--font-mono)]">{carCount}</span></span>
          <span>On Track: <span className="text-status-green font-semibold font-[var(--font-mono)]">{carCount - inPitCount}</span></span>
          <span>In Pit: <span className="text-status-yellow font-semibold font-[var(--font-mono)]">{inPitCount}</span></span>
          {bridge.raceState && (
            <span>Remaining: <span className="text-accent-orange font-semibold font-[var(--font-mono)]">{bridge.raceState.timeRemaining}</span></span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[0.625rem] text-text-muted uppercase tracking-wider">Sort:</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="bg-bg-elevated border border-border-subtle rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent-orange"
          >
            <option value="position">Position</option>
            <option value="carNumber">Car #</option>
            <option value="lastLap">Last Lap</option>
            <option value="bestLap">Best Lap</option>
          </select>
        </div>
      </div>

      {/* Class filter bar */}
      {uniqueClasses.length > 1 && (
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-bg-card border-b border-border-default shrink-0 flex-wrap">
          <button
            onClick={() => setClassFilter(null)}
            className={`px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-wider rounded border transition-colors ${
              classFilter === null
                ? 'border-accent-orange text-accent-orange bg-accent-orange-dim'
                : 'border-border-subtle text-text-muted bg-transparent hover:text-text-secondary hover:border-border-default'
            }`}
          >
            ALL
          </button>
          {uniqueClasses.map((cls) => {
            const color = getClassColor(cls);
            const isActive = classFilter === cls;
            return (
              <button
                key={cls}
                onClick={() => setClassFilter(isActive ? null : cls)}
                className="px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-wider rounded border transition-colors"
                style={{
                  borderColor: isActive ? color : '#333',
                  color: isActive ? color : '#666',
                  backgroundColor: isActive ? `${color}15` : 'transparent',
                }}
              >
                {cls}
              </button>
            );
          })}
          {classFilter && (
            <span className="text-[0.5rem] text-text-muted ml-2 uppercase tracking-wider">
              Showing in-class positions
            </span>
          )}
        </div>
      )}

      {/* Scrollable area: sticky header + rows */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Sticky column headers */}
        <div className={`grid ${GRID_COLS} gap-0 px-4 py-2 bg-bg-card border-b border-border-default text-[0.625rem] uppercase tracking-wider text-text-muted font-semibold sticky top-0 z-10`}>
          <span className="cursor-pointer hover:text-text-primary" onClick={() => setSortKey('position')}>Pos</span>
          <span className="cursor-pointer hover:text-text-primary" onClick={() => setSortKey('carNumber')}>Car</span>
          <span>Class</span>
          <span>Team / Driver</span>
          <span className="text-right cursor-pointer hover:text-text-primary" onClick={() => setSortKey('lastLap')}>Last Lap</span>
          <span className="text-right cursor-pointer hover:text-text-primary" onClick={() => setSortKey('bestLap')}>Best</span>
          <span className="text-right cursor-pointer hover:text-text-primary" onClick={() => setSortKey('gap')}>Gap</span>
          <span className="text-right">Int</span>
          <span className="text-center">Laps</span>
          <span className="text-center">Pit</span>
          <span className="text-center">Sts</span>
        </div>

        {/* Timing rows */}
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <span className="section-header text-text-muted">
              {bridge.connectionState === 'connected'
                ? bridge.selectedEventId ? 'WAITING FOR DATA' : 'SELECT AN EVENT'
                : 'CONNECTING'}
            </span>
          </div>
        ) : (
          sorted.map((car, idx) => (
            <TimingRow
              key={car.carNumber}
              car={car}
              isEven={idx % 2 === 0}
              isSelected={selectedCar === car.carNumber}
              isOverallBest={car.bestTime === overallBest && !!overallBest}
              classFilter={classFilter}
              positionDelta={positionDeltas[car.carNumber] ?? null}
              pitFlash={pitFlashes[car.carNumber] ?? null}
              onClick={() => handleSelectCar(car.carNumber)}
            />
          ))
        )}
      </div>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes flag-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes flag-header-flash {
          0% { background-color: inherit; }
          10% { background-color: inherit; }
          100% { background-color: transparent; }
        }
        @keyframes pit-flash-in {
          0% { background-color: rgba(234, 179, 8, 0.25); }
          100% { background-color: transparent; }
        }
        @keyframes pit-flash-out {
          0% { background-color: rgba(34, 197, 94, 0.25); }
          100% { background-color: transparent; }
        }
        @keyframes delta-fade {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}

// ── TimingRow ────────────────────────────────────────────────────────

interface TimingRowProps {
  car: NormalizedCarPosition;
  isEven: boolean;
  isSelected: boolean;
  isOverallBest: boolean;
  classFilter: string | null;
  positionDelta: PositionDelta | null;
  pitFlash: PitFlash | null;
  onClick: () => void;
}

function TimingRow({ car, isEven, isSelected, isOverallBest, classFilter, positionDelta, pitFlash, onClick }: TimingRowProps) {
  const classColor = getClassColor(car.carClass);
  const pos = classFilter ? car.classPosition : car.overallPosition;
  const gap = classFilter
    ? (pos === 1 ? 'LEADER' : car.inClassGap || '—')
    : (car.overallPosition === 1 ? 'LEADER' : car.overallGap || '—');
  const interval = classFilter
    ? (pos === 1 ? '—' : car.inClassDifference || '—')
    : (car.overallPosition === 1 ? '—' : car.overallDifference || '—');

  const hasPenalty = car.blackFlags > 0 || car.penaltyWarnings > 0 || car.penaltyLaps > 0;
  const penaltyBorder = hasPenalty && !isSelected && !car.impactWarning;

  const pitFlashAnim = pitFlash
    ? pitFlash.type === 'entered' ? 'pit-flash-in 1.5s ease-out forwards' : 'pit-flash-out 1.5s ease-out forwards'
    : undefined;

  return (
    <div
      onClick={onClick}
      className={`
        grid ${GRID_COLS}
        gap-0 px-4 py-1.5 items-center cursor-pointer transition-colors border-b border-border-default/30
        ${isSelected ? 'bg-accent-orange-dim border-l-2 border-l-accent-orange' : isEven ? 'bg-bg-primary/50' : 'bg-bg-card/30'}
        ${car.isInPit ? 'opacity-50' : ''}
        ${car.impactWarning ? 'bg-status-red/10 border-l-2 border-l-status-red' : ''}
        ${penaltyBorder ? 'border-l-2 border-l-status-yellow' : ''}
        hover:bg-bg-hover
      `}
      style={pitFlashAnim ? { animation: pitFlashAnim } : undefined}
    >
      {/* Position + delta */}
      <div className="flex items-center gap-0.5">
        <span className="font-data text-sm font-bold text-text-primary">
          {pos || '—'}
        </span>
        {positionDelta && (
          <span
            className={`font-data text-[0.5625rem] font-bold leading-none ${positionDelta.delta > 0 ? 'text-status-green' : 'text-status-red'}`}
            style={{ animation: `delta-fade ${DELTA_FADE_MS}ms ease-out forwards` }}
          >
            {positionDelta.delta > 0 ? '▲' : '▼'}{Math.abs(positionDelta.delta)}
          </span>
        )}
      </div>

      {/* Car Number */}
      <span
        className="font-data text-sm font-bold px-1.5 py-0.5 rounded text-center"
        style={{ backgroundColor: `${classColor}20`, color: classColor, border: `1px solid ${classColor}40` }}
      >
        {car.carNumber}
      </span>

      {/* Class */}
      <span className="text-[0.6875rem] text-text-muted truncate pl-2" title={car.carClass}>
        {car.carClass || '—'}
      </span>

      {/* Team / Driver */}
      <div className="flex flex-col min-w-0 pr-2">
        <span className="text-xs text-text-primary font-medium truncate">
          {car.teamName || '—'}
        </span>
        <span className="text-[0.625rem] text-text-muted truncate">
          {car.driverName || '—'}
        </span>
      </div>

      {/* Last Lap */}
      <span className={`font-data text-xs text-right ${car.isBestTime ? 'text-status-green font-bold' : 'text-text-primary'}`}>
        {formatLapTime(car.lastLapTime)}
      </span>

      {/* Best Lap */}
      <span className={`font-data text-xs text-right ${isOverallBest ? 'text-status-green font-bold' : 'text-text-secondary'}`}>
        {formatLapTime(car.bestTime)}
      </span>

      {/* Gap */}
      <span className="font-data text-xs text-right text-text-muted">
        {gap}
      </span>

      {/* Interval */}
      <span className="font-data text-xs text-right text-text-muted">
        {interval}
      </span>

      {/* Laps */}
      <span className="font-data text-xs text-center text-text-primary">
        {car.lastLapCompleted || '—'}
      </span>

      {/* Pit Count */}
      <span className="font-data text-xs text-center text-text-muted">
        {car.pitStopCount || '—'}
      </span>

      {/* Status — enhanced penalty/warning display */}
      <div className="flex items-center justify-center gap-0.5 flex-wrap">
        {car.blackFlags > 0 && (
          <span className="inline-flex items-center px-1 py-px text-[0.5rem] font-bold uppercase rounded bg-black text-white border border-white/30 leading-none">
            BF
          </span>
        )}
        {car.penaltyWarnings > 0 && (
          <span className="inline-flex items-center px-1 py-px text-[0.5rem] font-bold uppercase rounded bg-status-yellow/20 text-status-yellow border border-status-yellow/40 leading-none">
            W:{car.penaltyWarnings}
          </span>
        )}
        {car.penaltyLaps > 0 && (
          <span className="inline-flex items-center px-1 py-px text-[0.5rem] font-bold uppercase rounded bg-accent-orange/20 text-accent-orange border border-accent-orange/40 leading-none">
            P:{car.penaltyLaps}
          </span>
        )}
        {car.blackFlags === 0 && car.penaltyWarnings === 0 && car.penaltyLaps === 0 && (
          <span className={`text-[0.625rem] font-semibold uppercase ${
            car.impactWarning ? 'text-status-red' : car.isInPit ? 'text-status-yellow' : 'text-status-green'
          }`}>
            {car.impactWarning ? '!!' : car.isInPit ? 'PIT' : 'GO'}
          </span>
        )}
      </div>
    </div>
  );
}
