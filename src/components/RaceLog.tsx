'use client';

import { useState, useMemo } from 'react';

export type ActionType = 'no-action' | 'warning' | 'penalty' | 'black-flag' | 'dq';

export interface CarDetail {
  carNumber: string;
  teamName: string;
  driverName: string;
  manufacturer: string;
}

export interface RaceLogEntry {
  id: string;
  timestamp: string;
  carNumbers: string[];
  station: string;
  infraction: string;
  notes: string;
  action: ActionType;
  cars: CarDetail[];
}

export const ACTION_STYLES: Record<ActionType, { label: string; bg: string; text: string; border: string }> = {
  'no-action':  { label: 'No Action',   bg: 'bg-status-green/15', text: 'text-status-green', border: 'border-status-green/40' },
  'warning':    { label: 'Warning',     bg: 'bg-status-yellow/15', text: 'text-status-yellow', border: 'border-status-yellow/40' },
  'penalty':    { label: 'Penalty',     bg: 'bg-accent-orange/15', text: 'text-accent-orange', border: 'border-accent-orange/40' },
  'black-flag': { label: 'Black Flag',  bg: 'bg-text-primary/10', text: 'text-text-primary', border: 'border-text-primary/40' },
  'dq':         { label: 'DQ',          bg: 'bg-status-red/15', text: 'text-status-red', border: 'border-status-red/40' },
};

export const SAMPLE_ENTRIES: RaceLogEntry[] = [
  {
    id: '1',
    timestamp: '02:14 PM',
    carNumbers: ['44', '644'],
    station: '2',
    infraction: 'Contact',
    notes: 'Driver ejected. Contact avoidable.',
    action: 'penalty',
    cars: [
      { carNumber: '44', teamName: 'Apex Racing', driverName: 'M. Johnson', manufacturer: 'BMW' },
      { carNumber: '644', teamName: 'Summit Motorsport', driverName: 'R. Chen', manufacturer: 'toyota' },
    ],
  },
  {
    id: '2',
    timestamp: '02:12 PM',
    carNumbers: ['99', '90'],
    station: '12',
    infraction: 'Contact',
    notes: 'Contact avoidable.',
    action: 'penalty',
    cars: [
      { carNumber: '99', teamName: 'Gridline Racing', driverName: 'T. Brooks', manufacturer: 'mazda' },
      { carNumber: '90', teamName: 'Vortex Motorsport', driverName: 'K. Tanaka', manufacturer: 'honda' },
    ],
  },
  {
    id: '3',
    timestamp: '02:08 PM',
    carNumbers: ['130'],
    station: '13',
    infraction: 'Heavy dumping',
    notes: '',
    action: 'no-action',
    cars: [
      { carNumber: '130', teamName: 'Iron Horse Racing', driverName: 'D. Alvarez', manufacturer: 'ford' },
    ],
  },
  {
    id: '4',
    timestamp: '01:45 PM',
    carNumbers: ['99'],
    station: 'PR',
    infraction: 'Pit Lane/Fueling Infraction',
    notes: 'Visor up',
    action: 'warning',
    cars: [
      { carNumber: '99', teamName: 'Gridline Racing', driverName: 'T. Brooks', manufacturer: 'mazda' },
    ],
  },
  {
    id: '5',
    timestamp: '01:32 PM',
    carNumbers: ['77', '163'],
    station: '13',
    infraction: 'Contact',
    notes: 'Contact incidental.',
    action: 'no-action',
    cars: [
      { carNumber: '77', teamName: 'Blackthorn Racing', driverName: 'S. Patel', manufacturer: 'BMW' },
      { carNumber: '163', teamName: 'Redline Endurance', driverName: 'J. Novak', manufacturer: 'chevrolet' },
    ],
  },
  {
    id: '6',
    timestamp: '01:15 PM',
    carNumbers: ['130'],
    station: '5',
    infraction: 'Smoking',
    notes: '',
    action: 'no-action',
    cars: [
      { carNumber: '130', teamName: 'Iron Horse Racing', driverName: 'D. Alvarez', manufacturer: 'ford' },
    ],
  },
  {
    id: '7',
    timestamp: '12:58 PM',
    carNumbers: ['77'],
    station: 'PR',
    infraction: 'Pit Lane/Fueling Infraction',
    notes: 'Fire bottle not ready',
    action: 'warning',
    cars: [
      { carNumber: '77', teamName: 'Blackthorn Racing', driverName: 'S. Patel', manufacturer: 'BMW' },
    ],
  },
  {
    id: '8',
    timestamp: '12:42 PM',
    carNumbers: ['555'],
    station: '15',
    infraction: 'Slow',
    notes: '',
    action: 'no-action',
    cars: [
      { carNumber: '555', teamName: 'Thermal Racing Co.', driverName: 'L. Garcia', manufacturer: 'mercedes-benz' },
    ],
  },
  {
    id: '9',
    timestamp: '12:30 PM',
    carNumbers: ['41'],
    station: '15',
    infraction: 'Stopped DL',
    notes: '',
    action: 'no-action',
    cars: [
      { carNumber: '41', teamName: 'Cobalt Motorsport', driverName: 'A. Williams', manufacturer: 'toyota' },
    ],
  },
  {
    id: '10',
    timestamp: '12:15 PM',
    carNumbers: ['41'],
    station: 'PR',
    infraction: 'Pit Lane/Fueling Infraction',
    notes: 'Unsafe release',
    action: 'black-flag',
    cars: [
      { carNumber: '41', teamName: 'Cobalt Motorsport', driverName: 'A. Williams', manufacturer: 'toyota' },
    ],
  },
];

