import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Public Navbar Component
 * Minimal header with Brand Logo on left and [Login] [Register] at the end.
 * Per user requirement: ONLY Login and Register in place of Logout, and remove Logout.
 */
export default function Navbar({ theme }) {
  const location = useLocation();

  // If theme is not explicitly passed, use 'teal' for landing page ('/') and 'light' elsewhere
  const currentTheme = theme || (location.pathname === '/' ? 'teal' : 'light');
  const isTeal = currentTheme === 'teal';

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
          <Link to="/login" className={`btn btn-sm ${isTeal ? 'btn-outline-white' : 'btn-secondary'}`}>
            Login
          </Link>
          <Link to="/register" className={`btn btn-sm ${isTeal ? 'btn-white-hero' : 'btn-navy'}`}>
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
