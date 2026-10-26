import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, authApi } from '../services/api';

/**
 * Public Navbar Component
 * Minimal header with Brand Logo on left and [Login] [Register] at the end.
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
              <Link to="/login" className={`btn btn-sm ${isTeal ? 'btn-outline-white' : 'btn-secondary'}`}>
                Login
              </Link>
              <Link to="/register" className={`btn btn-sm ${isTeal ? 'btn-white-hero' : 'btn-navy'}`}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
