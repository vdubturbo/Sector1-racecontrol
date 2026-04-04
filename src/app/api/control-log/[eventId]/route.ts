import { NextRequest, NextResponse } from 'next/server';

const BRIDGE_HTTP_URL =
  process.env.BRIDGE_HTTP_URL ||
  process.env.NEXT_PUBLIC_BRIDGE_HTTP_URL ||
  'http://localhost:3002';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  if (!eventId) {
    return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') ?? '100';

  try {
    const res = await fetch(
      `${BRIDGE_HTTP_URL}/control-log/${eventId}?limit=${encodeURIComponent(limit)}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Bridge returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Control log proxy] Fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to reach bridge server' },
      { status: 502 }
    );
  }
}
