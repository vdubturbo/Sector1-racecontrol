'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useActivePitStops } from '@/hooks/useActivePitStops';
import { useSessionDrivers } from '@/hooks/useSessionDrivers';
import { useQuadContext } from '../QuadContext';
import type { QuadViewProps } from '../types';

type PitRow = {
  carNumber: string;
  teamName: string;
  driverName: string;
  elapsedMs: number;
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
  const { pitStops, isLoading, error } = useActivePitStops(sessionUuid, userId);
  const { drivers: sessionDrivers } = useSessionDrivers(sessionUuid, userId);

  // Team name enrichment is the one thing we still pull from the live feed:
  // the bridge already knows each car's team name. The DB would require
  // another join, and bridge-derived team names are fine for display.
  const teamByCar = useMemo(() => {
    const map = new Map<string, string>();
    for (const pos of bridge.positions) {
      if (pos.carNumber && pos.teamName) map.set(pos.carNumber, pos.teamName);
    }
    return map;
  }, [bridge.positions]);

  // Driver name per car — primary driver from session_drivers.
  const driverByCar = useMemo(() => {
    const map = new Map<string, string>();
    for (const sd of sessionDrivers) {
      if (sd.isPrimary && sd.carNumber && sd.driverName) {
        map.set(sd.carNumber, sd.driverName);
      }
    }
    return map;
  }, [sessionDrivers]);

  // Re-render every second so the elapsed timer ticks between realtime
  // events. pit_stops changes come in via supabase subscription; the tick is
  // purely for the running clock.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const now = Date.now();
  // Cross-check open pit_stops rows against the live bridge isInPit signal.
  // The bridge can strand entry rows (in-memory state lost on restart, or
  // reconciliation gaps for cars that go quiet after a false-positive
  // entry), and persisted rows alone can't tell stranded from active.
  // Skip a row only when the bridge is reporting the car AND says it's not
  // in pit; an undefined live signal (car not in feed) is left alone so a
  // disconnected feed doesn't blank pit road.
  const liveInPitByCar = new Map<string, boolean>();
  for (const pos of bridge.positions) {
    if (pos.carNumber) liveInPitByCar.set(pos.carNumber, pos.isInPit);
  }

  // Dedupe to one open row per car. Newest pit_in_time wins, with id as a
  // tie-break for determinism.
  const latestByCar = new Map<string, typeof pitStops[number]>();
  for (const stop of pitStops) {
    if (!stop.carNumber) continue;
    if (liveInPitByCar.get(stop.carNumber) === false) continue;
    const existing = latestByCar.get(stop.carNumber);
    if (!existing) {
      latestByCar.set(stop.carNumber, stop);
      continue;
    }
    const tNew = Date.parse(stop.pitInTime);
    const tOld = Date.parse(existing.pitInTime);
    if (tNew > tOld || (tNew === tOld && stop.id > existing.id)) {
      latestByCar.set(stop.carNumber, stop);
    }
  }

  const rows: PitRow[] = Array.from(latestByCar.values())
    .map((stop) => {
      const ts = Date.parse(stop.pitInTime);
      const elapsedMs = Number.isFinite(ts) ? now - ts : 0;
      return {
        carNumber: stop.carNumber,
        teamName: teamByCar.get(stop.carNumber) || '',
        driverName: driverByCar.get(stop.carNumber) || '',
        elapsedMs,
      };
    })
    .sort((a, b) => b.elapsedMs - a.elapsedMs);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-status-red text-xs px-3 text-center">
        {error}
      </div>
    );
  }

  if (isLoading && rows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-xs">
        Loading…
      </div>
    );
  }

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
            <span className="font-data text-base text-accent-orange tabular-nums text-right">
              {formatDuration(row.elapsedMs)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
