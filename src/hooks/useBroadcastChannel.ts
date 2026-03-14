'use client';

import { useEffect, useCallback, useRef } from 'react';
import type { FlagColor } from '@/types/racing';

const CHANNEL_NAME = 'sector1-race-control';

export type BroadcastMessageType = 'flag_change' | 'event_selected' | 'car_selected';

export interface BroadcastFlagChange {
  type: 'flag_change';
  flagColor: FlagColor;
  timeRemaining: string;
}

export interface BroadcastEventSelected {
  type: 'event_selected';
  eventId: string;
}

export interface BroadcastCarSelected {
  type: 'car_selected';
  carNumber: string | null;
}

export type BroadcastPayload =
  | BroadcastFlagChange
  | BroadcastEventSelected
  | BroadcastCarSelected;

interface UseBroadcastChannelOptions {
  onFlagChange?: (msg: BroadcastFlagChange) => void;
  onEventSelected?: (msg: BroadcastEventSelected) => void;
  onCarSelected?: (msg: BroadcastCarSelected) => void;
}

export function useBroadcastChannel(options: UseBroadcastChannelOptions = {}) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<BroadcastPayload>) => {
      const data = event.data;
      switch (data.type) {
        case 'flag_change':
          optionsRef.current.onFlagChange?.(data);
          break;
        case 'event_selected':
          optionsRef.current.onEventSelected?.(data);
          break;
        case 'car_selected':
          optionsRef.current.onCarSelected?.(data);
          break;
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const broadcast = useCallback((payload: BroadcastPayload) => {
    channelRef.current?.postMessage(payload);
  }, []);

  return { broadcast };
}
