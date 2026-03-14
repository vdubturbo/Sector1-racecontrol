interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'orange' | 'green' | 'red' | 'yellow';
}

const VARIANTS: Record<string, string> = {
  default: 'border-border-subtle text-text-secondary',
  orange: 'border-accent-orange text-accent-orange bg-accent-orange-dim',
  green: 'border-status-green/40 text-status-green bg-status-green/10',
  red: 'border-status-red/40 text-status-red bg-status-red/10',
  yellow: 'border-status-yellow/40 text-status-yellow bg-status-yellow/10',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider border rounded ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
