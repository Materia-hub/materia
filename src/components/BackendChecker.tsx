import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function BackendChecker() {
  const [status, setStatus] = useState<string>('');
  const [listingsCount, setListingsCount] = useState<string>('');
  const [autoCheckDone, setAutoCheckDone] = useState(false);
  const [backendVersion, setBackendVersion] = useState<string>('');

  const checkHealth = async () => {
    try {
      setStatus('Checking backend health...');
      const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8ae6fee0`;
      
      const response = await fetch(`${BASE_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const version = data.version || 'unknown';
        setBackendVersion(version);
        
        if (version === '2.0.0-kv-fix') {
          setStatus(`✅ Backend is UP-TO-DATE (${version})`);
        } else {
          setStatus(`⚠️ Backend is OUTDATED (${version}) - Expected: 2.0.0-kv-fix`);
        }
      } else {
        setStatus(`❌ Backend returned ${response.status}: ${response.statusText}`);
        setBackendVersion('error');
      }
    } catch (error: any) {
      setStatus(`❌ Backend is OFFLINE: ${error.message}`);
      setBackendVersion('offline');
    }
  };

  // Auto-check on mount
  useEffect(() => {
    if (!autoCheckDone) {
      checkHealth();
      setAutoCheckDone(true);
    }
  }, [autoCheckDone]);

  const checkListings = async () => {
    try {
      setListingsCount('Fetching listings...');
      const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8ae6fee0`;
      
      const response = await fetch(`${BASE_URL}/listings`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const count = data.listings?.length || 0;
        setListingsCount(`✅ Backend has ${count} listings`);
        console.log('🔍 All listings from backend:', data.listings);
      } else {
        const text = await response.text();
        setListingsCount(`❌ Error ${response.status}: ${text}`);
      }
    } catch (error: any) {
      setListingsCount(`❌ Failed: ${error.message}`);
    }
  };

  const testCreateListing = async () => {
    try {
      setListingsCount('Creating test listing...');
      const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8ae6fee0`;
      
      const testListing = {
        title: 'TEST LISTING - Please Delete',
        description: 'This is a test listing created by the backend checker',
        category: 'Wood',
        quantity: '1',
        condition: 'Good',
        price: 10,
        pricingType: 'per-item',
        images: ['https://images.unsplash.com/photo-1632778187753-11e0e4e19c7c'],
        location: 'Test City, Test State',
        sellerId: 'test-user-id',
        sellerName: 'Test User',
        sellerType: 'individual',
        verified: false,
        views: 0,
        postedDate: new Date().toISOString(),
      };
      
      console.log('📤 Sending test listing:', testListing);
      
      const response = await fetch(`${BASE_URL}/listings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listing: testListing }),
      });
      
      const responseText = await response.text();
      console.log('📥 Backend response:', responseText);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        setListingsCount(`✅ Test listing created! ID: ${data.listing?.id}`);
      } else {
        setListingsCount(`❌ Create failed (${response.status}): ${responseText}`);
      }
    } catch (error: any) {
      setListingsCount(`❌ Failed: ${error.message}`);
      console.error('Test create error:', error);
    }
  };

  const getStatusBadge = () => {
    if (!backendVersion) return null;
    
    if (backendVersion === '2.0.0-kv-fix') {
      return <Badge className="bg-green-500">✅ Up-to-Date</Badge>;
    } else if (backendVersion === 'offline') {
      return <Badge variant="destructive">❌ Offline</Badge>;
    } else if (backendVersion === 'error') {
      return <Badge variant="destructive">❌ Error</Badge>;
    } else {
      return <Badge className="bg-orange-500">⚠️ Needs Update</Badge>;
    }
  };

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-blue-900">🔧 Backend Diagnostics</h3>
        {getStatusBadge()}
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={checkHealth} size="sm" variant="outline">
            Check Backend Health
          </Button>
          <Button onClick={checkListings} size="sm" variant="outline">
            Check Listings
          </Button>
          <Button onClick={testCreateListing} size="sm" variant="outline" className="bg-green-100">
            Create Test Listing
          </Button>
        </div>
        
        {status && (
          <div className="p-2 bg-white rounded border text-sm">
            <strong>Health:</strong> {status}
          </div>
        )}
        
        {listingsCount && (
          <div className="p-2 bg-white rounded border text-sm">
            <strong>Listings:</strong> {listingsCount}
          </div>
        )}
        
        <div className="text-xs text-gray-600 mt-2">
          <p><strong>Backend URL:</strong> {`https://${projectId}.supabase.co/functions/v1/make-server-8ae6fee0`}</p>
        </div>
      </div>
    </Card>
  );
}
