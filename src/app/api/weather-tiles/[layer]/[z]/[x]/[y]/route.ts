import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Layers OpenWeather exposes through the free tile endpoint. Whitelisted so
// arbitrary path segments can't be passed through to the upstream URL.
const ALLOWED_LAYERS = new Set([
  'precipitation_new',
  'clouds_new',
  'pressure_new',
  'wind_new',
  'temp_new',
]);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ layer: string; z: string; x: string; y: string }> }
) {
  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json({ error: 'Weather API key not configured' }, { status: 500 });
  }

  const { layer, z, x, y } = await params;

  if (!ALLOWED_LAYERS.has(layer)) {
    return NextResponse.json({ error: 'Unsupported layer' }, { status: 400 });
  }
  if (!/^\d+$/.test(z) || !/^\d+$/.test(x) || !/^\d+$/.test(y)) {
    return NextResponse.json({ error: 'Invalid tile coordinates' }, { status: 400 });
  }

  const upstream = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${OPENWEATHER_API_KEY}`;

  try {
    const res = await fetch(upstream);
    if (!res.ok) {
      return NextResponse.json(
        { error: `OpenWeather returned ${res.status}` },
        { status: res.status }
      );
    }
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        // OpenWeather updates radar every ~10 minutes; cache for 5 to keep
        // it reasonably fresh without hammering the upstream.
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (err) {
    console.error('[Weather tiles proxy] Fetch error:', err);
    return NextResponse.json({ error: 'Failed to reach OpenWeather' }, { status: 502 });
  }
}
