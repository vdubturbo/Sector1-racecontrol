'use client';

import { useEffect, useRef, useState } from 'react';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
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

  // Per-car stint tracking, keyed by car number. When the driver name for a
  // given car changes (or appears for the first time this session), we reset
  // `since` to now. This gives us "time in current stint" — the cleanest live
  // proxy for "time in car" without a DB-backed stint log.
  const stintStartsRef = useRef<Map<string, StintStart>>(new Map());

  useEffect(() => {
    const now = Date.now();
    const starts = stintStartsRef.current;
    for (const pos of bridge.positions) {
      if (!pos.driverName) continue;
      const existing = starts.get(pos.carNumber);
      if (!existing || existing.driverName !== pos.driverName) {
        starts.set(pos.carNumber, { driverName: pos.driverName, since: now });
      }
    }
  }, [bridge.positions]);

  // Force a re-render every second so the elapsed timer advances even when no
  // new bridge messages arrive.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const now = Date.now();
  const rows = bridge.positions
    .filter((pos) => pos.driverName)
    .map((pos) => {
      const start = stintStartsRef.current.get(pos.carNumber);
      const elapsedMs = start?.driverName === pos.driverName ? now - start.since : 0;
      return {
        carNumber: pos.carNumber,
        teamName: pos.teamName,
        driverName: pos.driverName,
        laps: pos.lastLapCompleted,
        elapsedMs,
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
      {/* Column headers */}
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
            <span className="font-data text-sm text-accent-orange tabular-nums text-right">
              {formatDuration(row.elapsedMs)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
