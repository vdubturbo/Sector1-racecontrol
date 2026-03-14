'use client';

import { useState } from 'react';
import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import type { FlagColor } from '@/types/racing';

export default function DirectoryPanel() {
  const bridge = useBridgeSocket();
  const [flagColor, setFlagColor] = useState<FlagColor | null>(null);

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
        panelName="Car & Team Directory"
        panelIcon="🏎"
        connectionState={bridge.connectionState}
        eventName={eventName}
        flagColor={bridge.raceState?.flagColor ?? flagColor}
      />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="section-header text-text-muted">CAR &amp; TEAM DIRECTORY</span>
          <p className="text-text-muted text-sm mt-2 font-[var(--font-mono)]">
            Searchable car, team, and driver directory will appear here
          </p>
        </div>
      </div>
    </>
  );
}
