import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class LocalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LocalErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full p-6 bg-[var(--bg-card)] rounded-2xl border-2 border-[var(--red)] flex flex-col items-center justify-center text-center space-y-4">
          <AlertTriangle size={48} className="text-[var(--red)] mb-2" />
          <h2 className="text-xl font-black text-[var(--red)] uppercase tracking-tight">Something went wrong</h2>
          <p className="text-sm font-bold text-[var(--text-muted)]">
            We encountered an unexpected error loading this section.
          </p>
          <button
            onClick={this.handleReset}
            className="mt-4 px-6 py-2 bg-[var(--tint-red)] text-[var(--red)] font-bold rounded-xl hover:bg-[var(--red)] hover:text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
