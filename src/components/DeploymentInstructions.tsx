import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, Terminal, CheckCircle } from 'lucide-react';

export default function DeploymentInstructions() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="p-4 bg-orange-50 border-orange-300 border-2">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
            ⚠️ Backend Needs Deployment
            <Button 
              onClick={() => setIsExpanded(!isExpanded)} 
              variant="ghost" 
              size="sm"
              className="ml-auto"
            >
              {isExpanded ? 'Hide' : 'Show'} Instructions
            </Button>
          </h3>
          
          {isExpanded && (
            <div className="space-y-3 text-sm">
              <p className="text-orange-800">
                The backend code has been updated with a critical bug fix. You need to deploy it for listings to work.
              </p>
              
              <div className="bg-white p-3 rounded border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4" />
                  <strong>Deployment Commands:</strong>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Linux/Mac:</p>
                    <code className="block bg-gray-900 text-green-400 p-2 rounded text-xs">
                      ./deploy-backend.sh
                    </code>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Windows or Manual:</p>
                    <code className="block bg-gray-900 text-green-400 p-2 rounded text-xs">
                      cd supabase/functions<br/>
                      supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
                    </code>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <strong className="text-blue-900">After Deployment:</strong>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-xs text-blue-800 ml-4">
                  <li>Click "Check Backend Health" above</li>
                  <li>Version should show "2.0.0-kv-fix"</li>
                  <li>Create a new listing</li>
                  <li>It should appear in your Dashboard</li>
                </ol>
              </div>
              
              <div className="text-xs text-gray-600 mt-2">
                <strong>The Bug Fixed:</strong> The KV store's <code>getByPrefix()</code> returns values only, 
                but the backend was expecting objects with keys. This is now fixed.
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
