import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, authApi } from '../services/api';

/**
 * Public Navbar Component
 */
export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const [loggingIn, setLoggingIn] = React.useState(false);

  const handleInstantDemoLogin = async () => {
    try {
      setLoggingIn(true);
      await authApi.login({
        email: 'demo@jobshield.com',
        password: 'Password@123',
      });
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <header className="public-navbar">
      <Link to="/" className="brand-logo">
        <div className="brand-icon">🛡️</div>
        <div className="brand-text">Job<span>Shield</span></div>
      </Link>

      <nav className="nav-links">
        {loggedIn ? (
          <>
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              <span>Dashboard</span>
              <span>→</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleInstantDemoLogin}
              disabled={loggingIn}
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>⚡</span>
              <span>{loggingIn ? 'Signing in...' : '1-Click Recruiter Demo'}</span>
            </button>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
