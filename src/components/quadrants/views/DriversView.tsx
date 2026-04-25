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

type SortColumn = 'car' | 'team' | 'driver' | 'laps' | 'inCar';
type SortDirection = 'asc' | 'desc';

interface DriverRow {
  carNumber: string;
  teamName: string;
  driverName: string;
  laps: number;
  elapsedMs: number;
  inCarSource: 'db' | 'local' | 'none';
  isInPit: boolean;
}

function compareCarNumbers(a: string, b: string): number {
  const an = parseInt(a, 10);
  const bn = parseInt(b, 10);
  if (Number.isFinite(an) && Number.isFinite(bn) && an !== bn) return an - bn;
  return a.localeCompare(b);
}

const COMPARATORS: Record<SortColumn, (a: DriverRow, b: DriverRow) => number> = {
  car: (a, b) => compareCarNumbers(a.carNumber, b.carNumber),
  team: (a, b) => (a.teamName || '').localeCompare(b.teamName || ''),
  driver: (a, b) => (a.driverName || '').localeCompare(b.driverName || ''),
  laps: (a, b) => a.laps - b.laps,
  inCar: (a, b) => a.elapsedMs - b.elapsedMs,
};

export function DriversView(_props: QuadViewProps) {
  const bridge = useBridgeSocket();
  const { sessionUuid, userId } = useQuadContext();
  const { drivers: sessionDrivers } = useSessionDrivers(sessionUuid, userId);
  const [sortColumn, setSortColumn] = useState<SortColumn>('car');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (col: SortColumn) => {
    if (col === sortColumn) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      // Default to descending for the numeric/temporal columns since
      // "leaders/longest first" is the more useful starting view there.
      setSortDirection(col === 'laps' || col === 'inCar' ? 'desc' : 'asc');
    }
  };

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
  const rows: DriverRow[] = bridge.positions
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
        inCarSource: dbStart ? 'db' : fallbackStart ? 'local' : 'none',
        isInPit: pos.isInPit,
      };
    });

  rows.sort((a, b) => {
    const result = COMPARATORS[sortColumn](a, b);
    return sortDirection === 'asc' ? result : -result;
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
      <div className="grid grid-cols-[3.5rem_1fr_1fr_auto_auto] gap-3 px-3 py-1.5 border-b border-border-default bg-bg-surface text-xs uppercase tracking-wider text-text-secondary font-semibold">
        <SortHeader column="car" current={sortColumn} direction={sortDirection} onSort={handleSort}>
          Car
        </SortHeader>
        <SortHeader column="team" current={sortColumn} direction={sortDirection} onSort={handleSort}>
          Team
        </SortHeader>
        <SortHeader column="driver" current={sortColumn} direction={sortDirection} onSort={handleSort}>
          Driver
        </SortHeader>
        <SortHeader column="laps" current={sortColumn} direction={sortDirection} onSort={handleSort} align="right">
          Laps
        </SortHeader>
        <SortHeader column="inCar" current={sortColumn} direction={sortDirection} onSort={handleSort} align="right">
          In Car
        </SortHeader>
      </div>

      <div className="divide-y divide-border-default/50">
        {rows.map((row) => (
          <div
            key={row.carNumber}
            className="grid grid-cols-[3.5rem_1fr_1fr_auto_auto] gap-3 px-3 py-2 items-center"
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
            <div className="min-w-0 text-sm text-text-secondary truncate" title={row.teamName}>
              {row.teamName || '—'}
            </div>
            <div className="min-w-0 text-sm text-text-primary truncate" title={row.driverName}>
              {row.driverName}
            </div>
            <span className="font-data text-base text-text-primary tabular-nums text-right">
              {row.laps}
            </span>
            <span
              className={`font-data text-base tabular-nums text-right ${
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

interface SortHeaderProps {
  column: SortColumn;
  current: SortColumn;
  direction: SortDirection;
  onSort: (col: SortColumn) => void;
  align?: 'left' | 'right';
  children: React.ReactNode;
}

function SortHeader({ column, current, direction, onSort, align = 'left', children }: SortHeaderProps) {
  const isActive = column === current;
  const arrow = isActive ? (direction === 'asc' ? '▲' : '▼') : '';
  const justify = align === 'right' ? 'justify-end' : 'justify-start';
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`flex items-center gap-1 ${justify} text-xs uppercase tracking-wider font-semibold transition-colors ${
        isActive ? 'text-accent-orange' : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      <span>{children}</span>
      <span className="text-[0.5rem]">{arrow || ' '}</span>
    </button>
  );
}
