'use client';

import { useState, useEffect, useCallback } from 'react';
import type { QuadLayout, QuadSlotId } from '@/components/quadrants/types';

const STORAGE_KEY_PREFIX = 'sector1-racecontrol:quad-layout';

const EMPTY_LAYOUT: QuadLayout = {
  slots: {
    topLeft: { viewId: null },
    topRight: { viewId: null },
    bottomLeft: { viewId: null },
    bottomRight: { viewId: null },
  },
};

function storageKey(userId: string | null) {
  return `${STORAGE_KEY_PREFIX}:${userId ?? 'anon'}`;
}

/**
 * Per-user quadrant layout, persisted to localStorage. A layout records the
 * chosen view for each slot plus per-slot settings the view owns.
 *
 * `userId` keys the storage so multiple race-control users on the same machine
 * don't stomp each other. Anonymous users get a shared `anon` bucket.
 */
export function useQuadLayout(userId: string | null) {
  const [layout, setLayout] = useState<QuadLayout>(EMPTY_LAYOUT);
  const [ready, setReady] = useState(false);

  // Load on mount / user change
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(userId));
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<QuadLayout>;
        if (parsed?.slots) {
          setLayout({
            slots: {
              topLeft: parsed.slots.topLeft ?? { viewId: null },
              topRight: parsed.slots.topRight ?? { viewId: null },
              bottomLeft: parsed.slots.bottomLeft ?? { viewId: null },
              bottomRight: parsed.slots.bottomRight ?? { viewId: null },
            },
          });
        } else {
          setLayout(EMPTY_LAYOUT);
        }
      } else {
        setLayout(EMPTY_LAYOUT);
      }
    } catch {
      setLayout(EMPTY_LAYOUT);
    }
    setReady(true);
  }, [userId]);

  // Persist on change, but not on the initial load pass (avoids clobbering
  // another tab that wrote more recently).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(layout));
    } catch {
      // Quota exceeded or serialization error — ignore.
    }
  }, [layout, userId, ready]);

  const setSlotView = useCallback((slotId: QuadSlotId, viewId: string | null) => {
    setLayout((prev) => ({
      slots: {
        ...prev.slots,
        [slotId]: { ...prev.slots[slotId], viewId, settings: viewId === null ? undefined : prev.slots[slotId].settings },
      },
    }));
  }, []);

  const setSlotSettings = useCallback((slotId: QuadSlotId, settings: Record<string, unknown>) => {
    setLayout((prev) => ({
      slots: {
        ...prev.slots,
        [slotId]: { ...prev.slots[slotId], settings },
      },
    }));
  }, []);

  return { layout, ready, setSlotView, setSlotSettings };
}
