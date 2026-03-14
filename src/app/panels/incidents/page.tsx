'use client';

import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';

export default function IncidentsPanel() {
  const { connectionState } = useBridgeSocket();

  return (
    <>
      <PanelHeader
        panelName="Incidents & Penalties"
        panelIcon="⚠"
        connectionState={connectionState}
      />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="section-header text-text-muted">INCIDENTS &amp; PENALTIES</span>
          <p className="text-text-muted text-sm mt-2 font-[var(--font-mono)]">
            Incident reporting and penalty management will appear here
          </p>
        </div>
      </div>
    </>
  );
}
