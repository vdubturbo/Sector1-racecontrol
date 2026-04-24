'use client';

import { useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface SessionDriverRow {
  sessionDriverId: string;
  participantId: string;
  carNumber: string;
  driverId: string;
  driverName: string;
  isPrimary: boolean;
  stintStartTime: string | null;
  totalLaps: number;
  totalTimeMs: number;
  stintCount: number;
}

interface State {
  drivers: SessionDriverRow[];
  isLoading: boolean;
  error: string | null;
}

const EMPTY: State = { drivers: [], isLoading: false, error: null };

/**
 * Lists session_drivers for a session, joined to the drivers table for names
 * and to session_participants for car numbers. Subscribes to realtime changes
 * on session_drivers filtered to this session's participants, so driver swaps
 * propagate without a refetch cycle.
 *
 * Gated on auth: returns empty state when no user id is supplied.
 */
export function useSessionDrivers(
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
    setState({ drivers: [], isLoading: true, error: null });

    const fetchData = async (): Promise<string[]> => {
      const { data: participants, error: partError } = await supabase
        .from('session_participants')
        .select('participant_id, car_number')
        .eq('session_id', sessionUuid);

      if (partError) throw partError;
      if (!participants || participants.length === 0) {
        if (!cancelled) setState({ drivers: [], isLoading: false, error: null });
        return [];
      }

      const carNumberByParticipant = new Map(
        participants.map((p) => [p.participant_id, p.car_number])
      );
      const participantIds = participants.map((p) => p.participant_id);

      const { data: sdRows, error: sdError } = await supabase
        .from('session_drivers')
        .select(
          `session_driver_id,
           participant_id,
           driver_id,
           is_primary,
           stint_start_time,
           total_laps,
           total_time_ms,
           stint_count,
           driver:drivers (display_name, nickname, first_name, last_name)`
        )
        .in('participant_id', participantIds);

      if (sdError) throw sdError;

      const rows: SessionDriverRow[] = (sdRows ?? []).map((r) => {
        const d = r.driver as
          | {
              display_name?: string | null;
              nickname?: string | null;
              first_name?: string | null;
              last_name?: string | null;
            }
          | null;
        const fullName = [d?.first_name, d?.last_name].filter(Boolean).join(' ').trim();
        const driverName =
          d?.nickname?.trim() || d?.display_name?.trim() || fullName || '';
        return {
          sessionDriverId: r.session_driver_id,
          participantId: r.participant_id ?? '',
          carNumber: carNumberByParticipant.get(r.participant_id ?? '') ?? '',
          driverId: r.driver_id ?? '',
          driverName,
          isPrimary: !!r.is_primary,
          stintStartTime: r.stint_start_time,
          totalLaps: r.total_laps ?? 0,
          totalTimeMs: r.total_time_ms ?? 0,
          stintCount: r.stint_count ?? 0,
        };
      });

      if (!cancelled) setState({ drivers: rows, isLoading: false, error: null });
      return participantIds;
    };

    fetchData()
      .then((participantIds) => {
        if (cancelled || participantIds.length === 0) return;
        channel = supabase
          .channel(`session-drivers-${sessionUuid}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'session_drivers',
              filter: `participant_id=in.(${participantIds.join(',')})`,
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
          drivers: [],
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load session drivers',
        });
      });

    return () => {
      cancelled = true;
      if (channel) channel.unsubscribe();
    };
  }, [sessionUuid, userId]);

  return state;
}
