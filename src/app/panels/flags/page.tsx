'use client';

import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';

export default function FlagsPanel() {
  const { connectionState } = useBridgeSocket();

  return (
    <>
      <PanelHeader
        panelName="Flag Control"
        panelIcon="🏁"
        connectionState={connectionState}
      />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="section-header text-text-muted">FLAG CONTROL</span>
          <p className="text-text-muted text-sm mt-2 font-[var(--font-mono)]">
            Flag status display and controls will appear here
          </p>
        </div>
      </div>
    </>
  );
}
