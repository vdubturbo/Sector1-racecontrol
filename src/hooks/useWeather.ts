'use client';

import { useState, useEffect } from 'react';
import type { TrackCoordinate } from '@/hooks/useTrackData';

export interface WeatherData {
  ambientTemp: number;       // °F
  feelsLike: number;         // °F
  trackTemp: number;         // °F (estimated)
  humidity: number;          // %
  windSpeed: number;         // mph
  windDirection: number;     // degrees
  conditions: {
    main: string;
    description: string;
    icon: string;
  };
  cloudiness: number;
  location: string;
}

export interface HourlyForecast {
  time: number;
  temp: number;
  trackTemp: number;
  conditions: { main: string; description: string; icon: string };
  precipChance: number;
}

interface WeatherState {
  weather: WeatherData | null;
  forecast: HourlyForecast[];
  isLoading: boolean;
  error: string | null;
}

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches weather for a track using its GPS coordinates.
 * Uses the start/finish coordinate (or first coordinate) as the location.
 */
export function useWeather(
  coordinates: TrackCoordinate[],
  startFinishIndex?: number | null,
): WeatherState {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<HourlyForecast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pick the representative coordinate
  const coord = coordinates.length > 0
    ? coordinates[startFinishIndex != null && startFinishIndex < coordinates.length ? startFinishIndex : 0]
    : null;
  const lat = coord?.lat;
  const lng = coord?.lng;

  useEffect(() => {
    if (lat == null || lng == null || lat === 0 || lng === 0) {
      setWeather(null);
      setForecast([]);
      return;
    }

    let cancelled = false;

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Weather API returned ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          setWeather(data.weather);
          setForecast(data.forecast ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, REFRESH_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [lat, lng]);

  return { weather, forecast, isLoading, error };
}
