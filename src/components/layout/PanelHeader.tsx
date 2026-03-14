'use client';

import { StatusDot } from '@/components/ui/StatusDot';
import { Button } from '@/components/ui/Button';
import type { ConnectionState } from '@/hooks/useBridgeSocket';

interface PanelHeaderProps {
  panelName: string;
  panelIcon: string;
  connectionState: ConnectionState;
}

export function PanelHeader({ panelName, panelIcon, connectionState }: PanelHeaderProps) {
  return (
    <header className="flex items-center justify-between px-3 py-2 bg-bg-surface border-b border-border-default shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-base">{panelIcon}</span>
        <span className="section-header text-xs">{panelName}</span>
        <StatusDot
          status={
            connectionState === 'connected'
              ? 'connected'
              : connectionState === 'connecting'
                ? 'connecting'
                : 'disconnected'
          }
          size="sm"
          pulse={connectionState === 'connected'}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[0.5625rem] uppercase tracking-wider text-text-muted font-semibold font-[var(--font-mono)]">
          {connectionState === 'connected' ? 'LIVE' : connectionState === 'connecting' ? 'CONNECTING' : 'OFFLINE'}
        </span>
        <Button variant="ghost" size="sm" disabled title="Pop In (coming soon)">
          ⤢
        </Button>
      </div>
    </header>
  );
}
