'use client';

import { TopStatusBar } from '@/components/layout/TopStatusBar';
import { PanelLauncher } from '@/components/panels/PanelLauncher';
import { usePanelManager } from '@/hooks/usePanelManager';
import { PANELS } from '@/lib/constants';

export default function CommandHub() {
  const { panelStatuses, openPanel } = usePanelManager();

  return (
    <div className="flex flex-col h-screen">
      <TopStatusBar
        eventName="Sebring 12 Hours"
        sessionName="Race"
        sessionType="race"
        timeRemaining="08:42:15"
        carsTotal={42}
        carsOnTrack={38}
        carsInPit={4}
        ambientTemp={83}
        trackTemp={130}
        leaderLap={null}
        avatarUrl={null}
      />

      {/* Main content area */}
      <main className="flex-1 overflow-auto" />

      {/* Panel Launcher Navbar */}
      <nav className="flex items-center justify-center gap-1 px-4 py-1.5 bg-bg-surface border-t border-border-default">
        {PANELS.map((panel) => (
          <PanelLauncher
            key={panel.id}
            panel={panel}
            status={panelStatuses[panel.id]}
            onLaunch={() => openPanel(panel.id)}
          />
        ))}
      </nav>
    </div>
  );
}
