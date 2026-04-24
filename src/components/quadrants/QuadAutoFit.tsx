'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /**
   * Smallest uniform scale allowed. If content still overflows at this scale,
   * the bottom is clipped. Default 0.35 keeps text legible while allowing
   * generous shrinkage for dense views like Leaders in a many-class event.
   */
  minScale?: number;
  className?: string;
}

/**
 * Shrinks its content to fit the available box without scrolling.
 * Measures natural content height against container height via ResizeObserver
 * and applies a uniform CSS transform. Never scales above 1:1.
 */
export function QuadAutoFit({ children, minScale = 0.35, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const recalc = () => {
      const cH = container.clientHeight;
      const iH = inner.scrollHeight;
      if (cH === 0 || iH === 0) return;
      const next = Math.max(minScale, Math.min(1, cH / iH));
      setScale(next);
    };

    const ro = new ResizeObserver(recalc);
    ro.observe(container);
    ro.observe(inner);
    recalc();

    return () => ro.disconnect();
  }, [minScale]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <div
        ref={innerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}
