'use client';

import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';

export default function TimingPanel() {
  const { connectionState } = useBridgeSocket();

  return (
    <>
      <PanelHeader
        panelName="Live Timing"
        panelIcon="⏱"
        connectionState={connectionState}
      />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="section-header text-text-muted">LIVE TIMING</span>
          <p className="text-text-muted text-sm mt-2 font-[var(--font-mono)]">
            Timing and scoring feed will appear here
          </p>
        </div>
      </div>
    </>
  );
}
