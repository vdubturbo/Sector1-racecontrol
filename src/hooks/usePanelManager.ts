'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { PanelId, PanelStatus } from '@/types/panels';
import { PANELS } from '@/lib/constants';

interface PanelManagerReturn {
  panelStatuses: Record<PanelId, PanelStatus>;
  openPanel: (panelId: PanelId) => void;
  closePanel: (panelId: PanelId) => void;
  focusPanel: (panelId: PanelId) => void;
}

export function usePanelManager(): PanelManagerReturn {
  const windowRefs = useRef<Partial<Record<PanelId, Window | null>>>({});
  const [panelStatuses, setPanelStatuses] = useState<Record<PanelId, PanelStatus>>(() => {
    const initial: Record<string, PanelStatus> = {};
    PANELS.forEach((p) => {
      initial[p.id] = 'closed';
    });
    return initial as Record<PanelId, PanelStatus>;
  });

  // Poll for window closed state
  useEffect(() => {
    const interval = setInterval(() => {
      setPanelStatuses((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const panel of PANELS) {
          const ref = windowRefs.current[panel.id];
          if (ref && ref.closed) {
            windowRefs.current[panel.id] = null;
            if (next[panel.id] !== 'closed') {
              next[panel.id] = 'closed';
              changed = true;
            }
          }
        }
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const openPanel = useCallback((panelId: PanelId) => {
    const existing = windowRefs.current[panelId];
    if (existing && !existing.closed) {
      existing.focus();
      return;
    }

    const panel = PANELS.find((p) => p.id === panelId);
    if (!panel) return;

    const win = window.open(
      panel.route,
      `sector1-panel-${panelId}`,
      panel.windowFeatures
    );

    if (win) {
      windowRefs.current[panelId] = win;
      setPanelStatuses((prev) => ({ ...prev, [panelId]: 'connected' }));
    }
  }, []);

  const closePanel = useCallback((panelId: PanelId) => {
    const ref = windowRefs.current[panelId];
    if (ref && !ref.closed) {
      ref.close();
    }
    windowRefs.current[panelId] = null;
    setPanelStatuses((prev) => ({ ...prev, [panelId]: 'closed' }));
  }, []);

  const focusPanel = useCallback((panelId: PanelId) => {
    const ref = windowRefs.current[panelId];
    if (ref && !ref.closed) {
      ref.focus();
    }
  }, []);

  return { panelStatuses, openPanel, closePanel, focusPanel };
}
