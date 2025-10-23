import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('%c❌ REACT ERROR CAUGHT BY ERROR BOUNDARY', 'color: #dc2626; font-weight: bold; font-size: 14px;');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.log('%c⚠️ This is a REAL error in your React code (not a Figma error)', 'color: #ea580c; font-weight: bold;');
    
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              
              <h1 className="text-2xl text-red-900 mb-2">Oops! Something went wrong</h1>
              <p className="text-gray-600 mb-6">
                We're sorry, but an unexpected error occurred. This has been logged and we'll look into it.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Error:</strong>
                </p>
                <p className="text-sm text-red-600 font-mono">
                  {this.state.error?.toString()}
                </p>
                
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-sm cursor-pointer text-gray-600 hover:text-gray-800">
                      Show technical details
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-64">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Reload Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.clear();
                    this.handleReset();
                  }}
                >
                  Clear Cache & Reload
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                If this problem persists, please contact support with the error details above.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
