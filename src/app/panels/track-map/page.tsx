'use client';

import { useState } from 'react';
import { PanelHeader } from '@/components/layout/PanelHeader';
import { TrackMap } from '@/components/TrackMap';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useTrackData } from '@/hooks/useTrackData';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import type { FlagColor } from '@/types/racing';

export default function TrackMapPanel() {
  const bridge = useBridgeSocket();
  const track = useTrackData(bridge.selectedEventId);
  const [broadcastFlagColor, setBroadcastFlagColor] = useState<FlagColor | null>(null);

  const { broadcast } = useBroadcastChannel({
    onEventSelected: (msg) => bridge.selectEvent(msg.eventId),
    onFlagChange: (msg) => setBroadcastFlagColor(msg.flagColor),
  });

  const flagColor = bridge.raceState?.flagColor ?? broadcastFlagColor ?? null;

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

      {/* Track map */}
      {bridge.selectedEventId ? (
        <TrackMap
          coordinates={track.coordinates}
          corners={track.corners}
          startFinish={track.startFinish}
          rotation={track.rotation}
          isLoading={track.isLoading}
          error={track.error}
          className="flex-1"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <span className="section-header text-text-muted">
            {bridge.connectionState === 'connected' ? 'SELECT AN EVENT' : 'CONNECTING TO BRIDGE'}
          </span>
        </div>
      )}
    </>
  );
}
