import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  onBack: () => void;
  gameName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[GameErrorBoundary:${this.props.gameName}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
          <div className="w-16 h-16 rounded-full bg-red/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red" />
          </div>
          <h2 className="text-xl font-black text-text-main">Game Error</h2>
          <p className="text-sm font-bold text-text-muted text-center max-w-sm">
            {this.props.gameName} encountered an unexpected error.
          </p>
          {this.state.error && (
            <pre className="text-xs text-text-muted bg-gray-bg p-3 rounded-xl border border-gray-path max-w-md overflow-auto max-h-24">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onBack();
            }}
            className="btn-duo btn-blue px-6 py-3 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
