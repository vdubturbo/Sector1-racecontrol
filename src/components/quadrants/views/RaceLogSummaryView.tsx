'use client';

import { useControlLog } from '@/hooks/useControlLog';
import { ACTION_STYLES } from '@/components/RaceLog';
import type { QuadViewProps } from '../types';

/** Most recent entries displayed in the quadrant. The full log lives in the
 *  Incidents & Penalties popout; this is the summary/ticker view. */
const MAX_VISIBLE = 15;

export function RaceLogSummaryView({ eventId }: QuadViewProps) {
  const controlLog = useControlLog(eventId);

  if (!eventId) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-xs">
        No event selected
      </div>
    );
  }

  if (controlLog.error) {
    return (
      <div className="h-full flex items-center justify-center text-status-red text-xs px-3 text-center">
        {controlLog.error}
      </div>
    );
  }

  if (controlLog.isLoading && controlLog.entries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-xs">
        Loading…
      </div>
    );
  }

  if (controlLog.entries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-xs">
        No control log entries yet
      </div>
    );
  }

  const visible = controlLog.entries.slice(0, MAX_VISIBLE);
  const hiddenCount = Math.max(0, controlLog.entries.length - visible.length);

  return (
    <div className="flex flex-col">
      {/* Column headers */}
      <div className="grid grid-cols-[4rem_1fr_2fr_5rem] gap-2 px-3 py-1.5 border-b border-border-default bg-bg-surface text-[0.625rem] uppercase tracking-wider text-text-secondary font-semibold">
        <span>Time</span>
        <span>Cars</span>
        <span>Infraction</span>
        <span className="text-right">Action</span>
      </div>

      {/* Entries */}
      <div className="divide-y divide-border-default/50">
        {visible.map((entry) => {
          const action = ACTION_STYLES[entry.action];
          return (
            <div
              key={entry.id}
              className="grid grid-cols-[4rem_1fr_2fr_5rem] gap-2 px-3 py-1.5 items-center"
              title={entry.notes || undefined}
            >
              <span className="font-data text-xs text-text-muted tabular-nums">
                {entry.timestamp || '—'}
              </span>
              <div className="flex flex-wrap items-center gap-1 min-w-0">
                {entry.carNumbers.length === 0 ? (
                  <span className="text-text-muted text-xs">—</span>
                ) : (
                  entry.carNumbers.map((num) => (
                    <span key={num} className="font-data text-sm font-bold text-accent-orange">
                      #{num}
                    </span>
                  ))
                )}
              </div>
              <span className="text-sm text-text-primary truncate" title={entry.infraction}>
                {entry.infraction}
              </span>
              <div className="flex justify-end">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-wider border rounded ${action.bg} ${action.text} ${action.border}`}
                >
                  {action.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {hiddenCount > 0 && (
        <div className="px-3 py-1.5 text-[0.625rem] text-text-muted italic border-t border-border-default bg-bg-surface">
          +{hiddenCount} older {hiddenCount === 1 ? 'entry' : 'entries'} — open Incidents & Penalties for the full log
        </div>
      )}
    </div>
  );
}
