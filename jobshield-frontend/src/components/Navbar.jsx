import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, authApi } from '../services/api';

/**
 * Public Navbar Component
 * SEON-style Cyber Fraud Prevention Navigation
 */
export default function Navbar({ theme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isAuthenticated();

  // If theme is not explicitly passed, use 'teal' for landing page ('/') and 'light' elsewhere
  const currentTheme = theme || (location.pathname === '/' ? 'teal' : 'light');
  const isTeal = currentTheme === 'teal';

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <header className={`public-navbar ${isTeal ? 'navbar-teal' : 'navbar-light'}`}>
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <div className={`brand-icon ${isTeal ? 'brand-icon-white' : ''}`}>🛡️</div>
          <div className={`brand-text ${isTeal ? 'text-white' : ''}`}>
            Job<span>Shield</span>
          </div>
        </Link>

        <div className="nav-center-links">
          <Link to="/analyze" className={isTeal ? 'nav-link-teal' : 'nav-link-light'}>
            Verify Job
          </Link>
          <Link to="/scan-pdf" className={isTeal ? 'nav-link-teal' : 'nav-link-light'}>
            PDF Forensics
          </Link>
          <Link to="/campaigns" className={isTeal ? 'nav-link-teal' : 'nav-link-light'}>
            Scam Syndicates
          </Link>
          <Link
            to="/demo"
            className={`nav-recruiter-pill ${isTeal ? 'pill-teal' : 'pill-light'}`}
          >
            👔 Recruiter Hub
          </Link>
        </div>

        <nav className="nav-links">
          {loggedIn ? (
            <>
              <Link to="/dashboard" className={`btn btn-sm ${isTeal ? 'btn-white-hero' : 'btn-navy'}`}>
                <span>Dashboard →</span>
              </Link>
              <button onClick={handleLogout} className={`btn btn-sm ${isTeal ? 'btn-outline-white' : 'btn-secondary'}`}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-login-link ${isTeal ? 'text-white' : ''}`}>
                Login
              </Link>
              <Link to="/register" className={`btn btn-sm ${isTeal ? 'btn-white-hero' : 'btn-navy'}`}>
                Speak with an expert
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
