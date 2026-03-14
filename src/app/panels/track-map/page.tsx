'use client';

import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';

export default function TrackMapPanel() {
  const { connectionState } = useBridgeSocket();

  return (
    <>
      <PanelHeader
        panelName="Track Map"
        panelIcon="🗺"
        connectionState={connectionState}
      />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="section-header text-text-muted">TRACK MAP</span>
          <p className="text-text-muted text-sm mt-2 font-[var(--font-mono)]">
            Live track map with car positions will appear here
          </p>
        </div>
      </div>
    </>
  );
}
