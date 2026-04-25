'use client';

import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import { useTrackData } from '@/hooks/useTrackData';
import type { QuadViewProps } from '../types';

export function WeatherMapInner({ eventId }: QuadViewProps) {
  const track = useTrackData(eventId);

  const positions = useMemo(
    () =>
      track.coordinates
        .filter((c) => c.lat !== 0 && c.lng !== 0)
        .map((c) => [c.lat, c.lng] as [number, number]),
    [track.coordinates]
  );

  // Pad bounds well beyond the track itself so weather context (radar
  // upstream, neighboring storm cells, etc.) is visible. Multiplier picked
  // to put the track in roughly the middle ~15% of the viewport.
  const bounds = useMemo(() => {
    if (positions.length === 0) return null;
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    for (const [lat, lng] of positions) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    }
    const padLat = (maxLat - minLat) * 6 || 0.5;
    const padLng = (maxLng - minLng) * 6 || 0.5;
    return new LatLngBounds(
      [minLat - padLat, minLng - padLng],
      [maxLat + padLat, maxLng + padLng],
    );
  }, [positions]);

  if (track.isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-xs">
        Loading…
      </div>
    );
  }

  if (track.error) {
    return (
      <div className="h-full flex items-center justify-center text-status-red text-xs px-3 text-center">
        {track.error}
      </div>
    );
  }

  if (positions.length === 0 || !bounds) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-xs">
        No track location
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [10, 10] }}
        scrollWheelZoom
        zoomControl
        className="h-full w-full"
        style={{ background: '#111111' }}
      >
        {/* Dark base map (Carto Dark Matter — free, no API key) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        {/* Weather radar overlay — proxied so the OpenWeather key stays
            server-side. Transparent where there's no precipitation. */}
        <TileLayer
          url="/api/weather-tiles/precipitation_new/{z}/{x}/{y}"
          opacity={0.6}
          attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
        />
        <Polyline
          positions={positions}
          pathOptions={{ color: '#e8751a', weight: 3, opacity: 0.95 }}
        />
      </MapContainer>

      <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 z-[400] px-2 py-1 rounded bg-bg-surface/80 border border-border-default text-[0.625rem] uppercase tracking-wider text-text-secondary font-semibold">
        Precipitation Radar
      </div>
    </div>
  );
}
