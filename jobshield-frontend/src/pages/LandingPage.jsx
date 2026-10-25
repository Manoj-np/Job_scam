import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { isAuthenticated } from '../services/api';

/**
 * LandingPage Component
 * Clean, production-ready public introduction for JobShield users.
 */
export default function LandingPage() {
  const loggedIn = isAuthenticated();
  const ctaLink = loggedIn ? '/dashboard' : '/register';

  return (
    <div>
      <Navbar />

      {/* Hero Section: How It Works */}
      <section className="hero-section" style={{ paddingBottom: '3.5rem' }}>
        <div className="hero-badge">
          <span>⚡</span>
          <span>Verification Pipeline</span>
        </div>

        <h1 className="hero-title">
          How It Works
        </h1>

        <p className="hero-subtitle">
          Three simple steps to verify any job posting or offer letter before taking action.
        </p>

        {/* Three Steps Grid */}
        <div className="steps-grid" style={{ maxWidth: '1050px', margin: '2.5rem auto 2rem', textAlign: 'left' }}>
          <div className="step-card" style={{ color: '#0f172a' }}>
            <div className="step-num">1</div>
            <h3 style={{ color: '#0f172a' }}>Submit Job Details or PDF</h3>
            <p style={{ color: '#475569' }}>
              Paste the job posting description, company name, and salary, or directly upload an offer letter PDF.
            </p>
          </div>

          <div className="step-card" style={{ color: '#0f172a' }}>
            <div className="step-num">2</div>
            <h3 style={{ color: '#0f172a' }}>AI & Pattern Analysis</h3>
            <p style={{ color: '#475569' }}>
              The Spring Boot backend runs Gemini AI analysis and checks scam similarity against known fraud databases.
            </p>
          </div>

          <div className="step-card" style={{ color: '#0f172a' }}>
            <div className="step-num">3</div>
            <h3 style={{ color: '#0f172a' }}>View Risk Score & Signals</h3>
            <p style={{ color: '#475569' }}>
              Get an instant Risk Score (0–100), risk tier (LOW/MEDIUM/HIGH), detailed reason, and syndicate alert.
            </p>
          </div>
        </div>

        <div className="hero-actions" style={{ marginTop: '1.5rem' }}>
          <Link to={ctaLink} className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
            <span>🛡️ Start Free Scam Check</span>
          </Link>
          <Link to="/analyze" className="btn btn-secondary btn-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
            <span>🔍 Analyze a Posting</span>
          </Link>
        </div>

        {/* Tech Stack Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '2.5rem' }}>
          {['Java 17', 'Spring Boot 4', 'React 19', 'Google Gemini AI', 'MySQL 8 (Aiven)', 'Spring Security JWT', 'Apache PDFBox'].map((tech) => (
            <span key={tech} style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 600
            }}>
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Comprehensive Scam Defense Engine</h2>
          <p className="section-desc">
            JobShield analyzes text, documents, and network patterns to give you instant clarity on whether an opportunity is authentic or a dangerous trap.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">🤖</div>
            <h3>AI Scam Detection</h3>
            <p>
              Deep semantic evaluation powered by Google Gemini AI to analyze job descriptions, pinpoint suspicious wording, unrealistic salaries, and recruiter red flags.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">📄</div>
            <h3>PDF Offer Letter Scanner</h3>
            <p>
              Upload suspicious appointment letters or PDFs. The backend automatically extracts text and inspects stamps, fees, and contact details for scam signals.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">⚡</div>
            <h3>Scam Pattern Matching</h3>
            <p>
              Detects high-risk tactics including upfront registration fees, Telegram/WhatsApp interview redirects, false urgency, and impersonated recruiters.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🕸️</div>
            <h3>Scam Campaign Tracking</h3>
            <p>
              Clusters related fraudulent postings using similarity algorithms to reveal coordinated scam rings operating under multiple alias company names.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <Link to={ctaLink} className="btn btn-primary btn-lg">
            Start Scanning Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-content">
          <div className="brand-logo" style={{ fontSize: '1.15rem' }}>
            <div className="brand-icon" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>🛡️</div>
            <div>Job<span>Shield</span></div>
          </div>
          <p>© {new Date().getFullYear()} JobShield — AI-Powered Job Scam Detection & Threat Intelligence.</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
            Evaluating JobShield for an engineering interview? Explore the <Link to="/demo" style={{ color: '#3b82f6', fontWeight: 600 }}>Recruiter & Architecture Hub →</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
