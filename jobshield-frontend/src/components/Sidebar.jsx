import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { authApi, getSavedUser } from '../services/api';

/**
 * Sidebar Component for Protected App Layout
 * Provides clear 1-click navigation across all demo features.
 */
export default function Sidebar({ isOpen, onClose }) {
  const [profile, setProfile] = useState(getSavedUser());

  useEffect(() => {
    let isMounted = true;
    authApi.getProfile()
      .then((data) => {
        if (isMounted) setProfile(data);
      })
      .catch((err) => {
        console.warn('Could not fetch user profile:', err.message);
      });
    return () => { isMounted = false; };
  }, []);

  const navItems = [
    { to: '/analyze', label: 'Analyze Job', icon: '🔍' },
    { to: '/scan-pdf', label: 'Scan PDF Offer', icon: '📄' },
    { to: '/campaigns', label: 'Scam Hotspots', icon: '📍' },
    { to: '/history', label: 'Scan History', icon: '⏱️' },
    { to: '/demo', label: 'Interviewer Hub', icon: '🚀' },
  ];

  return (
    <aside className={`app-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="brand-logo" onClick={onClose} style={{ textDecoration: 'none' }}>
          <div className="brand-icon">🛡️</div>
          <div className="brand-text">Job<span>Shield</span></div>
        </NavLink>
        {onClose && (
          <button 
            onClick={onClose} 
            className="btn btn-sm" 
            style={{ color: '#94a3b8', display: isOpen ? 'block' : 'none' }}
          >
            ✕
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar" style={{ background: '#3b82f6', color: '#fff' }}>👔</div>
          <div className="user-info-text">
            <div className="user-name">
              {profile ? `${profile.firstName} ${profile.lastName}` : 'Technical Interviewer'}
            </div>
            <div className="user-role" style={{ color: '#10b981', fontWeight: 700 }}>
              🟢 DEMO REVIEWER
            </div>
          </div>
        </div>

        <div style={{ marginTop: '0.85rem' }}>
          <Link
            to="/demo"
            className="btn btn-sm btn-primary"
            style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem', padding: '0.5rem', fontWeight: 700, display: 'block' }}
          >
            🚀 Open Interviewer Hub
          </Link>
        </div>
      </div>
    </aside>
  );
}
