'use client';

import { useEffect } from 'react';
import { TopStatusBar } from '@/components/layout/TopStatusBar';
import { PanelLauncher } from '@/components/panels/PanelLauncher';
import { UserMenu } from '@/components/ui/UserMenu';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useAuth } from '@/hooks/useAuth';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { usePanelManager } from '@/hooks/usePanelManager';
import { PANELS } from '@/lib/constants';

export default function CommandHub() {
  const bridge = useBridgeSocket();
  const auth = useAuth();
  const { panelStatuses, openPanel } = usePanelManager();

  // Broadcast flag changes and event selections to all panels
  const { broadcast } = useBroadcastChannel({
    onEventSelected: (msg) => {
      bridge.selectEvent(msg.eventId);
    },
  });

  // Broadcast flag changes when race state updates
  useEffect(() => {
    if (bridge.raceState) {
      broadcast({
        type: 'flag_change',
        flagColor: bridge.raceState.flagColor,
        timeRemaining: bridge.raceState.timeRemaining,
      });
    }
  }, [bridge.raceState, broadcast]);

  // Derive event name from available events
  const eventName = bridge.availableEvents.find(
    (e) => e.eventId === bridge.selectedEventId
  )?.name ?? bridge.selectedEventId ?? 'No Event Selected';

  return (
    <div className="flex flex-col h-screen">
      <TopStatusBar
        eventName={eventName}
        sessionName="Race"
        sessionType="race"
        positions={bridge.positions}
        raceState={bridge.raceState}
        connectionState={bridge.connectionState}
      >
        <UserMenu
          user={auth.user}
          isLoading={auth.isLoading}
          onSignIn={auth.signIn}
          onSignOut={auth.signOut}
        />
      </TopStatusBar>

      {/* Main content area — event selector when no event */}
      <main className="flex-1 overflow-auto flex items-center justify-center">
        {bridge.availableEvents.length > 0 && !bridge.selectedEventId && (
          <div className="flex flex-col items-center gap-4">
            <span className="section-header">SELECT AN EVENT</span>
            <div className="flex flex-col gap-2">
              {bridge.availableEvents.map((evt, idx) => (
                <button
                  key={evt.eventId ?? idx}
                  onClick={() => {
                    bridge.selectEvent(evt.eventId);
                    broadcast({ type: 'event_selected', eventId: evt.eventId });
                  }}
                  className="px-6 py-3 bg-bg-card border border-border-default rounded text-text-primary text-sm hover:border-accent-orange hover:bg-bg-hover transition-colors text-left"
                >
                  <span className="font-semibold">{evt.name ?? evt.eventId}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

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
