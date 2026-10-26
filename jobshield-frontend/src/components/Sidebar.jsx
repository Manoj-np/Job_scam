import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { authApi, getSavedUser } from '../services/api';

/**
 * Sidebar Component for Protected App Layout
 * Shows user profile badge and quick access to [Login] and [Register].
 * Per user instruction: replaced logout with Login and Register, removed logout.
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
    { to: '/history', label: 'Scan History', icon: '⏱️' },
    { to: '/campaigns', label: 'Scam Campaigns', icon: '🕸️' },
  ];

  const userInitials = profile
    ? `${(profile.firstName || 'U')[0]}${(profile.lastName || '')[0] || ''}`.toUpperCase()
    : 'JS';

  return (
    <aside className={`app-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/analyze" className="brand-logo" onClick={onClose}>
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
          <div className="user-avatar">{userInitials}</div>
          <div className="user-info-text">
            <div className="user-name">
              {profile ? `${profile.firstName} ${profile.lastName}` : 'Shield Member'}
            </div>
            <div className="user-role">
              {profile?.role ? `ROLE: ${profile.role}` : profile?.email || 'Authenticated'}
            </div>
          </div>
        </div>

        {/* In place of logout: Login and Register */}
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.75rem' }}>
          <NavLink
            to="/login"
            className="btn btn-sm btn-secondary"
            style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', padding: '0.45rem 0.5rem' }}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="btn btn-sm btn-primary"
            style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', padding: '0.45rem 0.5rem' }}
          >
            Register
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
