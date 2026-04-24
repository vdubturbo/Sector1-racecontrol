'use client';

import { useState } from 'react';

interface Props {
  onSignIn: (email: string, password: string) => Promise<string | null>;
}

export function SignInGate({ onSignIn }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await onSignIn(email, password);
    setSubmitting(false);
    if (result) setError(result);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm p-8 bg-bg-card border-2 border-[#999999] rounded-lg">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-text-primary tracking-tight">Sector1 Race Control</h1>
          <p className="text-[0.625rem] text-text-muted uppercase tracking-wider mt-1">Authorized users only</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {error && (
            <div className="text-[0.625rem] text-status-red bg-status-red/10 border border-status-red/20 rounded px-2 py-1.5">
              {error}
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-3 py-2 bg-bg-elevated border border-border-subtle rounded text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-orange"
            autoFocus
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-3 py-2 bg-bg-elevated border border-border-subtle rounded text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-orange"
            required
          />
          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="px-4 py-2 bg-accent-orange text-white text-sm font-semibold rounded hover:bg-accent-amber transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
