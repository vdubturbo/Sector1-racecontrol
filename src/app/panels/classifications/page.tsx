'use client';

import { useState, useMemo } from 'react';
import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import type { FlagColor, NormalizedCarPosition } from '@/types/racing';

const CLASS_COLORS: Record<string, string> = {
  'GTO': '#ef4444', 'GTU': '#22c55e', 'GP1': '#3b82f6', 'GP2': '#eab308',
  'GP3': '#a855f7', 'Prototype': '#ec4899', 'GT3': '#06b6d4', 'GT4': '#f97316',
  'TCR': '#14b8a6', 'LMP': '#8b5cf6',
};

function getClassColor(carClass: string): string {
  if (!carClass) return '#666';
  const upper = carClass.toUpperCase();
  for (const [key, color] of Object.entries(CLASS_COLORS)) {
    if (upper.includes(key.toUpperCase())) return color;
  }
  let hash = 0;
  for (let i = 0; i < carClass.length; i++) hash = carClass.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 60%, 55%)`;
}

const PODIUM_STYLES = [
  { label: '1ST', height: 'h-28', textSize: 'text-2xl', ring: 'ring-2 ring-[#ffd700]', accent: '#ffd700' },
  { label: '2ND', height: 'h-20', textSize: 'text-xl', ring: 'ring-2 ring-[#c0c0c0]', accent: '#c0c0c0' },
  { label: '3RD', height: 'h-16', textSize: 'text-lg', ring: 'ring-2 ring-[#cd7f32]', accent: '#cd7f32' },
];

export default function ClassificationsPanel() {
  const bridge = useBridgeSocket();
  const [flagColor, setFlagColor] = useState<FlagColor | null>(null);

  useBroadcastChannel({
    onEventSelected: (msg) => bridge.selectEvent(msg.eventId),
    onFlagChange: (msg) => setFlagColor(msg.flagColor),
  });

  const eventName = bridge.availableEvents.find(
    (e) => e.eventId === bridge.selectedEventId
  )?.name ?? bridge.selectedEventId ?? null;

  // Group positions by class, sorted by classPosition
  const classPodiums = useMemo(() => {
    const byClass: Record<string, NormalizedCarPosition[]> = {};
    for (const car of bridge.positions) {
      const cls = car.carClass || 'Unknown';
      if (!byClass[cls]) byClass[cls] = [];
      byClass[cls].push(car);
    }
    // Sort each class by classPosition, take top 3
    const result: { className: string; cars: NormalizedCarPosition[] }[] = [];
    for (const [className, cars] of Object.entries(byClass)) {
      cars.sort((a, b) => (a.classPosition || 999) - (b.classPosition || 999));
      result.push({ className, cars: cars.slice(0, 5) });
    }
    // Sort classes alphabetically
    result.sort((a, b) => a.className.localeCompare(b.className));
    return result;
  }, [bridge.positions]);

  return (
    <>
      <PanelHeader
        panelName="Classifications"
        panelIcon="🏆"
        connectionState={bridge.connectionState}
        eventName={eventName}
        flagColor={bridge.raceState?.flagColor ?? flagColor}
      />

      <div className="flex-1 overflow-auto p-6">
        {classPodiums.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="section-header text-text-muted">
              {bridge.connectionState === 'connected'
                ? bridge.selectedEventId ? 'WAITING FOR DATA' : 'SELECT AN EVENT'
                : 'CONNECTING'}
            </span>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {classPodiums.map(({ className, cars }) => {
              const color = getClassColor(className);
              return (
                <div
                  key={className}
                  className="bg-bg-card border-2 border-[#999999] rounded-lg overflow-hidden"
                >
                  {/* Class header */}
                  <div
                    className="flex items-center gap-2 px-4 py-2.5 border-b border-border-default"
                    style={{ borderLeftWidth: 4, borderLeftColor: color }}
                  >
                    <span className="section-header text-base" style={{ color }}>
                      {className}
                    </span>
                    <span className="text-[0.625rem] text-text-muted font-[var(--font-mono)]">
                      {cars[0]?.lastLapCompleted ?? 0} laps
                    </span>
                  </div>

                  {/* Podium display — P2 | P1 | P3 layout */}
                  <div className="flex items-end justify-center gap-3 px-4 pt-6 pb-4">
                    {[1, 0, 2].map((podiumIdx) => {
                      const car = cars[podiumIdx];
                      const style = PODIUM_STYLES[podiumIdx];
                      if (!car) {
                        return (
                          <div key={podiumIdx} className="flex flex-col items-center w-28 opacity-20">
                            <div className={`w-full ${style.height} bg-bg-elevated rounded-t flex items-center justify-center`}>
                              <span className="text-text-muted text-xs">{style.label}</span>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={podiumIdx} className="flex flex-col items-center w-28">
                          {/* Car info above podium */}
                          <span
                            className={`font-data ${style.textSize} font-bold mb-1 ${style.ring} rounded px-2 py-0.5`}
                            style={{ color }}
                          >
                            #{car.carNumber}
                          </span>
                          <span className="text-[0.625rem] text-text-primary font-medium truncate w-full text-center mb-0.5">
                            {car.driverName || '—'}
                          </span>
                          <span className="text-[0.5625rem] text-text-muted truncate w-full text-center mb-2">
                            {car.teamName || '—'}
                          </span>

                          {/* Podium block */}
                          <div
                            className={`w-full ${style.height} rounded-t flex flex-col items-center justify-center`}
                            style={{ backgroundColor: `${style.accent}15`, borderTop: `2px solid ${style.accent}` }}
                          >
                            <span className="font-data text-xs font-bold" style={{ color: style.accent }}>
                              {style.label}
                            </span>
                            <span className="font-data text-[0.625rem] text-text-muted mt-0.5">
                              {car.bestTime || '—'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Gap info */}
                  <div className="flex justify-between px-4 py-2 border-t border-border-default/50 text-[0.625rem] text-text-muted">
                    {cars.slice(0, 3).map((car, i) => (
                      <span key={car.carNumber} className="font-[var(--font-mono)]">
                        P{i + 1}: {i === 0 ? 'Leader' : car.inClassGap || '—'}
                      </span>
                    ))}
                  </div>

                  {/* P4 & P5 — next in line */}
                  {cars.length > 3 && (
                    <div className="border-t border-border-default/30">
                      {cars.slice(3, 5).map((car, i) => (
                        <div
                          key={car.carNumber}
                          className="flex items-center gap-3 px-4 py-1.5 text-text-muted hover:bg-bg-hover transition-colors"
                        >
                          <span className="font-data text-xs font-semibold w-6 text-right">
                            P{i + 4}
                          </span>
                          <span
                            className="font-data text-xs font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
                          >
                            #{car.carNumber}
                          </span>
                          <span className="text-[0.6875rem] text-text-secondary truncate flex-1">
                            {car.driverName || '—'}
                          </span>
                          <span className="text-[0.625rem] text-text-muted truncate max-w-28">
                            {car.teamName || '—'}
                          </span>
                          <span className="font-data text-[0.625rem] text-text-muted shrink-0">
                            {car.inClassGap || '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Communicate to Grid */}
          <div className="mt-6 bg-bg-card border-2 border-[#999999] rounded-lg overflow-hidden max-w-3xl mx-auto">
            <div className="px-5 py-3 border-b border-border-default">
              <span className="section-header text-sm">COMMUNICATE TO GRID</span>
            </div>

            {/* Podium Details row */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-border-default/50">
              <span className="text-sm text-text-primary font-medium w-48 shrink-0">
                Podium Details
              </span>
              <div className="flex items-center gap-3 flex-1">
                <label className="text-[0.625rem] text-text-muted uppercase tracking-wider shrink-0">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Victory Lane"
                  className="px-3 py-1.5 bg-bg-elevated border border-border-subtle rounded text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-orange flex-1 max-w-48"
                />
                <label className="text-[0.625rem] text-text-muted uppercase tracking-wider shrink-0">Time</label>
                <input
                  type="text"
                  placeholder="e.g. 5:30 PM"
                  className="px-3 py-1.5 bg-bg-elevated border border-border-subtle rounded text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-orange w-28 font-[var(--font-mono)]"
                />
              </div>
            </div>

            {/* Podium Winners row */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-border-default/50 hover:bg-bg-hover transition-colors">
              <span className="text-sm text-text-primary font-medium w-48 shrink-0">
                Podium Winners
              </span>
              <div className="flex items-center gap-2 flex-1">
                <ChannelToggle label="Text" />
                <ChannelToggle label="App" />
                <ChannelToggle label="Website" />
              </div>
              <button className="px-4 py-1.5 bg-accent-orange text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-accent-amber transition-colors shrink-0">
                Execute
              </button>
            </div>

            {/* Post-Race Tech/Dyno row */}
            <div className="flex items-center gap-4 px-5 py-3 hover:bg-bg-hover transition-colors">
              <span className="text-sm text-text-primary font-medium w-48 shrink-0">
                Post-Race Tech/Dyno
              </span>
              <select className="bg-bg-elevated border border-border-subtle rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent-orange shrink-0">
                <option value="all">All Classes</option>
                {classPodiums.map((cp) => (
                  <option key={cp.className} value={cp.className}>{cp.className}</option>
                ))}
              </select>
              <div className="flex items-center gap-2 flex-1">
                <ChannelToggle label="Text" />
                <ChannelToggle label="App" />
                <ChannelToggle label="AI Select" />
              </div>
              <button className="px-4 py-1.5 bg-accent-orange text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-accent-amber transition-colors shrink-0">
                Execute
              </button>
            </div>
          </div>
          </>
        )}
      </div>
    </>
  );
}

function ChannelToggle({ label }: { label: string }) {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive(!active)}
      className={`
        px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-wider border rounded transition-colors
        ${active
          ? 'border-accent-orange text-accent-orange bg-accent-orange/15'
          : 'border-border-subtle text-text-muted bg-transparent hover:border-text-muted hover:text-text-secondary'
        }
      `}
    >
      {label}
    </button>
  );
}
