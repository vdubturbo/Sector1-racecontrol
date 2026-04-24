import type { QuadViewDescriptor } from './types';

/**
 * Registry of views that can appear in a quadrant slot.
 * The dropdown picker is driven entirely by this array — add a new view here
 * and it becomes selectable in every slot.
 */
export const QUAD_VIEWS: QuadViewDescriptor[] = [
  // Views will be added as we port popouts and build new quadrant-native views.
];
