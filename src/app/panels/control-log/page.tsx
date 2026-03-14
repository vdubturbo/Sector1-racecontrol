'use client';

import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';

export default function ControlLogPanel() {
  const { connectionState } = useBridgeSocket();

  return (
    <>
      <PanelHeader
        panelName="Race Control Log"
        panelIcon="📋"
        connectionState={connectionState}
      />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="section-header text-text-muted">RACE CONTROL LOG</span>
          <p className="text-text-muted text-sm mt-2 font-[var(--font-mono)]">
            Official control log entries will appear here
          </p>
        </div>
      </div>
    </>
  );
}
