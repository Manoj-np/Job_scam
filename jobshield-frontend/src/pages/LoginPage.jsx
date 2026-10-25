import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authApi } from '../services/api';

/**
 * LoginPage Component
 * Handles user sign in and stores JWT token in localStorage.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(isExpired ? 'Your session has expired. Please sign in again.' : null);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);

    const demoCreds = {
      email: 'demo@jobshield.com',
      password: 'Password@123',
    };
    setCredentials(demoCreds);

    try {
      const loginRes = await authApi.login(demoCreds);
      if (!loginRes || !loginRes.token) {
        throw new Error('Authentication succeeded but no token received.');
      }
      try {
        await authApi.getProfile();
      } catch (profileErr) {
        console.warn('Profile prefetch error:', profileErr);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!credentials.email.trim() || !credentials.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate with backend
      const loginRes = await authApi.login({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (!loginRes || !loginRes.token) {
        throw new Error('Authentication succeeded but no token received.');
      }

      // 2. Fetch user profile
      try {
        await authApi.getProfile();
      } catch (profileErr) {
        console.warn('Profile prefetch error:', profileErr);
      }

      // 3. Navigate to protected dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access the JobShield portal</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          {/* Quick Demo Access Card for Interviewers / HR */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(99, 102, 241, 0.12))',
            border: '1.5px solid #93c5fd',
            borderRadius: '12px',
            padding: '1.1rem',
            marginBottom: '1.25rem',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                👔 Interviewer & HR Demo Access
              </span>
              <span style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.55rem', borderRadius: '12px', fontWeight: 700 }}>
                Instant Access
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#334155', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
              Reviewing this project? Click below to immediately sign in with pre-loaded scan records, AI assessments, and live metrics.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                fontWeight: 700,
                padding: '0.65rem',
                fontSize: '0.9rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>⚡ 1-Click Interviewer Demo Login</span>
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
              <span>Email: <code style={{ color: 'var(--color-lavender)' }}>demo@jobshield.com</code></span>
              <span>Password: <code style={{ color: 'var(--color-lavender)' }}>Password@123</code></span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={credentials.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-input"
                placeholder="Your password"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.8rem' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
