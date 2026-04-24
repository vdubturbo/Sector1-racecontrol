'use client';

import { useMemo } from 'react';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import type { QuadViewProps } from '../types';

type LeaderRow = {
  classPosition: number;
  carNumber: string;
  teamName: string;
  driverName: string;
  lastLapTime: string;
};

type ClassGroup = {
  className: string;
  rows: LeaderRow[];
};

// Lap times arrive as HH:MM:SS.mmm. Strip the hours block when it's 00 —
// a lap will never be an hour long.
function formatLapTime(raw: string): string {
  if (!raw) return '—:——.———';
  return raw.startsWith('00:') ? raw.slice(3) : raw;
}

export function LeadersView(_props: QuadViewProps) {
  const bridge = useBridgeSocket();

  // Group whatever classes the feed is reporting. Classes appear and disappear
  // dynamically; render all of them, sorted alphabetically for stability.
  const classGroups = useMemo<ClassGroup[]>(() => {
    const buckets = new Map<string, LeaderRow[]>();
    for (const pos of bridge.positions) {
      const classKey = pos.carClass?.trim().toUpperCase();
      if (!classKey || pos.classPosition <= 0) continue;
      const bucket = buckets.get(classKey) ?? [];
      bucket.push({
        classPosition: pos.classPosition,
        carNumber: pos.carNumber,
        teamName: pos.teamName,
        driverName: pos.driverName,
        lastLapTime: pos.lastLapTime,
      });
      buckets.set(classKey, bucket);
    }
    return Array.from(buckets.entries())
      .map(([className, rows]) => ({
        className,
        rows: rows.sort((a, b) => a.classPosition - b.classPosition).slice(0, 3),
      }))
      .sort((a, b) => a.className.localeCompare(b.className));
  }, [bridge.positions]);

  if (classGroups.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-xs">
        Awaiting classified positions…
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {classGroups.map(({ className, rows }) => (
        <ClassBlock key={className} className={className} rows={rows} />
      ))}
    </div>
  );
}

function ClassBlock({ className, rows }: { className: string; rows: LeaderRow[] }) {
  return (
    <div className="flex flex-col min-w-0">
      <div className="bg-bg-surface border-b border-border-default px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-accent-orange">
        {className}
      </div>
      {rows.length === 0 ? (
        <div className="px-3 py-3 text-xs text-text-muted italic">No cars</div>
      ) : (
        <div className="divide-y divide-border-default/50">
          {rows.map((row) => (
            <div
              key={`${className}-${row.carNumber}`}
              className="grid grid-cols-[2ch_3.25rem_1fr_auto] items-center gap-2.5 px-3 py-2"
            >
              <span className="font-data text-sm text-text-muted font-semibold">
                P{row.classPosition}
              </span>
              <span className="font-data text-base font-bold text-text-primary">
                #{row.carNumber}
              </span>
              <div className="min-w-0 leading-tight">
                <div className="text-sm text-text-secondary truncate" title={row.teamName}>
                  {row.teamName || '—'}
                </div>
                {row.driverName && (
                  <div className="text-xs text-text-primary truncate" title={row.driverName}>
                    {row.driverName}
                  </div>
                )}
              </div>
              <span className="font-data text-base text-accent-orange tabular-nums">
                {formatLapTime(row.lastLapTime)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
