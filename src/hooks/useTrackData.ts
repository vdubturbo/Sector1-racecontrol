'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface TrackCoordinate {
  x: number;
  y: number;
  lat: number;
  lng: number;
  elevation?: number | null;
}

export interface TrackCorner {
  name: string;
  index: number;
  x: number;
  y: number;
}

export interface TrackStartFinish {
  index: number;
  x: number;
  y: number;
}

interface TrackDataState {
  coordinates: TrackCoordinate[];
  corners: TrackCorner[];
  startFinish: TrackStartFinish | null;
  rotation: number;
  trackId: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Given a RedMist eventId (numeric string), look up the Supabase event
 * to find its track_id, then fetch track coordinates.
 */
export function useTrackData(redmistEventId: string | null): TrackDataState {
  const [coordinates, setCoordinates] = useState<TrackCoordinate[]>([]);
  const [corners, setCorners] = useState<TrackCorner[]>([]);
  const [startFinish, setStartFinish] = useState<TrackStartFinish | null>(null);
  const [rotation, setRotation] = useState(0);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!redmistEventId) {
      setCoordinates([]);
      setCorners([]);
      setStartFinish(null);
      setRotation(0);
      setTrackId(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        // First try to find event by matching the redmist event ID
        // The bridge sends numeric IDs like "4552" — events in Supabase
        // store these as redmist_event_id or we match by name
        // Try multiple approaches:

        // Match on racing_events.redmist_event_id (racing_sessions only has
        // redmist_session_id, not event id — the earlier two-query fallback
        // never returned anything and is removed).
        const { data: events } = await supabase
          .from('racing_events')
          .select('event_id, track_id, redmist_event_id')
          .eq('redmist_event_id', redmistEventId)
          .limit(1);

        let eventId: string | null = null;

        if (events && events.length > 0) {
          eventId = events[0].event_id;
          if (events[0].track_id) {
            setTrackId(events[0].track_id);
            await fetchTrackData(events[0].track_id, cancelled, setCoordinates, setCorners, setStartFinish, setRotation, setError);
            return;
          }
        }

        if (!eventId) {
          // 3. Try the event_id as a UUID directly (in case bridge sends UUIDs)
          const { data: directEvent } = await supabase
            .from('racing_events')
            .select('event_id, track_id')
            .eq('event_id', redmistEventId)
            .limit(1);

          if (directEvent && directEvent.length > 0 && directEvent[0].track_id) {
            if (cancelled) return;
            setTrackId(directEvent[0].track_id);
            await fetchTrackData(directEvent[0].track_id, cancelled, setCoordinates, setCorners, setStartFinish, setRotation, setError);
            return;
          }

          if (cancelled) return;
          setError('Event not found in database');
          return;
        }

        // Get track_id from event
        const { data: event } = await supabase
          .from('racing_events')
          .select('track_id')
          .eq('event_id', eventId)
          .single();

        if (cancelled) return;

        if (!event?.track_id) {
          setError('No track assigned to event');
          return;
        }

        setTrackId(event.track_id);
        await fetchTrackData(event.track_id, cancelled, setCoordinates, setCorners, setStartFinish, setRotation, setError);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load track');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [redmistEventId]);

  return { coordinates, corners, startFinish, rotation, trackId, isLoading, error };
}

async function fetchTrackData(
  trackId: string,
  cancelled: boolean,
  setCoordinates: (coords: TrackCoordinate[]) => void,
  setCorners: (corners: TrackCorner[]) => void,
  setStartFinish: (sf: TrackStartFinish | null) => void,
  setRotation: (rotation: number) => void,
  setError: (error: string | null) => void
) {
  // Fetch track geometry and track metadata in parallel
  const [trackDataResult, trackMetaResult] = await Promise.all([
    supabase
      .from('track_data')
      .select('coordinates, reference_points')
      .eq('track_id', trackId)
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('tracks')
      .select('metadata')
      .eq('id', trackId)
      .single(),
  ]);

  if (cancelled) return;

  // Apply rotation from track metadata
  const meta = trackMetaResult.data?.metadata as { rotation?: number } | null;
  if (meta?.rotation != null) {
    setRotation(meta.rotation);
  }

  const { data: trackData, error: trackError } = trackDataResult;

  if (cancelled) return;

  if (trackError || !trackData?.length || !trackData[0].coordinates) {
    setError('Track coordinate data not found');
    return;
  }

  const coords = trackData[0].coordinates as unknown as TrackCoordinate[];
  if (Array.isArray(coords) && coords.length > 0) {
    setCoordinates(coords);
  } else {
    setError('Track has no coordinate data');
    return;
  }

  // Extract corners and start/finish from reference_points
  const refPoints = trackData[0].reference_points as unknown as {
    corners?: TrackCorner[];
    start_finish?: TrackStartFinish;
  } | null;

  if (refPoints?.corners) {
    setCorners(refPoints.corners);
  }
  if (refPoints?.start_finish) {
    setStartFinish(refPoints.start_finish);
  }
}
