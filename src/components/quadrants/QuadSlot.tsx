'use client';

import { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    if (!isPickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isPickerOpen]);

  const descriptor = views.find((v) => v.id === config.viewId);

  return (
    <section className="flex flex-col bg-bg-card border-2 border-[#999999] rounded-lg overflow-hidden min-h-0">
      {/* Header */}
      <div ref={menuRef} className="relative flex items-center justify-between px-3 py-1.5 border-b border-border-default bg-bg-surface shrink-0">
        <div className="flex items-center gap-2 text-[0.625rem] uppercase tracking-wider text-text-secondary font-semibold truncate">
          {descriptor?.icon && <span className="text-sm">{descriptor.icon}</span>}
          <span>{descriptor?.label ?? slotLabel}</span>
        </div>
        <button
          onClick={() => setIsPickerOpen((v) => !v)}
          className="text-[0.625rem] uppercase tracking-wider text-text-muted hover:text-accent-orange px-2 py-0.5 rounded border border-transparent hover:border-accent-orange transition-colors"
          aria-label="Change view"
        >
          Change ▾
        </button>

        {isPickerOpen && (
          <div className="absolute right-2 top-full mt-1 z-50 min-w-52 bg-bg-card border border-border-subtle rounded shadow-lg shadow-black/40 py-1 max-h-96 overflow-auto">
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
          </div>
        )}
      </div>

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
