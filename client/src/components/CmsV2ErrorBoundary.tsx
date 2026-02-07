import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class CmsV2ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[CMS v2] Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center bg-slate-900 p-8">
          <div className="max-w-md text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-xl font-semibold text-white">
              Something went wrong
            </h2>
            <p className="text-slate-400 text-sm">
              The CMS v2 module encountered an error. Check the browser console for details.
            </p>
            <pre className="text-xs text-red-400 bg-slate-800 rounded p-3 text-left overflow-auto max-h-40">
              {this.state.error?.message}
            </pre>
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false, error: null })}
              data-testid="button-cms-v2-retry"
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
