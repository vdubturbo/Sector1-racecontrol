'use client';

import { Badge } from '@/components/ui/Badge';
import type { SessionType } from '@/types/racing';

interface TopStatusBarProps {
  eventName: string;
  sessionName: string;
  sessionType: SessionType;
  timeRemaining: string;
  carsTotal: number;
  carsOnTrack: number;
  carsInPit: number;
  ambientTemp: number;
  trackTemp: number;
  leaderLap?: string | null;
  avatarUrl?: string | null;
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
  sessionName,
  sessionType,
  timeRemaining,
  carsTotal,
  carsOnTrack,
  carsInPit,
  ambientTemp,
  trackTemp,
  leaderLap,
  avatarUrl,
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

      {/* Divider */}
      <div className="w-px h-8 bg-border-subtle shrink-0" />

      {/* Session Info */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-text-primary text-sm font-medium truncate max-w-48">
          {eventName}
        </span>
        <span className="text-text-muted text-sm">—</span>
        <span className="text-text-secondary text-sm">{sessionName}</span>
        <Badge variant={SESSION_TYPE_VARIANT[sessionType]}>
          {sessionType}
        </Badge>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Time Remaining — centered */}
      <div className="flex flex-col items-center shrink-0">
        <span className="section-header text-[0.5625rem]">REMAINING</span>
        <span className="font-data text-3xl font-bold text-accent-orange tracking-tight leading-tight">
          {timeRemaining}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Car Count */}
      <div className="flex flex-col items-center shrink-0 mx-2">
        <span className="section-header text-[0.5625rem]">CARS</span>
        <div className="flex items-center gap-2 text-xs font-[var(--font-mono)]">
          <span className="text-text-primary font-semibold">{carsTotal}</span>
          <span className="text-text-muted">/</span>
          <span className="text-status-green">{carsOnTrack}</span>
          <span className="text-text-muted">/</span>
          <span className="text-status-yellow">{carsInPit}</span>
        </div>
        <span className="text-[0.5rem] text-text-muted">TOT / TRK / PIT</span>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-border-subtle shrink-0" />

      {/* Leader Lap */}
      <div className="flex flex-col items-center shrink-0 mx-2 border border-border-subtle rounded px-3 py-1">
        <div className="flex items-center gap-3">
          <span className="section-header text-[0.5625rem]">LEADER</span>
          <span className="section-header text-[0.5625rem]">LAP</span>
        </div>
        <span className="font-data text-sm font-bold text-text-primary tracking-wider leading-tight">
          {leaderLap ?? '— —'}
        </span>
      </div>

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
          {ambientTemp}°F
        </span>
      </div>

      {/* Track Temp */}
      <div className="flex flex-col items-center shrink-0 mx-1.5">
        <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none">
          {/* Road / track surface icon */}
          <path d="M4 20 L10 4 L14 4 L20 20" stroke="#999" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <line x1="11" y1="8" x2="13" y2="8" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10.5" y1="12" x2="13.5" y2="12" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="16" x2="14" y2="16" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
          {/* Heat waves */}
          <path d="M16 6 Q17 5 18 6 Q19 7 20 6" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.7" />
          <path d="M16 9 Q17 8 18 9 Q19 10 20 9" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
        <span className="font-data text-xs font-semibold text-accent-amber">
          {trackTemp}°F
        </span>
      </div>

      {/* User Avatar */}
      <div className="shrink-0 ml-2">
        <div className="w-9 h-9 rounded-full border-2 border-accent-orange bg-bg-elevated flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}
        </div>
      </div>
    </header>
  );
}
