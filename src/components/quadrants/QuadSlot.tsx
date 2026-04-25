'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import type { QuadSlotConfig, QuadViewDescriptor } from './types';
import { QuadErrorBoundary } from './ErrorBoundary';
import { QuadAutoFit } from './QuadAutoFit';

interface Props {
  slotLabel: string;
  config: QuadSlotConfig;
  views: QuadViewDescriptor[];
  eventId: string | null;
  onViewChange: (viewId: string | null) => void;
  onSettingsChange: (next: Record<string, unknown>) => void;
}

export function QuadSlot({
  slotLabel,
  config,
  views,
  eventId,
  onViewChange,
  onSettingsChange,
}: Props) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; right: number } | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // createPortal needs document.body, which only exists on the client.
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Position the portaled popover under the trigger button. Recomputed on
  // open and on window resize. Right-aligned so it grows leftward from the
  // trigger, mirroring the prior in-place layout.
  useLayoutEffect(() => {
    if (!isPickerOpen) return;
    const updatePos = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPopoverPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    };
    updatePos();
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [isPickerOpen]);

  useEffect(() => {
    if (!isPickerOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideMenu = menuRef.current?.contains(target);
      const insidePopover = popoverRef.current?.contains(target);
      if (!insideMenu && !insidePopover) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isPickerOpen]);

  const descriptor = views.find((v) => v.id === config.viewId);

  return (
    <section className="flex flex-col bg-bg-card border-2 border-[#999999] rounded-lg overflow-hidden min-h-0">
      {/* Header — explicit z-index puts it (and the picker dropdown) above
          any view body that creates its own stacking contexts (e.g. the
          Leaflet weather map, whose tile panes/controls would otherwise
          paint over the picker menu and make the slot un-changeable). */}
      <div ref={menuRef} className="relative z-10 flex items-center justify-between px-3 py-1.5 border-b border-border-default bg-bg-surface shrink-0">
        <div className="flex items-center gap-2 text-[0.625rem] uppercase tracking-wider text-text-secondary font-semibold truncate">
          {descriptor?.icon && <span className="text-sm">{descriptor.icon}</span>}
          <span>{descriptor?.label ?? slotLabel}</span>
        </div>
        <button
          ref={triggerRef}
          onClick={() => setIsPickerOpen((v) => !v)}
          className="text-[0.625rem] uppercase tracking-wider text-text-muted hover:text-accent-orange px-2 py-0.5 rounded border border-transparent hover:border-accent-orange transition-colors"
          aria-label="Change view"
        >
          Change ▾
        </button>
      </div>

      {/* Picker dropdown lives in a portal so it escapes the slot's
          overflow-hidden and any stacking contexts the body view creates
          (e.g. Leaflet's tile/control panes on the weather map). */}
      {isPickerOpen && portalTarget && popoverPos &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ top: popoverPos.top, right: popoverPos.right }}
            className="fixed z-[1000] min-w-52 bg-bg-card border border-border-subtle rounded shadow-lg shadow-black/40 py-1 max-h-96 overflow-auto"
          >
            <button
              onClick={() => {
                onViewChange(null);
                setIsPickerOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-text-muted hover:bg-bg-hover"
            >
              — None —
            </button>
            {views.length > 0 && <div className="my-1 border-t border-border-default" />}
            {views.length === 0 ? (
              <div className="px-3 py-2 text-[0.625rem] text-text-muted italic">
                No views available yet
              </div>
            ) : (
              views.map((v) => {
                const disabled = Boolean(v.requiresEvent) && !eventId;
                const isActive = config.viewId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      if (disabled) return;
                      onViewChange(v.id);
                      setIsPickerOpen(false);
                    }}
                    disabled={disabled}
                    className={`w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                      disabled
                        ? 'text-text-muted/40 cursor-not-allowed'
                        : 'text-text-primary hover:bg-bg-hover'
                    } ${isActive ? 'bg-bg-hover/50' : ''}`}
                  >
                    {v.icon && <span>{v.icon}</span>}
                    <span className="flex-1">{v.label}</span>
                    {isActive && <span className="text-accent-orange">•</span>}
                  </button>
                );
              })
            )}
          </div>,
          portalTarget
        )}

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <QuadErrorBoundary slotLabel={slotLabel}>
          {descriptor ? (
            descriptor.scrollable ? (
              <div className="h-full w-full overflow-y-auto">
                <descriptor.component
                  eventId={eventId}
                  settings={config.settings}
                  onSettingsChange={onSettingsChange}
                />
              </div>
            ) : descriptor.autoFit === false ? (
              <div className="h-full w-full">
                <descriptor.component
                  eventId={eventId}
                  settings={config.settings}
                  onSettingsChange={onSettingsChange}
                />
              </div>
            ) : (
              <QuadAutoFit>
                <descriptor.component
                  eventId={eventId}
                  settings={config.settings}
                  onSettingsChange={onSettingsChange}
                />
              </QuadAutoFit>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-text-muted text-xs">
              Please Select View
            </div>
          )}
        </QuadErrorBoundary>
      </div>
    </section>
  );
}
