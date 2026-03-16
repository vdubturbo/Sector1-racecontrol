'use client';

import { useState, useCallback } from 'react';
import { PanelHeader } from '@/components/layout/PanelHeader';
import { RaceLog, SAMPLE_ENTRIES, type RaceLogEntry, type ActionType } from '@/components/RaceLog';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import type { FlagColor } from '@/types/racing';

const INFRACTION_OPTIONS = [
  'Contact',
  'Pit Lane/Fueling Infraction',
  'Track Limits',
  'Unsafe Rejoin',
  'Blocking',
  'Slow',
  'Stopped DL',
  'Smoking',
  'Heavy dumping',
  'Mechanical',
  'Black Flag Violation',
  'Other',
];

const STATION_OPTIONS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  'PR', 'SF',
];

export default function IncidentsPanel() {
  const bridge = useBridgeSocket();
  const [flagColor, setFlagColor] = useState<FlagColor | null>(null);
  const [entries, setEntries] = useState<RaceLogEntry[]>(SAMPLE_ENTRIES);

  // Form state
  const [carNumbersInput, setCarNumbersInput] = useState('');
  const [station, setStation] = useState('');
  const [infraction, setInfraction] = useState('');
  const [notes, setNotes] = useState('');
  const [action, setAction] = useState<ActionType>('no-action');

  useBroadcastChannel({
    onEventSelected: (msg) => bridge.selectEvent(msg.eventId),
    onFlagChange: (msg) => setFlagColor(msg.flagColor),
  });

  const eventName = bridge.availableEvents.find(
    (e) => e.eventId === bridge.selectedEventId
  )?.name ?? bridge.selectedEventId ?? null;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!carNumbersInput.trim() || !infraction) return;

    const carNumbers = carNumbersInput.split(/[,\s]+/).map((n) => n.replace('#', '').trim()).filter(Boolean);
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newEntry: RaceLogEntry = {
      id: `entry-${Date.now()}`,
      timestamp,
      carNumbers,
      station: station || '—',
      infraction,
      notes,
      action,
      cars: carNumbers.map((num) => ({
        carNumber: num,
        teamName: '—',
        driverName: '—',
        manufacturer: '',
      })),
    };

    setEntries((prev) => [newEntry, ...prev]);

    // Reset form
    setCarNumbersInput('');
    setStation('');
    setInfraction('');
    setNotes('');
    setAction('no-action');
  }, [carNumbersInput, station, infraction, notes, action]);

  return (
    <>
      <PanelHeader
        panelName="Incidents & Penalties"
        panelIcon="⚠"
        connectionState={bridge.connectionState}
        eventName={eventName}
        flagColor={bridge.raceState?.flagColor ?? flagColor}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Incident Entry Form */}
        <form onSubmit={handleSubmit} className="shrink-0 border-b border-border-default bg-bg-surface px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="section-header text-sm">NEW INCIDENT</span>
          </div>

          <div className="grid grid-cols-[1fr_6rem_1fr_1fr] gap-3 mb-3">
            {/* Car Numbers */}
            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] uppercase tracking-wider text-text-muted font-semibold">
                Car Number(s)
              </label>
              <input
                type="text"
                value={carNumbersInput}
                onChange={(e) => setCarNumbersInput(e.target.value)}
                placeholder="44, 644"
                className="px-3 py-2 bg-bg-elevated border border-border-subtle rounded text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-orange font-[var(--font-mono)]"
                required
              />
            </div>

            {/* Station */}
            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] uppercase tracking-wider text-text-muted font-semibold">
                Station
              </label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="px-3 py-2 bg-bg-elevated border border-border-subtle rounded text-sm text-text-primary focus:outline-none focus:border-accent-orange"
              >
                <option value="">—</option>
                {STATION_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Infraction */}
            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] uppercase tracking-wider text-text-muted font-semibold">
                Infraction
              </label>
              <select
                value={infraction}
                onChange={(e) => setInfraction(e.target.value)}
                className="px-3 py-2 bg-bg-elevated border border-border-subtle rounded text-sm text-text-primary focus:outline-none focus:border-accent-orange"
                required
              >
                <option value="" disabled>Select...</option>
                {INFRACTION_OPTIONS.map((inf) => (
                  <option key={inf} value={inf}>{inf}</option>
                ))}
              </select>
            </div>

            {/* Action */}
            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] uppercase tracking-wider text-text-muted font-semibold">
                Action
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as ActionType)}
                className="px-3 py-2 bg-bg-elevated border border-border-subtle rounded text-sm text-text-primary focus:outline-none focus:border-accent-orange"
              >
                <option value="no-action">No Action</option>
                <option value="warning">Warning</option>
                <option value="penalty">Penalty</option>
                <option value="black-flag">Black Flag</option>
                <option value="dq">DQ</option>
              </select>
            </div>
          </div>

          <div className="flex items-end gap-3">
            {/* Notes */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[0.625rem] uppercase tracking-wider text-text-muted font-semibold">
                Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional details..."
                className="px-3 py-2 bg-bg-elevated border border-border-subtle rounded text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-orange"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="px-6 py-2 bg-accent-orange text-white text-sm font-semibold rounded hover:bg-accent-amber transition-colors shrink-0"
            >
              Log Incident
            </button>
          </div>
        </form>

        {/* Race Control Log */}
        <div className="flex-1 overflow-auto">
          <RaceLog entries={entries} showUpdate className="border-0 rounded-none" />
        </div>
      </div>
    </>
  );
}
