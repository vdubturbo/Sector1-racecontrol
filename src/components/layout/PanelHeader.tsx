'use client';

import { StatusDot } from '@/components/ui/StatusDot';
import { Button } from '@/components/ui/Button';
import { FLAG_COLORS } from '@/lib/constants';
import type { ConnectionState } from '@/hooks/useBridgeSocket';
import type { FlagColor } from '@/types/racing';

interface PanelHeaderProps {
  panelName: string;
  panelIcon: string;
  connectionState: ConnectionState;
  eventName?: string | null;
  flagColor?: FlagColor | null;
}

export function PanelHeader({
  panelName,
  panelIcon,
  connectionState,
  eventName,
  flagColor,
}: PanelHeaderProps) {
  const flag = flagColor ? FLAG_COLORS[flagColor] || FLAG_COLORS.none : null;

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
        {eventName && (
          <>
            <div className="w-px h-4 bg-border-subtle" />
            <span className="text-[0.625rem] text-text-secondary truncate max-w-40">
              {eventName}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {flag && (
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: flag.bg }}
            title={flag.label}
          />
        )}
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
