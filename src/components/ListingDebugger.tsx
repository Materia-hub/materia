import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Listing } from './data/mockData';
import { api } from '../utils/api';

interface ListingDebuggerProps {
  listings: Listing[];
  currentUserId?: string;
  onRefresh?: () => void;
}

export default function ListingDebugger({ listings, currentUserId, onRefresh }: ListingDebuggerProps) {
  const [backendCheck, setBackendCheck] = useState<string>('');
  const myListings = listings.filter(l => l.sellerId === currentUserId);
  
  const checkBackend = async () => {
    try {
      setBackendCheck('Checking...');
      const response = await api.getListings();
      const count = response.listings?.length || 0;
      setBackendCheck(`✅ Backend has ${count} listings`);
      console.log('🔍 Backend direct check:', response.listings);
    } catch (error: any) {
      setBackendCheck(`❌ Error: ${error.message}`);
      console.error('Backend check failed:', error);
    }
  };
  
  return (
    <Card className="p-4 bg-yellow-50 border-yellow-200">
      <h3 className="font-bold text-yellow-900 mb-2">🐛 Debug Info</h3>
      <div className="space-y-2 text-sm">
        <div className="flex gap-2 mb-3">
          <Button onClick={checkBackend} size="sm" variant="outline">
            Check Backend Directly
          </Button>
          {onRefresh && (
            <Button onClick={onRefresh} size="sm" variant="outline">
              Refresh Listings
            </Button>
          )}
        </div>
        {backendCheck && (
          <div className="p-2 bg-white rounded border border-yellow-300">
            {backendCheck}
          </div>
        )}
        <div>
          <strong>Current User ID:</strong> <code className="bg-yellow-100 px-1 rounded">{currentUserId || 'Not logged in'}</code>
        </div>
        <div>
          <strong>Total Listings in State:</strong> {listings.length}
        </div>
        <div>
          <strong>My Listings:</strong> {myListings.length}
        </div>
        
        {listings.length > 0 && (
          <div className="mt-3">
            <strong>All Listings:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {listings.map(l => (
                <li key={l.id} className={l.sellerId === currentUserId ? 'text-green-700 font-bold' : 'text-gray-600'}>
                  <code className="text-xs">{l.id.substring(0, 8)}</code> - {l.title.substring(0, 30)}...
                  <br />
                  <span className="ml-6 text-xs">Seller ID: <code>{l.sellerId}</code></span>
                  <br />
                  <span className="ml-6 text-xs">Posted: {l.postedDate || 'N/A'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {listings.length === 0 && (
          <div className="text-red-600 mt-2">
            ⚠️ No listings in state! Check if loadListings() is being called and backend is returning data.
          </div>
        )}
      </div>
    </Card>
  );
}
