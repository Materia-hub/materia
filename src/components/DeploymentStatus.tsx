import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function DeploymentStatus() {
  const [status, setStatus] = useState<'checking' | 'updated' | 'outdated' | 'offline'>('checking');
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    checkVersion();
  }, []);

  const checkVersion = async () => {
    try {
      const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8ae6fee0`;
      const response = await fetch(`${BASE_URL}/health`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });

      if (response.ok) {
        const data = await response.json();
        const ver = data.version || 'unknown';
        setVersion(ver);
        setStatus(ver === '2.1.0-distance-filter' || ver === '2.0.0-kv-fix' ? 'updated' : 'outdated');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      setStatus('offline');
    }
  };

  if (status === 'checking') {
    return null; // Don't show anything while checking
  }

  if (status === 'updated') {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
        <CheckCircle className="w-4 h-4" />
        <span>Backend: Up-to-date</span>
      </div>
    );
  }

  if (status === 'outdated') {
    return (
      <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-200">
        <AlertCircle className="w-4 h-4" />
        <span>Backend: Needs deployment (v{version})</span>
      </div>
    );
  }

  // status === 'offline'
  return (
    <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-1.5 rounded-md border border-red-200">
      <XCircle className="w-4 h-4" />
      <span>Backend: Offline</span>
    </div>
  );
}
