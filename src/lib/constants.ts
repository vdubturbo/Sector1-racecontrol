import { PanelDefinition } from '@/types/panels';

export const BRIDGE_SERVER_URL =
  process.env.NEXT_PUBLIC_BRIDGE_URL || 'ws://localhost:8080';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const PANELS: PanelDefinition[] = [
  {
    id: 'timing',
    name: 'Live Timing',
    description: 'Full timing and scoring feed',
    route: '/panels/timing',
    icon: '⏱',
    windowFeatures: 'width=1400,height=900',
  },
  {
    id: 'control-log',
    name: 'Race Control Log',
    description: 'Official race control log entries',
    route: '/panels/control-log',
    icon: '📋',
    windowFeatures: 'width=1000,height=800',
  },
  {
    id: 'incidents',
    name: 'Incidents & Penalties',
    description: 'Incident reporting and penalty assignment',
    route: '/panels/incidents',
    icon: '⚠',
    windowFeatures: 'width=1200,height=800',
  },
  {
    id: 'directory',
    name: 'Car & Team Directory',
    description: 'Searchable car, team, and driver directory',
    route: '/panels/directory',
    icon: '🏎',
    windowFeatures: 'width=1100,height=800',
  },
  {
    id: 'flags',
    name: 'Flag Control',
    description: 'Flag status display and controls',
    route: '/panels/flags',
    icon: '🏁',
    windowFeatures: 'width=900,height=700',
  },
  {
    id: 'track-map',
    name: 'Track Map',
    description: 'Live track map with car positions',
    route: '/panels/track-map',
    icon: '🗺',
    windowFeatures: 'width=1200,height=900',
  },
  {
    id: 'classifications',
    name: 'Classifications',
    description: 'Live race classifications by class',
    route: '/panels/classifications',
    icon: '🏆',
    windowFeatures: 'width=1300,height=900',
  },
  {
    id: 'comms',
    name: 'Communications',
    description: 'Messages to teams and broadcast notifications',
    route: '/panels/comms',
    icon: '📡',
    windowFeatures: 'width=1000,height=800',
  },
];

export const FLAG_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  green:      { bg: '#22c55e', text: '#000000', label: 'GREEN' },
  yellow:     { bg: '#eab308', text: '#000000', label: 'YELLOW' },
  red:        { bg: '#ef4444', text: '#ffffff', label: 'RED' },
  checkered:  { bg: '#ffffff', text: '#000000', label: 'CHECKERED' },
  black:      { bg: '#000000', text: '#ffffff', label: 'BLACK' },
  white:      { bg: '#ffffff', text: '#000000', label: 'WHITE' },
  blue:       { bg: '#3b82f6', text: '#ffffff', label: 'BLUE' },
  'safety-car': { bg: '#f59e0b', text: '#000000', label: 'SAFETY CAR' },
  vsc:        { bg: '#f59e0b', text: '#000000', label: 'VSC' },
  none:       { bg: '#333333', text: '#888888', label: 'NO SESSION' },
};
