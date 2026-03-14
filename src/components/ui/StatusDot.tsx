'use client';

interface StatusDotProps {
  status: 'connected' | 'disconnected' | 'closed' | 'connecting';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const COLORS: Record<StatusDotProps['status'], string> = {
  connected: 'bg-status-green',
  connecting: 'bg-status-yellow',
  disconnected: 'bg-status-red',
  closed: 'bg-border-subtle',
};

export function StatusDot({ status, size = 'sm', pulse = false }: StatusDotProps) {
  const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  const pulseClass = pulse && status === 'connected' ? 'pulse-dot' : '';

  return (
    <span
      className={`inline-block rounded-full ${COLORS[status]} ${sizeClass} ${pulseClass}`}
      title={status}
    />
  );
}
