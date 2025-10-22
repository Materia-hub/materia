import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DiagnosticCheck {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export default function Diagnostics() {
  const [checks, setChecks] = useState<DiagnosticCheck[]>([]);
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const results: DiagnosticCheck[] = [];

    // Check 1: Supabase Configuration
    results.push({
      name: 'Supabase Configuration',
      status: projectId && publicAnonKey ? 'success' : 'error',
      message: projectId && publicAnonKey ? 'Configuration loaded' : 'Missing configuration',
      details: `Project ID: ${projectId?.substring(0, 8)}...`,
    });

    // Check 2: Supabase Connection
    try {
      const { data, error } = await supabase.auth.getSession();
      results.push({
        name: 'Supabase Connection',
        status: error ? 'error' : 'success',
        message: error ? 'Connection failed' : 'Connection successful',
        details: error ? error.message : 'Auth API responding',
      });
    } catch (error: any) {
      results.push({
        name: 'Supabase Connection',
        status: 'error',
        message: 'Connection failed',
        details: error.message,
      });
    }

    // Check 3: Server Health
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8ae6fee0/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (response.ok) {
        results.push({
          name: 'Backend Server',
          status: 'success',
          message: 'Server is online',
          details: 'Health check passed',
        });
      } else {
        results.push({
          name: 'Backend Server',
          status: 'error',
          message: `Server returned ${response.status}`,
          details: response.statusText,
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Backend Server',
        status: 'error',
        message: 'Server is offline or unreachable',
        details: error.message,
      });
    }

    // Check 4: LocalStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      results.push({
        name: 'LocalStorage',
        status: 'success',
        message: 'Working correctly',
        details: 'Can read and write',
      });
    } catch (error: any) {
      results.push({
        name: 'LocalStorage',
        status: 'warning',
        message: 'May be disabled',
        details: error.message,
      });
    }

    // Check 5: Browser Compatibility
    const isCompatible = 
      typeof window !== 'undefined' &&
      typeof localStorage !== 'undefined' &&
      typeof fetch !== 'undefined';
    
    results.push({
      name: 'Browser Compatibility',
      status: isCompatible ? 'success' : 'error',
      message: isCompatible ? 'Browser is compatible' : 'Browser may not be compatible',
      details: `User Agent: ${navigator.userAgent.substring(0, 50)}...`,
    });

    setChecks(results);
    setTesting(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700 border-0">OK</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 border-0">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700 border-0">Warning</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-0">Testing...</Badge>;
    }
  };

  const hasErrors = checks.some(c => c.status === 'error');
  const allPassed = checks.length > 0 && checks.every(c => c.status === 'success');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl text-blue-900 mb-2">System Diagnostics</h1>
        <p className="text-gray-600">
          Check system health and troubleshoot connection issues
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl text-blue-900 mb-1">Diagnostic Tests</h2>
            <p className="text-sm text-gray-600">
              {testing ? 'Running tests...' : `${checks.length} checks completed`}
            </p>
          </div>
          <Button
            onClick={runDiagnostics}
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
            Run Tests
          </Button>
        </div>

        {/* Overall Status */}
        {checks.length > 0 && (
          <div className={`p-4 rounded-lg mb-6 ${
            allPassed ? 'bg-green-50 border border-green-200' :
            hasErrors ? 'bg-red-50 border border-red-200' :
            'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center gap-3">
              {allPassed ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : hasErrors ? (
                <XCircle className="w-6 h-6 text-red-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
              <div>
                <p className={`font-medium ${
                  allPassed ? 'text-green-900' :
                  hasErrors ? 'text-red-900' :
                  'text-yellow-900'
                }`}>
                  {allPassed ? 'All systems operational' :
                   hasErrors ? 'Issues detected' :
                   'Some warnings detected'}
                </p>
                <p className={`text-sm ${
                  allPassed ? 'text-green-700' :
                  hasErrors ? 'text-red-700' :
                  'text-yellow-700'
                }`}>
                  {allPassed ? <><span className="materia-brand">Materia</span> is ready to use</> :
                   hasErrors ? 'Please check the errors below' :
                   'App should work but check warnings'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Individual Checks */}
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white"
            >
              <div className="mt-0.5">
                {getStatusIcon(check.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm text-gray-900">{check.name}</h3>
                  {getStatusBadge(check.status)}
                </div>
                <p className="text-sm text-gray-600 mb-1">{check.message}</p>
                {check.details && (
                  <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                    {check.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Console Check */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-sm text-blue-900 mb-2">💡 Debugging Tip</h3>
        <p className="text-sm text-blue-700">
          Open your browser console (F12 or Cmd+Option+I) to see detailed logs. 
          Look for messages starting with 🚀, ✅, or ❌ for helpful debugging information.
        </p>
      </Card>
    </div>
  );
}
