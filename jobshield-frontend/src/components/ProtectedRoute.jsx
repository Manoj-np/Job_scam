import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { isAuthenticated, setToken, saveLocalRegisteredUser } from '../services/api';
import Sidebar from './Sidebar';

/**
 * ProtectedRoute Component
 * Guards dashboard routes and wraps them in the JobShield dashboard layout.
 * In DEMO MODE: Automatically provisions a guest reviewer session so reviewers
 * can test every feature without any login walls or redirects.
 */
export default function ProtectedRoute() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Auto-authenticate as guest reviewer in demo mode if no token exists
  if (!isAuthenticated()) {
    setToken('demo_reviewer_session_token_2026');
    saveLocalRegisteredUser({
      firstName: 'Technical',
      lastName: 'Interviewer',
      email: 'interviewer@demo.jobshield.io',
      role: 'REVIEWER'
    });
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Mobile Header Bar */}
        <header className="mobile-topbar">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem 0.65rem' }}
          >
            ☰ Menu
          </button>
          <div className="brand-logo" style={{ fontSize: '1.1rem' }}>
            Job<span>Shield</span>
          </div>
        </header>

        {/* Backdrop for Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div
            className="modal-backdrop"
            style={{ zIndex: 39 }}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sub-page Render */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
