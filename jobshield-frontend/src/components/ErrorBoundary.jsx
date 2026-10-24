import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('JobShield ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: '#f8fafc',
          padding: '2rem',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '520px',
            background: '#1e293b',
            padding: '2.5rem',
            borderRadius: '16px',
            border: '1px solid #334155',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              JobShield encountered an unexpected display issue. Don't worry, your data and the backend are safe.
            </p>
            {this.state.error && (
              <pre style={{
                background: '#0f172a',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#f87171',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.5rem'
              }}>
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              🔄 Reload JobShield
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
