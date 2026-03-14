// ── Flag & Session enums ────────────────────────────────────────────

export type FlagColor = 'green' | 'yellow' | 'red' | 'checkered' | 'unknown';

export type FlagState =
  | FlagColor
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

// ── Bridge server data types ────────────────────────────────────────

export interface NormalizedCarPosition {
  carNumber: string;
  overallPosition: number;
  classPosition: number;
  lastLapTime: string;
  bestTime: string;
  totalTime: string;
  isInPit: boolean;
  isEnteredPit: boolean;
  isExitedPit: boolean;
  pitStopCount: number;
  trackFlag: number;
  localFlag: number;
  driverName: string;
  driverId: string;
  teamName: string;
  carClass: string;
  latitude: number | null;
  longitude: number | null;
  lastLapCompleted: number;
  overallGap: string;
  inClassGap: string;
  overallDifference: string;
  inClassDifference: string;
  bestLap: number;
  isBestTime: boolean;
  currentStatus: string;
  impactWarning: boolean;
  penaltyLaps: number;
  penaltyWarnings: number;
  blackFlags: number;
}

export interface RaceState {
  flagColor: FlagColor;
  timeRemaining: string;
  localTime: string;
  elapsedTime: string;
  eventId: string;
  timestamp: string;
}

export interface CompetitorData {
  carNumber: string;
  teamName: string;
  driverNames: string;
  timestamp: string;
}

export interface AvailableEvent {
  eventId: string;
  name?: string;
  [key: string]: unknown;
}

// ── Bridge WebSocket message types ──────────────────────────────────

export interface BridgeConnectedMessage {
  type: 'connected';
  clientId: string;
  eventId?: string;
  availableEvents?: AvailableEvent[];
}

export interface BridgePositionsMessage {
  type: 'positions';
  eventId: string;
  positions: NormalizedCarPosition[];
}

export interface BridgeFlagStateMessage {
  type: 'flag_state';
  raceState: RaceState;
}

export interface BridgeCompetitorDataMessage {
  type: 'competitor_data';
  competitors: CompetitorData[];
}

export interface BridgeTimingEventsMessage {
  type: 'timing_events';
  events: Array<{
    carNumber: string;
    lastLapTime: string;
    class: string;
    teamName: string;
    driverNames: string[];
    timestamp: string;
  }>;
}

export type BridgeMessage =
  | BridgeConnectedMessage
  | BridgePositionsMessage
  | BridgeFlagStateMessage
  | BridgeCompetitorDataMessage
  | BridgeTimingEventsMessage;

// ── Application domain types ────────────────────────────────────────

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
