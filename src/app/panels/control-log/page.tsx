'use client';

import { useState } from 'react';
import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { useControlLog } from '@/hooks/useControlLog';
import { ACTION_STYLES } from '@/components/RaceLog';
import type { FlagColor } from '@/types/racing';

export default function ControlLogPanel() {
  const bridge = useBridgeSocket();
  const [flagColor, setFlagColor] = useState<FlagColor | null>(null);
  const controlLog = useControlLog(bridge.selectedEventId);

  useBroadcastChannel({
    onEventSelected: (msg) => bridge.selectEvent(msg.eventId),
    onFlagChange: (msg) => setFlagColor(msg.flagColor),
  });

  const eventName = bridge.availableEvents.find(
    (e) => e.eventId === bridge.selectedEventId
  )?.name ?? bridge.selectedEventId ?? null;

  return (
    <>
      <PanelHeader
        panelName="Race Control Log"
        panelIcon="📋"
        connectionState={bridge.connectionState}
        eventName={eventName}
        flagColor={bridge.raceState?.flagColor ?? flagColor}
      />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ControlLogBody
          eventId={bridge.selectedEventId}
          entries={controlLog.entries}
          isLoading={controlLog.isLoading}
          error={controlLog.error}
        />
      </div>
    </>
  );
}

interface BodyProps {
  eventId: string | null;
  entries: ReturnType<typeof useControlLog>['entries'];
  isLoading: boolean;
  error: string | null;
}

function ControlLogBody({ eventId, entries, isLoading, error }: BodyProps) {
  if (!eventId) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-sm">
        No event selected
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-status-red text-sm px-4 text-center">
        {error}
      </div>
    );
  }

  if (isLoading && entries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-sm">
        Loading…
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-sm">
        No control log entries yet
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[5rem_4rem_1fr_2fr_2fr_6rem] gap-3 px-4 py-2 border-b border-border-default bg-bg-surface text-[0.6875rem] uppercase tracking-wider text-text-secondary font-semibold sticky top-0 z-10">
        <span>Time</span>
        <span>Stn</span>
        <span>Cars</span>
        <span>Infraction</span>
        <span>Notes</span>
        <span className="text-right">Action</span>
      </div>

      <div className="divide-y divide-border-default/50">
        {entries.map((entry) => {
          const action = ACTION_STYLES[entry.action];
          return (
            <div
              key={entry.id}
              className="grid grid-cols-[5rem_4rem_1fr_2fr_2fr_6rem] gap-3 px-4 py-2 items-start"
            >
              <span className="font-data text-xs text-text-muted tabular-nums pt-0.5">
                {entry.timestamp || '—'}
              </span>
              <span className="font-data text-xs text-text-muted tabular-nums pt-0.5">
                {entry.station || '—'}
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
              <span className="text-sm text-text-primary">
                {entry.infraction}
              </span>
              <span className="text-xs text-text-secondary">
                {entry.notes || '—'}
              </span>
              <div className="flex justify-end">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider border rounded ${action.bg} ${action.text} ${action.border}`}
                >
                  {action.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
