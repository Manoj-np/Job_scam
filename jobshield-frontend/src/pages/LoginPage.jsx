import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authApi } from '../services/api';

/**
 * LoginPage Component
 * Handles user sign in, stores session, and provides 1-click recruiter/interviewer demo access.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isExpired = searchParams.get('expired') === 'true';
  const isRegistered = searchParams.get('registered') === 'true';
  const initialEmail = searchParams.get('email') || '';

  const [credentials, setCredentials] = useState({
    email: initialEmail,
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(isExpired ? 'Your session has expired. Please sign in again.' : null);
  const [success, setSuccess] = useState(isRegistered ? '✓ Account created successfully! Please sign in below.' : null);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!credentials.email.trim() || !credentials.password) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate (backend with resilient local fallback)
      const loginRes = await authApi.login({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (!loginRes || !loginRes.token) {
        throw new Error('Authentication succeeded but no token received.');
      }

      // 2. Sync profile
      try {
        await authApi.getProfile();
      } catch (profileErr) {
        console.warn('Profile sync:', profileErr);
      }

      // 3. Navigate to protected job verification tool
      navigate('/analyze');
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
          {success && <div className="alert alert-success">{success}</div>}

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: 0
                  }}
                >
                  {showPassword ? '🙈 Hide' : '👁️ Show'}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
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
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.8rem', fontWeight: 700 }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Sign In →'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 700 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
