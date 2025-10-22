import React from 'react';

function AppTest() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #dbeafe, #bfdbfe)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '48rem',
        width: '100%',
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ 
            fontSize: '2.25rem', 
            color: '#2563eb',
            marginBottom: '0.5rem',
            fontWeight: 'bold'
          }}>
            SupplyWise - Webpack Test
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Ultra-minimal test to diagnose webpack errors
          </p>
        </div>

        <div style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '0.375rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{ color: '#15803d', marginBottom: '0.5rem', fontSize: '1.125rem' }}>
            ✅ React is Running
          </h2>
          <p style={{ color: '#166534', fontSize: '0.875rem' }}>
            If you can see this page, React is rendering correctly.
          </p>
        </div>

        <div style={{
          background: '#eff6ff',
          border: '1px solid #93c5fd',
          borderRadius: '0.375rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{ color: '#1e40af', marginBottom: '0.5rem', fontSize: '1.125rem' }}>
            🔍 Check Console
          </h2>
          <p style={{ color: '#1e3a8a', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Open your browser console (F12) and check for errors.
          </p>
          <ul style={{ color: '#1e3a8a', fontSize: '0.875rem', marginLeft: '1.25rem' }}>
            <li><strong>If you see Figma webpack errors:</strong> They're from Figma's infrastructure, not your code</li>
            <li><strong>If you see no errors:</strong> The full app has something triggering webpack</li>
            <li><strong>If you see errors referencing App.tsx:</strong> There's a real issue to fix</li>
          </ul>
        </div>

        <div style={{
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '0.375rem',
          padding: '1rem'
        }}>
          <h2 style={{ color: '#92400e', marginBottom: '0.5rem', fontSize: '1.125rem' }}>
            📋 Test Results
          </h2>
          <p style={{ color: '#78350f', fontSize: '0.875rem' }}>
            This is an extremely minimal React component with:
          </p>
          <ul style={{ color: '#78350f', fontSize: '0.875rem', marginLeft: '1.25rem', marginTop: '0.5rem' }}>
            <li>No external dependencies (except React)</li>
            <li>No complex imports</li>
            <li>No Tailwind classes</li>
            <li>Just inline styles and basic HTML</li>
          </ul>
          <p style={{ color: '#78350f', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
            If webpack errors still appear with THIS simple component, they are 100% from Figma's infrastructure.
          </p>
        </div>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <h3 style={{ color: '#374151', marginBottom: '0.75rem' }}>
            Next Steps:
          </h3>
          <ol style={{ color: '#4b5563', fontSize: '0.875rem', marginLeft: '1.25rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Check the browser console right now
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Note if any webpack errors appear
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Read ERROR_QUICK_GUIDE.md for interpretation
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              To restore your full app: Rename App.tsx → App.test.tsx, then rename App.backup.tsx → App.tsx
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default AppTest;
