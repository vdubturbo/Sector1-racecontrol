'use client';

import type { QuadLayout, QuadSlotId, QuadViewDescriptor } from './types';
import { QuadSlot } from './QuadSlot';

interface Props {
  layout: QuadLayout;
  views: QuadViewDescriptor[];
  eventId: string | null;
  onSlotViewChange: (slotId: QuadSlotId, viewId: string | null) => void;
  onSlotSettingsChange: (slotId: QuadSlotId, settings: Record<string, unknown>) => void;
}

const SLOT_ORDER: Array<{ id: QuadSlotId; label: string }> = [
  { id: 'topLeft', label: 'Top Left' },
  { id: 'topRight', label: 'Top Right' },
  { id: 'bottomLeft', label: 'Bottom Left' },
  { id: 'bottomRight', label: 'Bottom Right' },
];

export function QuadView({
  layout,
  views,
  eventId,
  onSlotViewChange,
  onSlotSettingsChange,
}: Props) {
  return (
    <div className="h-full grid grid-cols-2 grid-rows-2 gap-3 px-4 pb-3">
      {SLOT_ORDER.map((slot) => (
        <QuadSlot
          key={slot.id}
          slotLabel={slot.label}
          config={layout.slots[slot.id]}
          views={views}
          eventId={eventId}
          onViewChange={(viewId) => onSlotViewChange(slot.id, viewId)}
          onSettingsChange={(settings) => onSlotSettingsChange(slot.id, settings)}
        />
      ))}
    </div>
  );
}
