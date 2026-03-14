export type FlagState =
  | 'green'
  | 'yellow'
  | 'red'
  | 'checkered'
  | 'black'
  | 'white'
  | 'blue'
  | 'safety-car'
  | 'vsc'
  | 'none';

export type SessionType =
  | 'practice'
  | 'qualifying'
  | 'warmup'
  | 'race'
  | 'test';

export type SessionStatus =
  | 'scheduled'
  | 'delayed'
  | 'active'
  | 'suspended'
  | 'finished';

export type CarStatus =
  | 'on-track'
  | 'in-pit'
  | 'out'
  | 'dnf'
  | 'dns'
  | 'dsq';

export type PenaltyType =
  | 'drive-through'
  | 'stop-and-go'
  | 'time-penalty'
  | 'grid-penalty'
  | 'disqualification'
  | 'reprimand'
  | 'warning';

export type IncidentSeverity =
  | 'no-action'
  | 'noted'
  | 'under-investigation'
  | 'penalty-applied';

export interface Session {
  id: string;
  eventId: string;
  eventName: string;
  name: string;
  type: SessionType;
  status: SessionStatus;
  flagState: FlagState;
  scheduledStart: string;
  actualStart?: string;
  timeRemainingMs: number;
  totalLaps?: number;
  currentLap?: number;
  weather: Weather;
}

export interface Weather {
  ambientTempC: number;
  trackTempC: number;
  humidity: number;
  windSpeedKph: number;
  windDirection: string;
  conditions: 'dry' | 'damp' | 'wet';
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  licenseNumber?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  class: string;
}

export interface Car {
  id: string;
  number: string;
  class: string;
  team: Team;
  drivers: Driver[];
  currentDriver?: Driver;
  status: CarStatus;
  transponderNumber?: string;
}

export interface Incident {
  id: string;
  sessionId: string;
  timestamp: string;
  lap?: number;
  description: string;
  carsInvolved: string[];
  severity: IncidentSeverity;
  notes: string;
  reportedBy: string;
  penalty?: Penalty;
}

export interface Penalty {
  id: string;
  incidentId: string;
  carNumber: string;
  type: PenaltyType;
  details: string;
  timeSeconds?: number;
  served: boolean;
  issuedAt: string;
  servedAt?: string;
}

export interface ControlLogEntry {
  id: string;
  sessionId: string;
  timestamp: string;
  category: 'flag' | 'penalty' | 'notification' | 'safety' | 'mechanical' | 'admin';
  message: string;
  author: string;
  priority: 'routine' | 'important' | 'critical';
  relatedCarNumbers?: string[];
}

export interface Classification {
  position: number;
  carNumber: string;
  class: string;
  classPosition: number;
  team: string;
  driver: string;
  lapsCompleted: number;
  totalTime: string;
  lastLapTime: string;
  bestLapTime: string;
  gapToLeader: string;
  gapToCarAhead: string;
  pitStops: number;
  status: CarStatus;
}
