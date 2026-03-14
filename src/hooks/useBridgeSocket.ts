'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { config } from '@/config/environment';
import type {
  NormalizedCarPosition,
  RaceState,
  CompetitorData,
  AvailableEvent,
  BridgeMessage,
  FlagColor,
} from '@/types/racing';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface BridgeState {
  connectionState: ConnectionState;
  positions: NormalizedCarPosition[];
  raceState: RaceState | null;
  competitors: CompetitorData[];
  availableEvents: AvailableEvent[];
  selectedEventId: string | null;
  lastUpdate: Date | null;
  error: string | null;
}

export interface BridgeActions {
  selectEvent: (eventId: string) => void;
  disconnect: () => void;
  reconnect: () => void;
}

const TRACK_FLAG_TO_COLOR: Record<number, FlagColor> = {
  0: 'green',
  1: 'yellow',
  2: 'yellow',
  3: 'red',
  4: 'checkered',
};

function normalizePosition(raw: Record<string, unknown>): NormalizedCarPosition {
  return {
    carNumber: String(raw.carNumber ?? raw.number ?? ''),
    overallPosition: Number(raw.overallPosition ?? 0),
    classPosition: Number(raw.classPosition ?? 0),
    lastLapTime: String(raw.lastLapTime ?? ''),
    bestTime: String(raw.bestTime ?? ''),
    totalTime: String(raw.totalTime ?? ''),
    isInPit: Boolean(raw.isInPit),
    isEnteredPit: Boolean(raw.isEnteredPit),
    isExitedPit: Boolean(raw.isExitedPit),
    pitStopCount: Number(raw.pitStopCount ?? 0),
    trackFlag: Number(raw.trackFlag ?? 0),
    localFlag: Number(raw.localFlag ?? 0),
    driverName: String(raw.driverName ?? ''),
    driverId: String(raw.driverId ?? ''),
    teamName: String(raw.teamName ?? ''),
    carClass: String(raw.class ?? raw.carClass ?? ''),
    latitude: raw.latitude != null && raw.latitude !== 0 ? Number(raw.latitude) : null,
    longitude: raw.longitude != null && raw.longitude !== 0 ? Number(raw.longitude) : null,
    lastLapCompleted: Number(raw.lastLapCompleted ?? 0),
    overallGap: String(raw.overallGap ?? ''),
    inClassGap: String(raw.inClassGap ?? ''),
    overallDifference: String(raw.overallDifference ?? ''),
    inClassDifference: String(raw.inClassDifference ?? ''),
    bestLap: Number(raw.bestLap ?? 0),
    isBestTime: Boolean(raw.isBestTime),
    currentStatus: String(raw.currentStatus ?? ''),
    impactWarning: Boolean(raw.impactWarning),
    penaltyLaps: Number(raw.penaltyLaps ?? 0),
    penaltyWarnings: Number(raw.penaltyWarnings ?? 0),
    blackFlags: Number(raw.blackFlags ?? 0),
  };
}

function normalizeFlagColor(raw: string | number | undefined): FlagColor {
  if (typeof raw === 'number') return TRACK_FLAG_TO_COLOR[raw] ?? 'unknown';
  if (typeof raw === 'string') {
    const lower = raw.toLowerCase();
    if (lower === 'green' || lower === 'yellow' || lower === 'red' || lower === 'checkered') return lower;
    if (lower === 'caution') return 'yellow';
  }
  return 'unknown';
}

export function useBridgeSocket(initialEventId?: string): BridgeState & BridgeActions {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [positions, setPositions] = useState<NormalizedCarPosition[]>([]);
  const [raceState, setRaceState] = useState<RaceState | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [availableEvents, setAvailableEvents] = useState<AvailableEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialEventId ?? null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const selectedEventIdRef = useRef(selectedEventId);
  const mountedRef = useRef(true);

  selectedEventIdRef.current = selectedEventId;

  const clearTimers = useCallback(() => {
    if (pingRef.current) {
      clearInterval(pingRef.current);
      pingRef.current = null;
    }
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
  }, []);

  const closeSocket = useCallback(() => {
    clearTimers();
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
  }, [clearTimers]);

  const scheduleReconnect = useCallback(() => {
    if (!mountedRef.current) return;
    clearTimers();
    const attempt = reconnectAttemptRef.current;
    const delay = Math.min(config.reconnectBaseMs * Math.pow(2, attempt), config.reconnectMaxMs);
    reconnectRef.current = setTimeout(() => {
      reconnectAttemptRef.current = attempt + 1;
      connect();
    }, delay);
  }, []); // connect added via ref pattern below

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data) as BridgeMessage;
      if (!mountedRef.current) return;

      setLastUpdate(new Date());

      switch (data.type) {
        case 'connected':
          if (data.availableEvents) {
            setAvailableEvents(data.availableEvents);
          }
          // If we have a selected event, subscribe
          if (selectedEventIdRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'subscribe', eventId: selectedEventIdRef.current }));
          }
          break;

        case 'positions':
          setPositions(
            (data.positions || []).map((p) => normalizePosition(p as unknown as Record<string, unknown>))
          );
          break;

        case 'flag_state':
          if (data.raceState) {
            setRaceState({
              ...data.raceState,
              flagColor: normalizeFlagColor(data.raceState.flagColor),
            });
          }
          break;

        case 'competitor_data':
          setCompetitors(data.competitors || []);
          break;

        case 'timing_events':
          // Timing events update handled by panels that need lap-by-lap data
          break;
      }
    } catch {
      // Ignore malformed messages
    }
  }, []);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    closeSocket();
    setConnectionState('connecting');
    setError(null);

    try {
      const eventParam = selectedEventIdRef.current ? `?eventId=${selectedEventIdRef.current}` : '';
      const ws = new WebSocket(`${config.bridgeWsUrl}${eventParam}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setConnectionState('connected');
        setError(null);
        reconnectAttemptRef.current = 0;

        // Start ping keepalive
        pingRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, config.pingIntervalMs);
      };

      ws.onmessage = handleMessage;

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setConnectionState('disconnected');
        clearTimers();
        scheduleReconnect();
      };

      ws.onerror = () => {
        if (!mountedRef.current) return;
        setConnectionState('error');
        setError('WebSocket connection error');
      };
    } catch (err) {
      setConnectionState('error');
      setError(err instanceof Error ? err.message : 'Failed to connect');
      scheduleReconnect();
    }
  }, [closeSocket, handleMessage, clearTimers, scheduleReconnect]);

  const disconnect = useCallback(() => {
    closeSocket();
    setConnectionState('disconnected');
  }, [closeSocket]);

  const reconnect = useCallback(() => {
    reconnectAttemptRef.current = 0;
    connect();
  }, [connect]);

  const selectEvent = useCallback((eventId: string) => {
    setSelectedEventId(eventId);
    setPositions([]);
    setRaceState(null);
    setCompetitors([]);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'subscribe', eventId }));
    }
  }, []);

  // Fetch available events on mount
  useEffect(() => {
    fetch(`${config.bridgeHttpUrl}/available-events`)
      .then((res) => res.json())
      .then((data) => {
        if (mountedRef.current && Array.isArray(data)) {
          setAvailableEvents(data);
        }
      })
      .catch(() => {
        // Non-critical — events will come via WS 'connected' message
      });
  }, []);

  // Connect on mount
  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      closeSocket();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    connectionState,
    positions,
    raceState,
    competitors,
    availableEvents,
    selectedEventId,
    lastUpdate,
    error,
    selectEvent,
    disconnect,
    reconnect,
  };
}
