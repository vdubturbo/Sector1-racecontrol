'use client';

import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';

export default function DirectoryPanel() {
  const { connectionState } = useBridgeSocket();

  return (
    <>
      <PanelHeader
        panelName="Car & Team Directory"
        panelIcon="🏎"
        connectionState={connectionState}
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
