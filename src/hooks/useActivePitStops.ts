'use client';

import { useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface ActivePitStop {
  id: string;
  participantId: string;
  carNumber: string;
  pitInTime: string;
  lapNumber: number;
  driverChange: boolean;
}

interface State {
  pitStops: ActivePitStop[];
  isLoading: boolean;
  error: string | null;
}

const EMPTY: State = { pitStops: [], isLoading: false, error: null };

/**
 * Lists in-progress pit stops for a session — rows in `pit_stops` where
 * pit_out_time is null. Subscribes to realtime changes on the table filtered
 * to this session so entries/exits propagate without polling.
 *
 * Auth-gated via userId.
 */
export function useActivePitStops(
  sessionUuid: string | null,
  userId: string | null,
): State {
  const [state, setState] = useState<State>(EMPTY);

  useEffect(() => {
    if (!sessionUuid || !userId) {
      setState(EMPTY);
      return;
    }

    let cancelled = false;
    let channel: RealtimeChannel | null = null;
    setState({ pitStops: [], isLoading: true, error: null });

    const fetchData = async () => {
      // Car numbers live on session_participants, so fetch those first.
      const { data: participants, error: partError } = await supabase
        .from('session_participants')
        .select('participant_id, car_number')
        .eq('session_id', sessionUuid);

      if (partError) throw partError;

      const carByParticipant = new Map(
        (participants ?? []).map((p) => [p.participant_id, p.car_number])
      );

      const { data: stops, error: stopError } = await supabase
        .from('pit_stops')
        .select('id, participant_id, pit_in_time, lap_number, driver_change')
        .eq('session_id', sessionUuid)
        .is('pit_out_time', null)
        .order('pit_in_time', { ascending: true });

      if (stopError) throw stopError;

      const rows: ActivePitStop[] = (stops ?? []).map((s) => ({
        id: s.id,
        participantId: s.participant_id,
        carNumber: carByParticipant.get(s.participant_id) ?? '',
        pitInTime: s.pit_in_time,
        lapNumber: s.lap_number,
        driverChange: !!s.driver_change,
      }));

      if (!cancelled) setState({ pitStops: rows, isLoading: false, error: null });
    };

    fetchData()
      .then(() => {
        if (cancelled) return;
        channel = supabase
          .channel(`active-pit-stops-${sessionUuid}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'pit_stops',
              filter: `session_id=eq.${sessionUuid}`,
            },
            () => {
              fetchData().catch((err) => {
                if (cancelled) return;
                setState((s) => ({
                  ...s,
                  error: err instanceof Error ? err.message : 'Refetch failed',
                }));
              });
            }
          )
          .subscribe();
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          pitStops: [],
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load pit stops',
        });
      });

    return () => {
      cancelled = true;
      if (channel) channel.unsubscribe();
    };
  }, [sessionUuid, userId]);

  return state;
}
