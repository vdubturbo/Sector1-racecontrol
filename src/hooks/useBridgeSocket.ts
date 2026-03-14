'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

interface BridgeSocketReturn {
  connectionState: ConnectionState;
  lastMessage: unknown | null;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Stub hook for bridge server WebSocket connection.
 * Simulates connection lifecycle without actual WebSocket.
 */
export function useBridgeSocket(): BridgeSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [lastMessage, setLastMessage] = useState<unknown | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    cleanup();
    setConnectionState('connecting');

    // Simulate connection delay
    timerRef.current = setTimeout(() => {
      setConnectionState('connected');
      setLastMessage({ type: 'connected', timestamp: Date.now() });
    }, 1500);
  }, [cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
    setConnectionState('disconnected');
    setLastMessage(null);
  }, [cleanup]);

  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);

  return { connectionState, lastMessage, connect, disconnect };
}
