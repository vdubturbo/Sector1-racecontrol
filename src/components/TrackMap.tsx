'use client';

import { useMemo } from 'react';
import type { TrackCoordinate, TrackCorner, TrackStartFinish } from '@/hooks/useTrackData';

interface TrackMapProps {
  coordinates: TrackCoordinate[];
  corners: TrackCorner[];
  startFinish: TrackStartFinish | null;
  rotation?: number;
  isLoading: boolean;
  error: string | null;
  className?: string;
}

const SECTOR_COLORS = ['#22c55e', '#3b82f6', '#e8751a']; // green, blue, orange
const SECTOR_LABELS = ['S1', 'S2', 'S3'];

export function TrackMap({ coordinates, corners, startFinish, rotation = 0, isLoading, error, className = '' }: TrackMapProps) {
  const { pathData, viewBox, sectorPaths, sectorLabelPositions } = useMemo(() => {
    if (coordinates.length === 0) return { pathData: '', viewBox: '0 0 1000 1000', sectorPaths: [], sectorLabelPositions: [] };

    // Compute center for rotation
    let sumX = 0, sumY = 0;
    for (const c of coordinates) { sumX += c.x; sumY += c.y; }
    const cx = sumX / coordinates.length;
    const cy = sumY / coordinates.length;

    // Compute bounding box of rotated coordinates
    const rad = (rotation * Math.PI) / 180;
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const c of coordinates) {
      // Rotate point around center
      const dx = c.x - cx;
      const dy = c.y - cy;
      const rx = cx + dx * cosR - dy * sinR;
      const ry = cy + dx * sinR + dy * cosR;
      if (rx < minX) minX = rx;
      if (rx > maxX) maxX = rx;
      if (ry < minY) minY = ry;
      if (ry > maxY) maxY = ry;
    }

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const padding = Math.max(rangeX, rangeY) * 0.12;

    const vbX = minX - padding;
    const vbY = minY - padding;
    const vbW = rangeX + padding * 2;
    const vbH = rangeY + padding * 2;

    const path = coordinates
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x},${c.y}`)
      .join(' ') + ' Z';

    // Split coordinates into 3 sectors
    const third = Math.floor(coordinates.length / 3);
    const sectors = [
      coordinates.slice(0, third),
      coordinates.slice(third, third * 2),
      coordinates.slice(third * 2),
    ];

    const sectorPaths = sectors.map((sector) =>
      sector.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x},${c.y}`).join(' ')
    );

    // Label position: midpoint of each sector
    const sectorLabelPositions = sectors.map((sector) => {
      const mid = sector[Math.floor(sector.length / 2)];
      return { x: mid.x, y: mid.y };
    });

    return {
      pathData: path,
      viewBox: `${vbX} ${vbY} ${vbW} ${vbH}`,
      sectorPaths,
      sectorLabelPositions,
    };
  }, [coordinates, rotation]);

  // Compute label offset direction (push outward from track center)
  const trackCenter = useMemo(() => {
    if (coordinates.length === 0) return { cx: 0, cy: 0 };
    let cx = 0, cy = 0;
    for (const c of coordinates) { cx += c.x; cy += c.y; }
    return { cx: cx / coordinates.length, cy: cy / coordinates.length };
  }, [coordinates]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="section-header text-text-muted animate-pulse">LOADING TRACK...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <span className="section-header text-text-muted">TRACK UNAVAILABLE</span>
          <p className="text-text-muted text-xs mt-2 font-[var(--font-mono)]">{error}</p>
        </div>
      </div>
    );
  }

  if (coordinates.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="section-header text-text-muted">NO TRACK DATA</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center bg-bg-primary ${className}`}>
      <svg
        className="w-full h-full max-w-4xl max-h-full"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`rotate(${rotation}, ${trackCenter.cx}, ${trackCenter.cy})`}>
        {/* Track surface fill */}
        <path
          d={pathData}
          fill="rgba(40, 40, 40, 0.9)"
          stroke="#666"
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {/* Sector colored overlays */}
        {sectorPaths.map((sPath, i) => (
          <path
            key={`sector-${i}`}
            d={sPath}
            fill="none"
            stroke={SECTOR_COLORS[i]}
            strokeWidth={4}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Sector labels */}
        {sectorLabelPositions.map((pos, i) => {
          const dx = pos.x - trackCenter.cx;
          const dy = pos.y - trackCenter.cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const offset = 30;
          const lx = pos.x + (dx / dist) * offset;
          const ly = pos.y + (dy / dist) * offset;

          return (
            <text
              key={`sector-label-${i}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              fill={SECTOR_COLORS[i]}
              fontSize={16}
              fontFamily="var(--font-mono)"
              fontWeight={700}
              stroke="#000"
              strokeWidth={0.5}
              paintOrder="stroke fill"
              transform={`rotate(${-rotation}, ${lx}, ${ly})`}
            >
              {SECTOR_LABELS[i]}
            </text>
          );
        })}

        {/* Start/finish marker */}
        {startFinish && (
          <line
            x1={startFinish.x - 5}
            y1={startFinish.y}
            x2={startFinish.x + 5}
            y2={startFinish.y}
            stroke="#ffffff"
            strokeWidth={2}
          />
        )}

        {/* Turn markers */}
        {corners.map((corner) => {
          // Offset label outward from track center
          const dx = corner.x - trackCenter.cx;
          const dy = corner.y - trackCenter.cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const offset = 22;
          const labelX = corner.x + (dx / dist) * offset;
          const labelY = corner.y + (dy / dist) * offset;

          return (
            <g key={corner.name}>
              <circle
                cx={corner.x}
                cy={corner.y}
                r={4}
                fill="#999999"
                stroke="#000"
                strokeWidth={0.5}
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#999999"
                fontSize={14}
                fontFamily="var(--font-mono)"
                fontWeight={700}
                stroke="#000"
                strokeWidth={0.4}
                paintOrder="stroke fill"
                transform={`rotate(${-rotation}, ${labelX}, ${labelY})`}
              >
                {corner.name}
              </text>
            </g>
          );
        })}
        </g>
      </svg>
    </div>
  );
}
