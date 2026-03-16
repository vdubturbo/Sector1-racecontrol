import { NextRequest, NextResponse } from 'next/server';

const SENTINEL_API_URL = process.env.NEXT_PUBLIC_SENTINEL_API_URL || 'https://scc.candelaria-racing.com';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${SENTINEL_API_URL}/get_local_broadcasting_sentinels?lat=${lat}&lon=${lon}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Sentinel API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Sentinel proxy] Fetch error:', err);
    return NextResponse.json({ error: 'Failed to reach Sentinel API' }, { status: 502 });
  }
}
