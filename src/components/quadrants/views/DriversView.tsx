'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useSessionDrivers } from '@/hooks/useSessionDrivers';
import { useQuadContext } from '../QuadContext';
import type { QuadViewProps } from '../types';

type StintStart = { driverName: string; since: number };

function formatDuration(ms: number): string {
  if (ms <= 0) return '0:00:00';
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function DriversView(_props: QuadViewProps) {
  const bridge = useBridgeSocket();
  const { sessionUuid, userId } = useQuadContext();
  const { drivers: sessionDrivers } = useSessionDrivers(sessionUuid, userId);

  // Authoritative stint start by car number, sourced from session_drivers
  // (is_primary row per car).
  const stintStartByCar = useMemo(() => {
    const map = new Map<string, number>();
    for (const sd of sessionDrivers) {
      if (sd.isPrimary && sd.carNumber && sd.stintStartTime) {
        const ts = Date.parse(sd.stintStartTime);
        if (!Number.isNaN(ts)) map.set(sd.carNumber, ts);
      }
    }
    return map;
  }, [sessionDrivers]);

  // Fallback: if the DB doesn't have a stint start for a car yet, track it
  // client-side so the timer still starts *something*. Reset on driver change.
  const fallbackRef = useRef<Map<string, StintStart>>(new Map());
  useEffect(() => {
    const now = Date.now();
    const starts = fallbackRef.current;
    for (const pos of bridge.positions) {
      if (!pos.driverName) continue;
      const existing = starts.get(pos.carNumber);
      if (!existing || existing.driverName !== pos.driverName) {
        starts.set(pos.carNumber, { driverName: pos.driverName, since: now });
      }
    }
  }, [bridge.positions]);

  // Re-render every second so the elapsed timer advances between bridge
  // messages.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const now = Date.now();
  const rows = bridge.positions
    .filter((pos) => pos.driverName)
    .map((pos) => {
      const dbStart = stintStartByCar.get(pos.carNumber);
      const fallback = fallbackRef.current.get(pos.carNumber);
      const fallbackStart =
        fallback?.driverName === pos.driverName ? fallback.since : undefined;

      const stintStart = dbStart ?? fallbackStart;
      const elapsedMs = stintStart ? now - stintStart : 0;

      return {
        carNumber: pos.carNumber,
        teamName: pos.teamName,
        driverName: pos.driverName,
        laps: pos.lastLapCompleted,
        elapsedMs,
        inCarSource: dbStart ? ('db' as const) : fallbackStart ? ('local' as const) : ('none' as const),
        isInPit: pos.isInPit,
      };
    })
    .sort((a, b) => {
      const an = parseInt(a.carNumber, 10);
      const bn = parseInt(b.carNumber, 10);
      if (Number.isFinite(an) && Number.isFinite(bn) && an !== bn) return an - bn;
      return a.carNumber.localeCompare(b.carNumber);
    });

  if (rows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-xs">
        No active drivers
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[3.5rem_1fr_auto_auto] gap-3 px-3 py-1.5 border-b border-border-default bg-bg-surface text-[0.625rem] uppercase tracking-wider text-text-secondary font-semibold">
        <span>Car</span>
        <span>Team / Driver</span>
        <span className="text-right">Laps</span>
        <span className="text-right">In Car</span>
      </div>

      <div className="divide-y divide-border-default/50">
        {rows.map((row) => (
          <div
            key={row.carNumber}
            className="grid grid-cols-[3.5rem_1fr_auto_auto] gap-3 px-3 py-1.5 items-center"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-data text-base font-bold text-accent-orange">
                #{row.carNumber}
              </span>
              {row.isInPit && (
                <span className="text-[0.5625rem] font-semibold uppercase tracking-wider text-status-yellow">
                  PIT
                </span>
              )}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-sm text-text-secondary truncate" title={row.teamName}>
                {row.teamName || '—'}
              </div>
              <div className="text-xs text-text-primary truncate" title={row.driverName}>
                {row.driverName}
              </div>
            </div>
            <span className="font-data text-sm text-text-primary tabular-nums text-right">
              {row.laps}
            </span>
            <span
              className={`font-data text-sm tabular-nums text-right ${
                row.inCarSource === 'db'
                  ? 'text-accent-orange'
                  : row.inCarSource === 'local'
                  ? 'text-text-muted'
                  : 'text-text-muted/40'
              }`}
              title={
                row.inCarSource === 'db'
                  ? 'Stint start from session_drivers (DB)'
                  : row.inCarSource === 'local'
                  ? 'Stint start tracked client-side this session — open view before the race for accurate time'
                  : 'No stint start available'
              }
            >
              {row.inCarSource === 'none' ? '—' : formatDuration(row.elapsedMs)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
