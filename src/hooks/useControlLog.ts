'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ActionType, RaceLogEntry, CarDetail } from '@/components/RaceLog';

/** Raw abbreviated fields from RedMist V2 LoadControlLog API */
interface RedMistControlLogEntry {
  t: string;   // timestamp
  c1: string;  // car 1
  c2?: string; // car 2 (optional)
  cor: string;  // corner / station
  a: string;   // action description
  n: string;   // narrative / description
  on?: string; // official notes
  s?: string;  // status
  o: number;   // order / sequence number
}

function classifyAction(action: string): ActionType {
  const lower = (action ?? '').toLowerCase();
  if (lower.includes('black flag') || lower.includes('black-flag') || lower.includes('meatball')) return 'black-flag';
  if (lower.includes('dq') || lower.includes('disqualif')) return 'dq';
  if (lower.includes('penalty') || lower.includes('lap penalty') || lower.includes('stop and go') || lower.includes('drive through')) return 'penalty';
  if (lower.includes('warning')) return 'warning';
  return 'no-action';
}

function parseInfraction(narrative: string, action: string): string {
  // Use the narrative as the infraction description, fall back to action
  if (narrative && narrative.trim()) return narrative.trim();
  if (action && action.trim()) return action.trim();
  return 'Incident';
}

function mapEntry(raw: RedMistControlLogEntry, index: number): RaceLogEntry {
  const carNumbers: string[] = [];
  const cars: CarDetail[] = [];

  if (raw.c1) {
    carNumbers.push(raw.c1);
    cars.push({ carNumber: raw.c1, teamName: '', driverName: '', manufacturer: '' });
  }
  if (raw.c2) {
    carNumbers.push(raw.c2);
    cars.push({ carNumber: raw.c2, teamName: '', driverName: '', manufacturer: '' });
  }

  return {
    id: `${raw.o ?? 'x'}-${index}`,
    timestamp: raw.t ?? '',
    carNumbers,
    station: raw.cor ?? '',
    infraction: parseInfraction(raw.n, raw.a),
    notes: raw.on ?? '',
    action: classifyAction(raw.a),
    cars,
  };
}

interface UseControlLogOptions {
  /** Poll interval in ms. Set to 0 to disable polling. Default: 30000 (30s) */
  pollInterval?: number;
}

interface UseControlLogResult {
  entries: RaceLogEntry[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useControlLog(
  eventId: string | null,
  options: UseControlLogOptions = {}
): UseControlLogResult {
  const { pollInterval = 30_000 } = options;
  const [entries, setEntries] = useState<RaceLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLog = useCallback(async () => {
    if (!eventId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/control-log/${encodeURIComponent(eventId)}?limit=100`
      );

      if (!res.ok) {
        throw new Error(`Bridge returned ${res.status}`);
      }

      const data: RedMistControlLogEntry[] = await res.json();

      if (!mountedRef.current) return;

      setEntries(data.map((raw, i) => mapEntry(raw, i)));
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to fetch control log');
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [eventId]);

  // Fetch on mount / eventId change, then poll
  useEffect(() => {
    mountedRef.current = true;

    if (!eventId) {
      setEntries([]);
      setError(null);
      return;
    }

    fetchLog();

    if (pollInterval > 0) {
      intervalRef.current = setInterval(fetchLog, pollInterval);
    }

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [eventId, pollInterval, fetchLog]);

  return { entries, isLoading, error, refresh: fetchLog };
}
