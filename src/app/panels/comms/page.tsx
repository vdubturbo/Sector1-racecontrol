'use client';

import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';

export default function CommsPanel() {
  const { connectionState } = useBridgeSocket();

  return (
    <>
      <PanelHeader
        panelName="Communications"
        panelIcon="📡"
        connectionState={connectionState}
      />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="section-header text-text-muted">COMMUNICATIONS</span>
          <p className="text-text-muted text-sm mt-2 font-[var(--font-mono)]">
            Team messaging and broadcast notifications will appear here
          </p>
        </div>
      </div>
    </>
  );
}