// Precompute penalty counts per car and driver across all entries
function computePenaltyCounts(entries: RaceLogEntry[]) {
  const carCounts: Record<string, number> = {};
  const driverCounts: Record<string, number> = {};
  for (const entry of entries) {
    if (entry.action === 'no-action') continue;
    for (const car of entry.cars) {
      carCounts[car.carNumber] = (carCounts[car.carNumber] || 0) + 1;
      driverCounts[car.driverName] = (driverCounts[car.driverName] || 0) + 1;
    }
  }
  return { carCounts, driverCounts };
}

interface RaceLogProps {
  entries?: RaceLogEntry[];
  /** Show Update button per row. TODO: Gate behind role-based access — only visible to
   *  users with roles: admin, developer, race_control, race_engineer */
  showUpdate?: boolean;
  onUpdate?: (entry: RaceLogEntry) => void;
  className?: string;
}

export function RaceLog({ entries, showUpdate = false, onUpdate, className = '' }: RaceLogProps) {
  const data = entries ?? SAMPLE_ENTRIES;
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);

  const { carCounts, driverCounts } = useMemo(
    () => computePenaltyCounts(data),
    [data]
  );

  return (
    <div className={`bg-bg-card border-2 border-[#999999] rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-default">
        <span className="section-header text-sm">RACE CONTROL LOG</span>
        <span className="text-[0.625rem] text-text-muted font-[var(--font-mono)]">
          {data.length} entries
        </span>
      </div>

      {/* Column headers */}
      <div className={`grid ${showUpdate ? 'grid-cols-[5rem_3.5rem_1fr_1fr_6rem_5rem]' : 'grid-cols-[5rem_3.5rem_1fr_1fr_6rem]'} gap-3 px-5 py-2 border-b border-border-default text-xs uppercase tracking-wider text-text-secondary font-semibold`}>
        <span>Car</span>
        <span>Stn</span>
        <span>Infraction</span>
        <span>Notes</span>
        <span className="text-right">Action</span>
        {showUpdate && <span />}
      </div>

      {/* Entries */}
      <div className="max-h-[400px] overflow-y-auto">
        {data.map((entry) => {
          const action = ACTION_STYLES[entry.action];
          const isHovered = hoveredEntry === entry.id;

          return (
            <div
              key={entry.id}
              onMouseEnter={() => setHoveredEntry(entry.id)}
              onMouseLeave={() => setHoveredEntry(null)}
              className={`border-b border-border-default/50 transition-colors ${isHovered ? 'bg-bg-elevated' : 'hover:bg-bg-hover'}`}
            >
              <div
                className={`grid ${showUpdate ? 'grid-cols-[5rem_3.5rem_1fr_1fr_6rem_5rem]' : 'grid-cols-[5rem_3.5rem_1fr_1fr_6rem]'} gap-3 px-5 py-2.5 items-center`}
              >
                {/* Car numbers */}
                <div className="flex items-center gap-1 flex-wrap">
                  {entry.carNumbers.map((num) => (
                    <span
                      key={num}
                      className="font-data text-sm font-bold text-accent-orange"
                    >
                      #{num}
                    </span>
                  ))}
                </div>

                {/* Station */}
                <span className="font-data text-xs text-text-secondary">
                  {entry.station}
                </span>

                {/* Infraction */}
                <span className="text-sm text-text-primary">
                  {entry.infraction}
                </span>

                {/* Notes */}
                <span className="text-xs text-text-secondary truncate">
                  {entry.notes || '—'}
                </span>

                {/* Action badge */}
                <div className="flex justify-end">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider border rounded ${action.bg} ${action.text} ${action.border}`}
                  >
                    {action.label}
                  </span>
                </div>

                {/* Update button — TODO: Gate behind role-based access (admin, developer, race_control, race_engineer) */}
                {showUpdate && (
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdate?.(entry); }}
                      className="px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider border border-status-blue/40 text-status-blue bg-status-blue/10 rounded hover:bg-status-blue/20 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>

              {/* Expanded car detail rows */}
              {isHovered && entry.cars.map((car) => (
                <div
                  key={car.carNumber}
                  className="flex items-center gap-4 px-5 py-1.5 bg-bg-surface border-t border-border-default/30 ml-4"
                >
                  <span className="font-data text-sm font-bold text-accent-orange w-14 shrink-0">
                    #{car.carNumber}
                  </span>
                  <img
                    src={`/assets/manufacturer-logos/${car.manufacturer}.png`}
                    alt={car.manufacturer}
                    className="h-5 w-5 object-contain shrink-0"
                  />
                  <span className="text-xs text-text-primary font-medium w-44 truncate shrink-0">
                    {car.teamName}
                  </span>
                  <span className="text-xs text-text-secondary flex-1 truncate">
                    {car.driverName}
                  </span>
                  <div className="flex items-center gap-4 shrink-0 text-xs">
                    <span className="text-text-muted">
                      Car Penalties{' '}
                      <span className={`font-data font-bold ${(carCounts[car.carNumber] || 0) > 0 ? 'text-accent-orange' : 'text-text-muted'}`}>
                        {carCounts[car.carNumber] || 0}
                      </span>
                    </span>
                    <span className="text-text-muted">
                      Driver Penalties{' '}
                      <span className={`font-data font-bold ${(driverCounts[car.driverName] || 0) > 0 ? 'text-accent-orange' : 'text-text-muted'}`}>
                        {driverCounts[car.driverName] || 0}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider border border-status-blue/40 text-status-blue bg-status-blue/10 rounded hover:bg-status-blue/20 transition-colors">
                      Telemetry
                    </button>
                    <button className="px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider border border-purple-500/40 text-purple-400 bg-purple-500/10 rounded hover:bg-purple-500/20 transition-colors">
                      Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Timestamp footer */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-border-default">
        <span className="text-[0.5625rem] text-text-muted">
          Newest entries shown first
        </span>
        <span className="text-[0.5625rem] text-text-muted font-[var(--font-mono)]">
          Last updated: {data[0]?.timestamp ?? '—'}
        </span>
      </div>
    </div>
  );
}
