'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface QuadContextValue {
  /** RedMist event id as the bridge uses it (numeric string). */
  redmistEventId: string | null;
  /** Supabase racing_events.event_id resolved from redmistEventId, or null. */
  eventUuid: string | null;
  /** Supabase racing_sessions.session_id for the active session, or null. */
  sessionUuid: string | null;
  /** Authenticated user id — views use this as an auth gate for DB reads. */
  userId: string | null;
}

const DEFAULT: QuadContextValue = {
  redmistEventId: null,
  eventUuid: null,
  sessionUuid: null,
  userId: null,
};

const QuadContext = createContext<QuadContextValue>(DEFAULT);

export function QuadProvider({
  value,
  children,
}: {
  value: QuadContextValue;
  children: ReactNode;
}) {
  return <QuadContext.Provider value={value}>{children}</QuadContext.Provider>;
}

export function useQuadContext(): QuadContextValue {
  return useContext(QuadContext);
}
