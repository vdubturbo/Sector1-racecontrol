'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface ActiveSession {
  eventUuid: string;
  sessionUuid: string;
  eventName: string;
  sessionName: string;
  sessionStatus: string | null;
  scheduledStart: string | null;
  scheduledEnd: string | null;
}

interface ActiveSessionState {
  session: ActiveSession | null;
  isLoading: boolean;
  error: string | null;
}

const EMPTY: ActiveSessionState = { session: null, isLoading: false, error: null };

/**
 * Translates a RedMist event id (bridge format) into a Supabase
 * racing_events / racing_sessions pair. Picks the most recently created
 * session for the event, preferring `status = 'active'` when present.
 *
 * Gated on auth: returns empty state when no user is signed in.
 */
export function useActiveSession(
  redmistEventId: string | null,
  userId: string | null,
): ActiveSessionState {
  const [state, setState] = useState<ActiveSessionState>(EMPTY);

  useEffect(() => {
    if (!redmistEventId || !userId) {
      setState(EMPTY);
      return;
    }

    let cancelled = false;
    setState({ session: null, isLoading: true, error: null });

    (async () => {
      try {
        const { data: events, error: eventError } = await supabase
          .from('racing_events')
          .select('event_id, event_name, scheduled_start, scheduled_end')
          .eq('redmist_event_id', redmistEventId)
          .limit(1);

        if (cancelled) return;
        if (eventError) throw eventError;
        if (!events || events.length === 0) {
          setState({ session: null, isLoading: false, error: 'No matching event in DB' });
          return;
        }

        const event = events[0];

        const { data: sessions, error: sessionError } = await supabase
          .from('racing_sessions')
          .select('session_id, session_name, status, scheduled_start, scheduled_end, created_at')
          .eq('event_id', event.event_id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (cancelled) return;
        if (sessionError) throw sessionError;
        if (!sessions || sessions.length === 0) {
          setState({ session: null, isLoading: false, error: 'Event has no sessions' });
          return;
        }

        const ACTIVE_STATUSES = new Set(['active', 'live', 'running', 'in_progress']);
        const active = sessions.find((s) => s.status && ACTIVE_STATUSES.has(s.status)) ?? sessions[0];

        setState({
          session: {
            eventUuid: event.event_id,
            sessionUuid: active.session_id,
            eventName: event.event_name ?? '',
            sessionName: active.session_name ?? '',
            sessionStatus: active.status,
            scheduledStart: active.scheduled_start,
            scheduledEnd: active.scheduled_end,
          },
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          session: null,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to resolve session',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [redmistEventId, userId]);

  return state;
}
