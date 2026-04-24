'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useActivePitStops } from '@/hooks/useActivePitStops';
import { useSessionDrivers } from '@/hooks/useSessionDrivers';
import { useQuadContext } from '../QuadContext';
import type { QuadViewProps } from '../types';

type Source = 'db' | 'local' | 'none';

type PitRow = {
  carNumber: string;
  teamName: string;
  driverName: string;
  elapsedMs: number;
  source: Source;
};

function formatDuration(ms: number): string {
  if (ms <= 0) return '0:00';
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function PitRoadView(_props: QuadViewProps) {
  const bridge = useBridgeSocket();
  const { sessionUuid, userId } = useQuadContext();
  const { pitStops } = useActivePitStops(sessionUuid, userId);
  const { drivers: sessionDrivers } = useSessionDrivers(sessionUuid, userId);

  // Driver name per car (primary only).
  const driverByCar = useMemo(() => {
    const map = new Map<string, string>();
    for (const sd of sessionDrivers) {
      if (sd.isPrimary && sd.carNumber && sd.driverName) {
        map.set(sd.carNumber, sd.driverName);
      }
    }
    return map;
  }, [sessionDrivers]);

  // DB-backed pit_in_time per car.
  const pitInByCar = useMemo(() => {
    const map = new Map<string, number>();
    for (const stop of pitStops) {
      if (!stop.carNumber) continue;
      const ts = Date.parse(stop.pitInTime);
      if (!Number.isNaN(ts)) map.set(stop.carNumber, ts);
    }
    return map;
  }, [pitStops]);

  // Client-side fallback: note when isInPit first flipped to true for a car.
  // Clear when the car leaves pit.
  const localPitInRef = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    const now = Date.now();
    const map = localPitInRef.current;
    const currentCars = new Set<string>();
    for (const pos of bridge.positions) {
      if (pos.isInPit && pos.carNumber) {
        currentCars.add(pos.carNumber);
        if (!map.has(pos.carNumber)) map.set(pos.carNumber, now);
      }
    }
    // Drop cars no longer in pit so next entry starts a fresh timer.
    for (const car of Array.from(map.keys())) {
      if (!currentCars.has(car)) map.delete(car);
    }
  }, [bridge.positions]);

  // Re-render every second so timers advance between bridge messages.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const now = Date.now();
  const rows: PitRow[] = bridge.positions
    .filter((pos) => pos.isInPit)
    .map((pos): PitRow => {
      const dbStart = pitInByCar.get(pos.carNumber);
      const localStart = localPitInRef.current.get(pos.carNumber);
      const start = dbStart ?? localStart;
      const source: Source = dbStart ? 'db' : localStart ? 'local' : 'none';
      return {
        carNumber: pos.carNumber,
        teamName: pos.teamName,
        driverName: driverByCar.get(pos.carNumber) || pos.driverName || '',
        elapsedMs: start ? now - start : 0,
        source,
      };
    })
    .sort((a, b) => b.elapsedMs - a.elapsedMs);

  if (rows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-xs">
        Pit lane clear
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[3.5rem_1fr_auto] gap-3 px-3 py-1.5 border-b border-border-default bg-bg-surface text-xs uppercase tracking-wider text-text-secondary font-semibold">
        <span>Car</span>
        <span>Team / Driver</span>
        <span className="text-right">In Pit</span>
      </div>

      <div className="divide-y divide-border-default/50">
        {rows.map((row) => (
          <div
            key={row.carNumber}
            className="grid grid-cols-[3.5rem_1fr_auto] gap-3 px-3 py-2 items-center"
          >
            <span className="font-data text-base font-bold text-accent-orange">
              #{row.carNumber}
            </span>
            <div className="min-w-0 leading-tight">
              <div className="text-sm text-text-secondary truncate" title={row.teamName}>
                {row.teamName || '—'}
              </div>
              <div className="text-xs text-text-primary truncate" title={row.driverName}>
                {row.driverName || '—'}
              </div>
            </div>
            <span
              className={`font-data text-base tabular-nums text-right ${
                row.source === 'db'
                  ? 'text-accent-orange'
                  : row.source === 'local'
                  ? 'text-text-muted'
                  : 'text-text-muted/40'
              }`}
              title={
                row.source === 'db'
                  ? 'Pit entry time from pit_stops (DB)'
                  : row.source === 'local'
                  ? 'Pit entry tracked client-side this session'
                  : 'No pit entry time available'
              }
            >
              {row.source === 'none' ? '—' : formatDuration(row.elapsedMs)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
