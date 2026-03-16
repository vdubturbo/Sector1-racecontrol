'use client';

import { useEffect } from 'react';
import { TopStatusBar } from '@/components/layout/TopStatusBar';
import { TrackMap } from '@/components/TrackMap';
import { PanelLauncher } from '@/components/panels/PanelLauncher';
import { UserMenu } from '@/components/ui/UserMenu';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useAuth } from '@/hooks/useAuth';
import { useTrackData } from '@/hooks/useTrackData';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { usePanelManager } from '@/hooks/usePanelManager';
import { PANELS } from '@/lib/constants';

export default function CommandHub() {
  const bridge = useBridgeSocket();
  const auth = useAuth();
  const track = useTrackData(bridge.selectedEventId);
  const { panelStatuses, openPanel } = usePanelManager();

  const { broadcast } = useBroadcastChannel({
    onEventSelected: (msg) => {
      bridge.selectEvent(msg.eventId);
    },
  });

  useEffect(() => {
    if (bridge.raceState) {
      broadcast({
        type: 'flag_change',
        flagColor: bridge.raceState.flagColor,
        timeRemaining: bridge.raceState.timeRemaining,
      });
    }
  }, [bridge.raceState, broadcast]);

  const eventName = bridge.availableEvents.find(
    (e) => e.eventId === bridge.selectedEventId
  )?.name ?? bridge.selectedEventId ?? 'No Event Selected';

  return (
    <div className="flex flex-col h-screen">
      <TopStatusBar
        eventName={eventName}
        sessionType="race"
      >
        <UserMenu
          user={auth.user}
          isLoading={auth.isLoading}
          onSignIn={auth.signIn}
          onSignOut={auth.signOut}
        />
      </TopStatusBar>

      {/* Metric Containers */}
      <div className="flex justify-center items-center gap-4 py-3">
        {/* Cars On Track */}
        <div className="flex flex-col items-center px-6 py-2 bg-bg-card border-2 border-[#999999] rounded-lg">
          <span className="section-header text-[0.5rem] mb-0.5">CARS ON TRACK</span>
          <span className="font-data text-4xl font-bold text-status-green tracking-tight leading-none">
            {bridge.positions.length - bridge.positions.filter((p) => p.isInPit).length}
          </span>
          <span className="text-[0.5rem] text-text-muted mt-0.5 font-[var(--font-mono)]">
            of {bridge.positions.length}
          </span>
        </div>

        {/* Remaining Time */}
        <div className="flex flex-col items-center px-10 py-3 bg-bg-card border-2 border-[#999999] rounded-lg">
          <span className="section-header text-[0.5625rem] mb-1">REMAINING</span>
          <span className="font-data text-6xl font-bold text-accent-orange tracking-tight leading-none">
            {bridge.raceState?.timeRemaining ?? '—:——:——'}
          </span>
        </div>

        {/* Leader Lap */}
        <div className="flex flex-col items-center px-6 py-2 bg-bg-card border-2 border-[#999999] rounded-lg">
          <span className="section-header text-[0.5rem] mb-0.5">LEADER LAP</span>
          <span className="font-data text-4xl font-bold text-text-primary tracking-tight leading-none">
            {(() => {
              const leader = bridge.positions.find((p) => p.overallPosition === 1);
              return leader ? leader.lastLapCompleted : '—';
            })()}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <main className="flex-1 overflow-auto flex items-start justify-center pt-6">
        {bridge.selectedEventId ? (
          <TrackMap
            coordinates={track.coordinates}
            corners={track.corners}
            startFinish={track.startFinish}
            rotation={track.rotation}
            isLoading={track.isLoading}
            error={track.error}
            className="w-full max-h-[calc(100%-100px)]"
          />
        ) : bridge.availableEvents.length > 0 ? (
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
        ) : null}
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
