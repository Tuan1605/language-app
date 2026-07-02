import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically designed for async operations.
 * Catches both render errors and provides a retry mechanism.
 */
export class AsyncErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AsyncErrorBoundary]', error, errorInfo.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full p-8 bg-bg-card rounded-2xl border-2 border-red/30 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 bg-tint-red rounded-2xl flex items-center justify-center">
            <AlertTriangle size={28} className="text-red" />
          </div>
          <h3 className="text-lg font-black text-text-main">Something went wrong</h3>
          <p className="text-sm font-bold text-text-muted max-w-md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-tint-blue text-blue font-black text-sm rounded-xl hover:bg-blue hover:text-white transition-colors border-2 border-blue"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
