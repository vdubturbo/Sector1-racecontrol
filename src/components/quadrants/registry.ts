import type { QuadViewDescriptor } from './types';
import { DriversView } from './views/DriversView';
import { LeadersView } from './views/LeadersView';
import { PitRoadView } from './views/PitRoadView';
import { RaceLogSummaryView } from './views/RaceLogSummaryView';
import { TrackMapView } from './views/TrackMapView';

/**
 * Registry of views that can appear in a quadrant slot.
 * The dropdown picker is driven entirely by this array — add a new view here
 * and it becomes selectable in every slot.
 */
export const QUAD_VIEWS: QuadViewDescriptor[] = [
  {
    id: 'leaders',
    label: 'Leaders',
    icon: '🏆',
    category: 'timing',
    component: LeadersView,
    requiresEvent: true,
  },
  {
    id: 'race-log-summary',
    label: 'Race Control Log',
    icon: '📋',
    category: 'incidents',
    component: RaceLogSummaryView,
    requiresEvent: true,
  },
  {
    id: 'track-map',
    label: 'Track Map',
    icon: '🗺️',
    category: 'other',
    component: TrackMapView,
    requiresEvent: true,
    autoFit: false,
  },
  {
    id: 'drivers',
    label: 'Drivers',
    icon: '🧑‍✈️',
    category: 'timing',
    component: DriversView,
    requiresEvent: true,
  },
  {
    id: 'pit-road',
    label: 'Pit Road',
    icon: '🔧',
    category: 'strategy',
    component: PitRoadView,
    requiresEvent: true,
  },
];
