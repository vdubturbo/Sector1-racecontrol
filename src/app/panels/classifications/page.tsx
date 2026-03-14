'use client';

import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';

export default function ClassificationsPanel() {
  const { connectionState } = useBridgeSocket();

  return (
    <>
      <PanelHeader
        panelName="Classifications"
        panelIcon="🏆"
        connectionState={connectionState}
      />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="section-header text-text-muted">CLASSIFICATIONS</span>
          <p className="text-text-muted text-sm mt-2 font-[var(--font-mono)]">
            Live race classifications by class will appear here
          </p>
        </div>
      </div>
    </>
  );
}
