'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  slotLabel: string;
}

interface State {
  error: Error | null;
}

/**
 * Per-slot error boundary so a crash in one quadrant doesn't blow up the
 * whole main view.
 */
export class QuadErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(`[QuadView] ${this.props.slotLabel} crashed:`, error);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-status-red">
            View crashed
          </div>
          <div className="text-[0.625rem] text-text-muted max-w-full break-all">
            {this.state.error.message}
          </div>
          <button
            onClick={this.reset}
            className="mt-2 px-3 py-1 text-[0.625rem] uppercase tracking-wider text-text-secondary border border-border-default rounded hover:border-accent-orange hover:text-accent-orange transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
