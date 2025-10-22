import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ErrorLog {
  message: string;
  source: string;
  isFigmaError: boolean;
  timestamp: Date;
}

/**
 * ErrorDetector Component
 * 
 * This component monitors console errors and helps distinguish between:
 * - Figma's internal webpack/devtools errors (safe to ignore)
 * - Real application errors (need fixing)
 */
export default function ErrorDetector() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [appErrors, setAppErrors] = useState<ErrorLog[]>([]);
  const [figmaErrors, setFigmaErrors] = useState<ErrorLog[]>([]);

  useEffect(() => {
    // Store original console.error
    const originalError = console.error;

    // Override console.error to capture errors
    console.error = function(...args: any[]) {
      // Call original first
      originalError.apply(console, args);

      // Analyze the error
      const errorMessage = args.join(' ');
      const stackTrace = new Error().stack || '';
      
      // Check if it's a Figma webpack error
      const isFigmaError = 
        errorMessage.includes('figma.com') ||
        errorMessage.includes('webpack-artifacts') ||
        errorMessage.includes('devtools_worker') ||
        stackTrace.includes('figma.com/webpack-artifacts');

      const errorLog: ErrorLog = {
        message: errorMessage,
        source: isFigmaError ? 'Figma DevTools' : 'Your Application',
        isFigmaError,
        timestamp: new Date(),
      };

      setErrors(prev => [...prev, errorLog]);
      
      if (isFigmaError) {
        setFigmaErrors(prev => [...prev, errorLog]);
      } else {
        setAppErrors(prev => [...prev, errorLog]);
      }
    };

    // Log initialization
    console.log('%c🔍 Error Detector Active', 'color: #059669; font-weight: bold;');
    console.log('%c   Monitoring for real application errors...', 'color: #059669;');
    console.log('%c   Figma webpack errors will be identified and filtered', 'color: #6b7280;');

    // Cleanup
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-auto">
      <Card className="p-4 bg-white shadow-xl border-2">
        <div className="mb-3">
          <h3 className="text-lg mb-1">🔍 Error Detector</h3>
          <p className="text-xs text-gray-600">
            Monitoring console for application errors
          </p>
        </div>

        {/* Status Summary */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            {appErrors.length === 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-700">No app errors detected</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-700">{appErrors.length} app error(s) found</span>
              </>
            )}
          </div>

          {figmaErrors.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                {figmaErrors.length} Figma error(s) (safe to ignore)
              </span>
            </div>
          )}
        </div>

        {/* Real App Errors */}
        {appErrors.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm text-red-700 mb-2">⚠️ Application Errors (Fix These):</h4>
            <div className="space-y-2 max-h-40 overflow-auto">
              {appErrors.map((error, idx) => (
                <div key={idx} className="bg-red-50 border border-red-200 rounded p-2 text-xs">
                  <div className="text-red-800 break-words">
                    {error.message.substring(0, 200)}
                    {error.message.length > 200 && '...'}
                  </div>
                  <div className="text-gray-500 mt-1">
                    {error.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Figma Errors */}
        {figmaErrors.length > 0 && (
          <div>
            <h4 className="text-sm text-gray-600 mb-2">
              ℹ️ Figma Webpack Errors (Ignore):
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-600">
              {figmaErrors.length} Figma internal error(s) detected
              <div className="mt-1 text-gray-500">
                These are from Figma's development tools, not your code.
              </div>
            </div>
          </div>
        )}

        {/* No Errors */}
        {errors.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>All clear! No errors detected.</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Your app is running cleanly.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 <strong>How to use:</strong> This widget monitors console.error() 
            and distinguishes between Figma's internal errors and your app's errors.
          </p>
        </div>
      </Card>
    </div>
  );
}
