import React from 'react';

/**
 * LoadingSpinner Component
 * Reusable loading indicator with customizable message.
 */
export default function LoadingSpinner({ message = 'Loading...', isDark = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', gap: '0.85rem' }}>
      <div className={`spinner ${isDark ? 'spinner-dark' : ''}`} style={{ width: '2rem', height: '2rem', borderWidth: '3px' }}></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>{message}</p>
    </div>
  );
}
