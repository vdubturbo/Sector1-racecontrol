'use client';

import { TrackMap } from '@/components/TrackMap';
import { useTrackData } from '@/hooks/useTrackData';
import type { QuadViewProps } from '../types';

/**
 * Quadrant view wrapping the existing TrackMap SVG. The SVG scales itself via
 * preserveAspectRatio, so this view opts out of QuadAutoFit at the slot level.
 */
export function TrackMapView({ eventId }: QuadViewProps) {
  const track = useTrackData(eventId);

  return (
    <TrackMap
      coordinates={track.coordinates}
      corners={track.corners}
      startFinish={track.startFinish}
      rotation={track.rotation}
      isLoading={track.isLoading}
      error={track.error}
      className="h-full w-full"
    />
  );
}
