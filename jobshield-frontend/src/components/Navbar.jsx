import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Public Navbar Component
 * Interactive Demo Navigation for interviewers and visitors.
 * Features 1-click links to all key capabilities with zero login barriers.
 */
export default function Navbar({ theme }) {
  const location = useLocation();

  const currentTheme = theme || (location.pathname === '/' ? 'teal' : 'light');
  const isTeal = currentTheme === 'teal';

  const navLinks = [
    { to: '/analyze', label: '⚡ AI Scanner' },
    { to: '/scan-pdf', label: '📄 PDF Extraction' },
    { to: '/campaigns', label: '📍 Bengaluru Hotspots' },
    { to: '/history', label: '⏱️ Scan History' },
  ];

  return (
    <header className={`public-navbar ${isTeal ? 'navbar-teal' : 'navbar-light'}`}>
      <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className={`brand-icon ${isTeal ? 'brand-icon-white' : ''}`}>🛡️</div>
          <div className={`brand-text ${isTeal ? 'text-white' : ''}`}>
            Job<span>Shield</span>
          </div>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              background: isTeal ? 'rgba(255, 255, 255, 0.2)' : 'var(--color-teal-tint)',
              color: isTeal ? '#ffffff' : 'var(--color-brand)',
              border: isTeal ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid var(--color-teal-border)',
              padding: '0.2rem 0.55rem',
              borderRadius: '12px',
              marginLeft: '0.25rem',
            }}
          >
            DEMO
          </span>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  padding: '0.45rem 0.8rem',
                  borderRadius: '8px',
                  color: isTeal
                    ? (isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.9)')
                    : (isActive ? 'var(--color-brand)' : '#334155'),
                  background: isTeal
                    ? (isActive ? 'rgba(255, 255, 255, 0.22)' : 'transparent')
                    : (isActive ? '#f1f5f9' : 'transparent'),
                  transition: 'all 0.15s ease',
                }}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Highlighted Interviewer Hub CTA */}
          <Link
            to="/demo"
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              textDecoration: 'none',
              padding: '0.45rem 1.1rem',
              borderRadius: '20px',
              color: isTeal ? '#0f172a' : '#ffffff',
              background: isTeal ? '#ffffff' : 'var(--color-brand)',
              boxShadow: isTeal ? '0 2px 8px rgba(0,0,0,0.12)' : '0 2px 8px rgba(67, 97, 238, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'transform 0.15s ease',
            }}
          >
            <span>🚀</span>
            <span>Interviewer Hub</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
