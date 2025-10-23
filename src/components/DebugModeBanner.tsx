import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { DEBUG_MODE } from '../utils/config';

export default function DebugModeBanner() {
  const [dismissed, setDismissed] = React.useState(false);

  if (!DEBUG_MODE || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm">
            <strong>Debug Mode Active:</strong> Debug tools are visible to all users. 
            Set <code className="bg-white/20 px-1.5 py-0.5 rounded text-xs">DEBUG_MODE = false</code> in <code className="bg-white/20 px-1.5 py-0.5 rounded text-xs">/utils/config.ts</code> before production deployment.
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white hover:bg-white/20 rounded p-1 transition-colors"
          aria-label="Dismiss warning"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
