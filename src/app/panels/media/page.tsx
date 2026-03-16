'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PanelHeader } from '@/components/layout/PanelHeader';
import { useBridgeSocket } from '@/hooks/useBridgeSocket';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { useTrackData } from '@/hooks/useTrackData';
import type { FlagColor } from '@/types/racing';

interface SentinelFeed {
  car_number: string;
  youtube_public_url: string;
}

function youtubeEmbedUrl(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    // Already embed
    if (url.pathname.startsWith('/embed/')) return publicUrl;
    // watch?v=ID
    const v = url.searchParams.get('v');
    if (v) return `https://www.youtube.com/embed/${v}?autoplay=0&modestbranding=1&rel=0`;
    // youtu.be/ID or /live/ID or /shorts/ID
    const match = url.pathname.match(/^\/(?:shorts\/|live\/)?([a-zA-Z0-9_-]{11})$/);
    if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=0&modestbranding=1&rel=0`;
  } catch {
    // Not valid
  }
  return null;
}

export default function MediaPanel() {
  const bridge = useBridgeSocket();
  const track = useTrackData(bridge.selectedEventId);
  const [flagColor, setFlagColor] = useState<FlagColor | null>(null);
  const [feeds, setFeeds] = useState<SentinelFeed[]>([]);
  const [feedsLoading, setFeedsLoading] = useState(false);
  const [expandedFeed, setExpandedFeed] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useBroadcastChannel({
    onEventSelected: (msg) => bridge.selectEvent(msg.eventId),
    onFlagChange: (msg) => setFlagColor(msg.flagColor),
  });

  const eventName = bridge.availableEvents.find(
    (e) => e.eventId === bridge.selectedEventId
  )?.name ?? bridge.selectedEventId ?? null;

  // Fetch feeds from Sentinel API via proxy
  const fetchFeeds = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(`/api/sentinel/feeds?lat=${lat}&lon=${lon}`);
      if (!res.ok) {
        setFeeds([]);
        return;
      }
      const data: SentinelFeed[] = await res.json();
      setFeeds(Array.isArray(data) ? data : []);
    } catch {
      setFeeds([]);
    }
  }, []);

  // Auto-discover feeds when track coordinates are available
  useEffect(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    if (track.coordinates.length === 0) return;

    // Use first coordinate as track location
    const { lat, lng } = track.coordinates[0];
    if (!lat || !lng) return;

    setFeedsLoading(true);
    fetchFeeds(lat, lng).finally(() => setFeedsLoading(false));

    // Poll every 60 seconds
    pollRef.current = setInterval(() => fetchFeeds(lat, lng), 60000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [track.coordinates, fetchFeeds]);

  return (
    <>
      <PanelHeader
        panelName="Media"
        panelIcon="🎬"
        connectionState={bridge.connectionState}
        eventName={eventName}
        flagColor={bridge.raceState?.flagColor ?? flagColor}
      />

      <div className="flex-1 overflow-auto">
        {/* Expanded feed — full width player */}
        {expandedFeed && (
          <div className="border-b border-border-default bg-bg-primary">
            <div className="flex items-center justify-between px-4 py-2 bg-bg-surface border-b border-border-default">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-red animate-pulse" />
                <span className="section-header text-xs">
                  CAR #{feeds.find((f) => f.car_number === expandedFeed)?.car_number}
                </span>
              </div>
              <button
                onClick={() => setExpandedFeed(null)}
                className="text-text-muted hover:text-text-primary text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {(() => {
                const feed = feeds.find((f) => f.car_number === expandedFeed);
                const embedUrl = feed ? youtubeEmbedUrl(feed.youtube_public_url) : null;
                return embedUrl ? (
                  <iframe
                    src={embedUrl.replace('autoplay=0', 'autoplay=1')}
                    title={`Car #${expandedFeed} Live`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : null;
              })()}
            </div>
          </div>
        )}

        {/* Stats bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-bg-surface border-b border-border-default shrink-0">
          <div className="flex items-center gap-3">
            <span className="section-header text-xs">IN-CAR FEEDS</span>
            {feeds.length > 0 && (
              <span className="flex items-center gap-1.5 text-[0.625rem] text-status-green font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
                {feeds.length} LIVE
              </span>
            )}
          </div>
          {eventName && (
            <span className="text-[0.625rem] text-text-muted">{eventName}</span>
          )}
        </div>

        {/* Feed grid */}
        <div className="p-4">
          {feedsLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="text-2xl animate-spin">📡</span>
              <span className="section-header text-text-muted text-xs">SCANNING FOR LIVE FEEDS</span>
            </div>
          ) : feeds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="text-3xl">📡</span>
              <span className="section-header text-text-muted">NO LIVE FEEDS</span>
              <p className="text-text-muted text-xs text-center max-w-sm font-[var(--font-mono)]">
                {bridge.selectedEventId
                  ? 'No in-car streams are broadcasting near this event. Feeds will appear automatically when cars go live.'
                  : 'Select an event to discover live in-car feeds.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {feeds.map((feed) => {
                const embedUrl = youtubeEmbedUrl(feed.youtube_public_url);
                return (
                  <div
                    key={feed.car_number}
                    className="bg-bg-card border border-border-default rounded-lg overflow-hidden hover:border-accent-orange/50 transition-colors group"
                  >
                    {/* Car badge header */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-bg-surface border-b border-border-default">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-red animate-pulse" />
                        <span className="font-data text-sm font-bold text-accent-orange">
                          #{feed.car_number}
                        </span>
                      </div>
                      <button
                        onClick={() => setExpandedFeed(expandedFeed === feed.car_number ? null : feed.car_number)}
                        className="text-[0.625rem] text-text-muted hover:text-accent-orange uppercase tracking-wider font-semibold transition-colors"
                      >
                        {expandedFeed === feed.car_number ? 'Collapse' : 'Expand'}
                      </button>
                    </div>

                    {/* Video */}
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={`Car #${feed.car_number} Live`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      ) : (
                        <a
                          href={feed.youtube_public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-bg-elevated text-accent-orange text-sm hover:underline"
                        >
                          Open Stream ↗
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
