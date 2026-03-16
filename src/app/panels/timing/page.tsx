'use client';

import { useState, useMemo } from 'react';
import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import type { FlagColor, NormalizedCarPosition } from '@/types/racing';

// Class colors matching Sector1 main app
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

function getClassColor(carClass: string): string {
  if (!carClass) return '#666';
  const upper = carClass.toUpperCase();
  for (const [key, color] of Object.entries(CLASS_COLORS)) {
    if (upper.includes(key.toUpperCase())) return color;
  }
  // Hash-based fallback for unknown classes
  let hash = 0;
  for (let i = 0; i < carClass.length; i++) hash = carClass.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 55%)`;
}

function formatLapTime(time: string): string {
  if (!time || time === '0' || time === '00:00:00.000') return '—:——.———';
  return time;
}

type SortKey = 'position' | 'carNumber' | 'lastLap' | 'bestLap' | 'gap';

export default function TimingPanel() {
  const bridge = useBridgeSocket();
  const [flagColor, setFlagColor] = useState<FlagColor | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('position');
  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  const { broadcast } = useBroadcastChannel({
    onEventSelected: (msg) => bridge.selectEvent(msg.eventId),
    onFlagChange: (msg) => setFlagColor(msg.flagColor),
    onCarSelected: (msg) => setSelectedCar(msg.carNumber),
  });

  const eventName = bridge.availableEvents.find(
    (e) => e.eventId === bridge.selectedEventId
  )?.name ?? bridge.selectedEventId ?? null;

  const sorted = useMemo(() => {
    const positions = [...bridge.positions];
    switch (sortKey) {
      case 'position':
        return positions.sort((a, b) => (a.overallPosition || 999) - (b.overallPosition || 999));
      case 'carNumber':
        return positions.sort((a, b) => a.carNumber.localeCompare(b.carNumber, undefined, { numeric: true }));
      case 'lastLap':
        return positions.sort((a, b) => (a.lastLapTime || 'zzz').localeCompare(b.lastLapTime || 'zzz'));
      case 'bestLap':
        return positions.sort((a, b) => (a.bestTime || 'zzz').localeCompare(b.bestTime || 'zzz'));
      case 'gap':
        return positions.sort((a, b) => (a.overallPosition || 999) - (b.overallPosition || 999));
      default:
        return positions;
    }
  }, [bridge.positions, sortKey]);

  // Find overall best lap
  const overallBest = useMemo(() => {
    let best = '';
    for (const p of bridge.positions) {
      if (p.bestTime && p.bestTime !== '0' && (!best || p.bestTime < best)) {
        best = p.bestTime;
      }
    }
    return best;
  }, [bridge.positions]);

  const carCount = bridge.positions.length;
  const inPitCount = bridge.positions.filter((p) => p.isInPit).length;

  return (
    <>
      <PanelHeader
        panelName="Live Timing"
        panelIcon="⏱"
        connectionState={bridge.connectionState}
        eventName={eventName}
        flagColor={bridge.raceState?.flagColor ?? flagColor}
      />

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

      {/* Column headers */}
      <div className="grid grid-cols-[3rem_4rem_4.5rem_1fr_7rem_7rem_7rem_5.5rem_5.5rem_5.5rem_5.5rem_5.5rem_3.5rem_3.5rem] gap-0 px-4 py-2 bg-bg-card border-b border-border-default text-[0.625rem] uppercase tracking-wider text-text-muted font-semibold shrink-0">
        <span className="cursor-pointer hover:text-text-primary" onClick={() => setSortKey('position')}>Pos</span>
        <span className="cursor-pointer hover:text-text-primary" onClick={() => setSortKey('carNumber')}>Car</span>
        <span>Class</span>
        <span>Driver / Team</span>
        <span className="text-right cursor-pointer hover:text-text-primary" onClick={() => setSortKey('lastLap')}>Last Lap</span>
        <span className="text-right cursor-pointer hover:text-text-primary" onClick={() => setSortKey('bestLap')}>Best</span>
        <span className="text-right cursor-pointer hover:text-text-primary" onClick={() => setSortKey('gap')}>Gap</span>
        <span className="text-right">Int</span>
        <span className="text-right">S1</span>
        <span className="text-right">S2</span>
        <span className="text-right">S3</span>
        <span className="text-center">Laps</span>
        <span className="text-center">Pit</span>
        <span className="text-center">Sts</span>
      </div>

      {/* Timing rows */}
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <span className="section-header text-text-muted">
                {bridge.connectionState === 'connected'
                  ? bridge.selectedEventId ? 'WAITING FOR DATA' : 'SELECT AN EVENT'
                  : 'CONNECTING'}
              </span>
            </div>
          </div>
        ) : (
          sorted.map((car, idx) => (
            <TimingRow
              key={car.carNumber}
              car={car}
              isEven={idx % 2 === 0}
              isSelected={selectedCar === car.carNumber}
              isOverallBest={car.bestTime === overallBest && !!overallBest}
              onClick={() => {
                const next = selectedCar === car.carNumber ? null : car.carNumber;
                setSelectedCar(next);
                broadcast({ type: 'car_selected', carNumber: next });
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

interface TimingRowProps {
  car: NormalizedCarPosition;
  isEven: boolean;
  isSelected: boolean;
  isOverallBest: boolean;
  onClick: () => void;
}

function TimingRow({ car, isEven, isSelected, isOverallBest, onClick }: TimingRowProps) {
  const classColor = getClassColor(car.carClass);

  return (
    <div
      onClick={onClick}
      className={`
        grid grid-cols-[3rem_4rem_4.5rem_1fr_7rem_7rem_7rem_5.5rem_5.5rem_5.5rem_5.5rem_5.5rem_3.5rem_3.5rem]
        gap-0 px-4 py-1.5 items-center cursor-pointer transition-colors border-b border-border-default/30
        ${isSelected ? 'bg-accent-orange-dim border-l-2 border-l-accent-orange' : isEven ? 'bg-bg-primary/50' : 'bg-bg-card/30'}
        ${car.isInPit ? 'opacity-50' : ''}
        ${car.impactWarning ? 'bg-status-red/10 border-l-2 border-l-status-red' : ''}
        hover:bg-bg-hover
      `}
    >
      {/* Position */}
      <span className="font-data text-sm font-bold text-text-primary">
        {car.overallPosition || '—'}
      </span>

      {/* Car Number */}
      <span
        className="font-data text-sm font-bold px-1.5 py-0.5 rounded text-center"
        style={{ backgroundColor: `${classColor}20`, color: classColor, border: `1px solid ${classColor}40` }}
      >
        {car.carNumber}
      </span>

      {/* Class */}
      <span className="text-[0.6875rem] text-text-muted truncate" title={car.carClass}>
        {car.carClass || '—'}
      </span>

      {/* Driver / Team */}
      <div className="flex flex-col min-w-0 pr-2">
        <span className="text-xs text-text-primary font-medium truncate">
          {car.driverName || '—'}
        </span>
        <span className="text-[0.625rem] text-text-muted truncate">
          {car.teamName || '—'}
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

      {/* Gap to Leader */}
      <span className="font-data text-xs text-right text-text-muted">
        {car.overallPosition === 1 ? 'LEADER' : car.overallGap || '—'}
      </span>

      {/* Interval */}
      <span className="font-data text-xs text-right text-text-muted">
        {car.overallPosition === 1 ? '—' : car.overallDifference || '—'}
      </span>

      {/* S1 — placeholder until sector data is wired */}
      <span className="font-data text-xs text-right text-text-muted">—</span>

      {/* S2 */}
      <span className="font-data text-xs text-right text-text-muted">—</span>

      {/* S3 */}
      <span className="font-data text-xs text-right text-text-muted">—</span>

      {/* Laps */}
      <span className="font-data text-xs text-center text-text-primary">
        {car.lastLapCompleted || '—'}
      </span>

      {/* Pit Count */}
      <span className="font-data text-xs text-center text-text-muted">
        {car.pitStopCount || '—'}
      </span>

      {/* Status */}
      <span className={`text-[0.625rem] text-center font-semibold uppercase ${car.isInPit ? 'text-status-yellow' : car.impactWarning ? 'text-status-red' : 'text-status-green'}`}>
        {car.impactWarning ? '!!' : car.isInPit ? 'PIT' : 'GO'}
      </span>
    </div>
  );
}
