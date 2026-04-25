'use client';

import dynamic from 'next/dynamic';
import type { QuadViewProps } from '../types';

// Leaflet touches `window` at module load, so keep it out of the SSR pass
// entirely rather than relying on 'use client' alone.
const WeatherMapInner = dynamic(
  () => import('./WeatherMapInner').then((m) => m.WeatherMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center text-text-muted text-xs">
        Loading map…
      </div>
    ),
  }
);

export function WeatherMapView(props: QuadViewProps) {
  return <WeatherMapInner {...props} />;
}
