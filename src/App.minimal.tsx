import React from 'react';

// Minimal test app to isolate webpack issues
function MinimalApp() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl text-blue-600 mb-4">SupplyWise - Minimal Test</h1>
        <p className="text-gray-700 mb-4">
          This is a minimal version of the app to test if webpack errors persist.
        </p>
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="text-green-800">✅ If you can see this, React is rendering correctly.</p>
        </div>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-blue-800">Check the browser console for any errors.</p>
        </div>
      </div>
    </div>
  );
}

export default MinimalApp;
