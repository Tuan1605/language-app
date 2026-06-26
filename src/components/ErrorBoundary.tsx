import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches render errors anywhere in the child tree so the whole app doesn't
 * crash to a white screen.  Displays a recovery UI with a reload button.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg-main text-text-main p-8 gap-6">
          <div className="text-6xl">😵</div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Something went wrong</h1>
          <p className="text-sm font-bold text-text-muted text-center max-w-md">
            An unexpected error crashed this view. This has been logged to the console.
          </p>
          {this.state.error && (
            <pre className="text-xs text-text-muted bg-gray-bg p-4 rounded-2xl border-2 border-gray-path max-w-lg overflow-auto max-h-40">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="btn-duo btn-blue h-14 px-10 mt-4"
          >
            RELOAD APP
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
