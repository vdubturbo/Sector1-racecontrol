'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md';
}

const BASE =
  'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded border focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-orange';

const VARIANTS: Record<string, string> = {
  default:
    'bg-bg-card border-border-subtle text-text-primary hover:bg-bg-hover hover:border-accent-orange',
  primary:
    'bg-accent-orange border-accent-orange text-white hover:bg-accent-amber',
  ghost:
    'bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover',
};

const SIZES: Record<string, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-sm',
};

export function Button({
  variant = 'default',
  size = 'sm',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
