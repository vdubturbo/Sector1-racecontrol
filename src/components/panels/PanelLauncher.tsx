'use client';

import { StatusDot } from '@/components/ui/StatusDot';
import type { PanelDefinition, PanelStatus } from '@/types/panels';

interface PanelLauncherProps {
  panel: PanelDefinition;
  status: PanelStatus;
  onLaunch: () => void;
}

export function PanelLauncher({ panel, status, onLaunch }: PanelLauncherProps) {
  const isOpen = status !== 'closed';

  return (
    <button
      onClick={onLaunch}
      className={`
        group relative flex flex-col items-center gap-1 px-3 py-2
        transition-all duration-150 cursor-pointer rounded
        hover:bg-bg-hover
        focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-orange
        ${isOpen ? 'bg-bg-elevated' : ''}
      `}
    >
      {/* Status dot — top right of icon */}
      <div className="relative">
        <span className={`text-lg ${isOpen ? '' : 'opacity-70 group-hover:opacity-100'} transition-opacity`}>
          {panel.icon}
        </span>
        <span className="absolute -top-0.5 -right-1.5">
          <StatusDot
            status={status === 'connected' ? 'connected' : status === 'disconnected' ? 'disconnected' : 'closed'}
            size="sm"
            pulse={status === 'connected'}
          />
        </span>
      </div>

      {/* Label */}
      <span
        className={`
          text-[0.5625rem] font-semibold uppercase tracking-wider leading-tight text-center
          transition-colors
          ${isOpen ? 'text-accent-orange' : 'text-text-muted group-hover:text-text-primary'}
        `}
      >
        {panel.name}
      </span>
    </button>
  );
}
