'use client';

import { useMemo, useState, useCallback } from 'react';
import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import type { NormalizedCarPosition, FlagColor } from '@/types/racing';

// Assign a stable color per class
const CLASS_COLORS: Record<string, string> = {};
const PALETTE = ['#e8751a', '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b', '#6366f1'];
let colorIdx = 0;
function classColor(carClass: string): string {
  if (!CLASS_COLORS[carClass]) {
    CLASS_COLORS[carClass] = PALETTE[colorIdx % PALETTE.length];
    colorIdx++;
  }
  return CLASS_COLORS[carClass];
}

export default function TrackMapPanel() {
  const bridge = useBridgeSocket();
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [broadcastFlagColor, setBroadcastFlagColor] = useState<FlagColor | null>(null);

  const { broadcast } = useBroadcastChannel({
    onEventSelected: (msg) => bridge.selectEvent(msg.eventId),
    onFlagChange: (msg) => setBroadcastFlagColor(msg.flagColor),
    onCarSelected: (msg) => setSelectedCar(msg.carNumber),
  });

  const handleCarClick = useCallback(
    (carNumber: string) => {
      const next = selectedCar === carNumber ? null : carNumber;
      setSelectedCar(next);
      broadcast({ type: 'car_selected', carNumber: next });
    },
    [selectedCar, broadcast]
  );

  const flagColor = bridge.raceState?.flagColor ?? broadcastFlagColor ?? null;

  // Filter cars with GPS coordinates
  const carsWithGps = useMemo(
    () => bridge.positions.filter((p) => p.latitude != null && p.longitude != null),
    [bridge.positions]
  );

  // Compute bounds for coordinate mapping
  const bounds = useMemo(() => {
    if (carsWithGps.length === 0) return null;
    let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
    for (const car of carsWithGps) {
      const lat = car.latitude!;
      const lon = car.longitude!;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
    }
    // Add padding
    const latPad = (maxLat - minLat) * 0.1 || 0.001;
    const lonPad = (maxLon - minLon) * 0.1 || 0.001;
    return {
      minLat: minLat - latPad,
      maxLat: maxLat + latPad,
      minLon: minLon - lonPad,
      maxLon: maxLon + lonPad,
    };
  }, [carsWithGps]);

  const eventName = bridge.availableEvents.find(
    (e) => e.eventId === bridge.selectedEventId
  )?.name ?? bridge.selectedEventId ?? null;

  return (
    <>
      <PanelHeader
        panelName="Track Map"
        panelIcon="🗺"
        connectionState={bridge.connectionState}
        eventName={eventName}
        flagColor={flagColor}
      />

      {/* Event selector */}
      {!bridge.selectedEventId && bridge.availableEvents.length > 0 && (
        <div className="px-3 py-2 bg-bg-card border-b border-border-default">
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
      <div className="flex items-center gap-4 px-3 py-1.5 bg-bg-card border-b border-border-default text-[0.625rem] uppercase tracking-wider text-text-muted">
        <span>
          Cars: <span className="text-text-primary font-semibold">{bridge.positions.length}</span>
        </span>
        <span>
          GPS: <span className="text-text-primary font-semibold">{carsWithGps.length}</span>
        </span>
        <span>
          In Pit: <span className="text-status-yellow font-semibold">{bridge.positions.filter((p) => p.isInPit).length}</span>
        </span>
        {bridge.positions.some((p) => p.impactWarning) && (
          <span className="text-status-red font-bold animate-pulse">
            IMPACT WARNING
          </span>
        )}
      </div>

      {/* Track map area */}
      <div className="flex-1 relative bg-bg-primary overflow-hidden">
        {carsWithGps.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <span className="section-header text-text-muted">
                {bridge.connectionState === 'connected'
                  ? bridge.selectedEventId
                    ? 'WAITING FOR GPS DATA'
                    : 'SELECT AN EVENT'
                  : 'CONNECTING TO BRIDGE'}
              </span>
              <p className="text-text-muted text-xs mt-2 font-[var(--font-mono)]">
                {bridge.connectionState !== 'connected'
                  ? bridge.error ?? 'Establishing connection...'
                  : 'Car positions will appear when GPS data is available'}
              </p>
            </div>
          </div>
        ) : (
          <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
            {bounds && carsWithGps.map((car) => (
              <CarDot
                key={car.carNumber}
                car={car}
                bounds={bounds}
                isSelected={selectedCar === car.carNumber}
                onClick={() => handleCarClick(car.carNumber)}
              />
            ))}
          </svg>
        )}

        {/* Selected car detail */}
        {selectedCar && (
          <SelectedCarOverlay
            car={bridge.positions.find((p) => p.carNumber === selectedCar) ?? null}
            onClose={() => {
              setSelectedCar(null);
              broadcast({ type: 'car_selected', carNumber: null });
            }}
          />
        )}
      </div>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────

interface CarDotProps {
  car: NormalizedCarPosition;
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number };
  isSelected: boolean;
  onClick: () => void;
}

function CarDot({ car, bounds, isSelected, onClick }: CarDotProps) {
  // Map lat/lon to SVG coordinates (invert lat since SVG y goes down)
  const x = ((car.longitude! - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 900 + 50;
  const y = ((bounds.maxLat - car.latitude!) / (bounds.maxLat - bounds.minLat)) * 900 + 50;
  const color = classColor(car.carClass);
  const dimmed = car.isInPit;

  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      opacity={dimmed ? 0.35 : 1}
    >
      {/* Impact warning ring */}
      {car.impactWarning && (
        <circle cx={x} cy={y} r={14} fill="none" stroke="#ef4444" strokeWidth={2} className="animate-pulse" />
      )}
      {/* Selection ring */}
      {isSelected && (
        <circle cx={x} cy={y} r={12} fill="none" stroke="#e8751a" strokeWidth={2} />
      )}
      {/* Car dot */}
      <circle cx={x} cy={y} r={6} fill={color} stroke="#111" strokeWidth={1.5} />
      {/* Car number label */}
      <text
        x={x}
        y={y - 10}
        textAnchor="middle"
        fill={isSelected ? '#e8751a' : '#ccc'}
        fontSize={isSelected ? 11 : 9}
        fontFamily="var(--font-mono)"
        fontWeight={isSelected ? 700 : 500}
      >
        {car.carNumber}
      </text>
    </g>
  );
}

interface SelectedCarOverlayProps {
  car: NormalizedCarPosition | null;
  onClose: () => void;
}

function SelectedCarOverlay({ car, onClose }: SelectedCarOverlayProps) {
  if (!car) return null;

  return (
    <div className="absolute bottom-3 left-3 bg-bg-card border border-border-subtle rounded p-3 min-w-56 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-data text-lg font-bold text-accent-orange">#{car.carNumber}</span>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary text-sm">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-text-muted">Driver</span>
        <span className="text-text-primary font-[var(--font-mono)]">{car.driverName || '—'}</span>
        <span className="text-text-muted">Team</span>
        <span className="text-text-primary">{car.teamName || '—'}</span>
        <span className="text-text-muted">Class</span>
        <span className="text-text-primary">{car.carClass || '—'}</span>
        <span className="text-text-muted">Position</span>
        <span className="text-text-primary font-[var(--font-mono)]">P{car.overallPosition} (C{car.classPosition})</span>
        <span className="text-text-muted">Last Lap</span>
        <span className="text-text-primary font-[var(--font-mono)]">{car.lastLapTime || '—'}</span>
        <span className="text-text-muted">Best</span>
        <span className={`font-[var(--font-mono)] ${car.isBestTime ? 'text-status-green' : 'text-text-primary'}`}>{car.bestTime || '—'}</span>
        <span className="text-text-muted">Laps</span>
        <span className="text-text-primary font-[var(--font-mono)]">{car.lastLapCompleted}</span>
        <span className="text-text-muted">Pits</span>
        <span className="text-text-primary font-[var(--font-mono)]">{car.pitStopCount}</span>
        <span className="text-text-muted">Status</span>
        <span className={`font-[var(--font-mono)] ${car.isInPit ? 'text-status-yellow' : 'text-status-green'}`}>
          {car.isInPit ? 'IN PIT' : car.currentStatus || 'On Track'}
        </span>
        {car.impactWarning && (
          <>
            <span className="text-status-red font-bold col-span-2 mt-1">IMPACT WARNING</span>
          </>
        )}
        {car.blackFlags > 0 && (
          <>
            <span className="text-text-muted">Black Flags</span>
            <span className="text-status-red font-[var(--font-mono)]">{car.blackFlags}</span>
          </>
        )}
      </div>
    </div>
  );
}
