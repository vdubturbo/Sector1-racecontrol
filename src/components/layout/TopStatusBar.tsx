'use client';

import { Badge } from '@/components/ui/Badge';
import type { SessionType } from '@/types/racing';

interface TopStatusBarProps {
  eventName: string;
  sessionType: SessionType;
  ambientTemp?: number;
  trackTemp?: number;
  children?: React.ReactNode;
}

const SESSION_TYPE_VARIANT: Record<SessionType, 'default' | 'orange' | 'green' | 'red' | 'yellow'> = {
  practice: 'default',
  qualifying: 'yellow',
  warmup: 'default',
  race: 'orange',
  test: 'default',
};

export function TopStatusBar({
  eventName,
  sessionType,
  ambientTemp,
  trackTemp,
  children,
}: TopStatusBarProps) {

  return (
    <header className="flex items-center gap-4 px-4 py-2 bg-bg-surface border-b border-border-default relative z-10">
      {/* Logo */}
      <div className="shrink-0 mr-4">
        <img
          src="/images/s1racecontrollogo.png"
          alt="S1 Race Control"
          className="h-7 w-auto"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Session Info — centered */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-text-primary text-3xl font-semibold tracking-wide uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
          {eventName}
        </span>
        <Badge variant={SESSION_TYPE_VARIANT[sessionType]}>
          {sessionType}
        </Badge>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Ambient Temp */}
      <div className="flex flex-col items-center shrink-0 mx-1.5">
        <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="#f59e0b" />
          <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
        <span className="font-data text-xs font-semibold text-text-primary">
          {ambientTemp != null ? `${ambientTemp}°F` : '—'}
        </span>
      </div>

      {/* Track Temp */}
      <div className="flex flex-col items-center shrink-0 mx-1.5">
        <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none">
          <path d="M4 20 L10 4 L14 4 L20 20" stroke="#999" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <line x1="11" y1="8" x2="13" y2="8" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10.5" y1="12" x2="13.5" y2="12" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="16" x2="14" y2="16" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 6 Q17 5 18 6 Q19 7 20 6" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.7" />
          <path d="M16 9 Q17 8 18 9 Q19 10 20 9" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
        <span className="font-data text-xs font-semibold text-accent-amber">
          {trackTemp != null ? `${trackTemp}°F` : '—'}
        </span>
      </div>

      {/* User menu slot */}
      {children}
    </header>
  );
}
