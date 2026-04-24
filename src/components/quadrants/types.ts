import type { ComponentType } from 'react';

export type QuadSlotId = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface QuadSlotConfig {
  viewId: string | null;
  /** View-specific settings, persisted per-slot. Shape is view-defined. */
  settings?: Record<string, unknown>;
}

export interface QuadLayout {
  slots: Record<QuadSlotId, QuadSlotConfig>;
}

export interface QuadViewProps {
  eventId: string | null;
  settings: Record<string, unknown> | undefined;
  onSettingsChange: (next: Record<string, unknown>) => void;
  /** Views may surface a handle to open their full-size popout counterpart. */
  onExpand?: () => void;
}

export type QuadViewCategory = 'timing' | 'incidents' | 'strategy' | 'media' | 'other';

export interface QuadViewDescriptor {
  id: string;
  label: string;
  icon?: string;
  category: QuadViewCategory;
  component: ComponentType<QuadViewProps>;
  /** If true, the view is disabled in the picker when no event is selected. */
  requiresEvent?: boolean;
  /**
   * Opt out of the slot-level QuadAutoFit wrapper. Default true. Set false for
   * views whose own layout scales itself (e.g. SVG maps, video iframes) — the
   * density-based auto-fit is meant for text/table content and will collapse
   * percentage-height children.
   */
  autoFit?: boolean;
}
