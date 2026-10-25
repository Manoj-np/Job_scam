import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { isAuthenticated } from '../services/api';

/**
 * LandingPage Component
 * SEON-style Fraud Prevention Platform & Verification Pipeline
 */
export default function LandingPage() {
  const loggedIn = isAuthenticated();
  const ctaLink = loggedIn ? '/dashboard' : '/register';

  return (
    <div className="landing-page-root">
      <Navbar theme="teal" />

      {/* Hero Section: SEON-Inspired Cyber Fraud Defense Canvas */}
      <section className="hero-teal-container">
        <div className="hero-content-wrapper">
          {/* Left Column: Headline, Subtitle, CTAs */}
          <div className="hero-left-column">
            <h1 className="hero-headline-seon">
              Your First Line of Defense Against Fraud & Money Laundering
            </h1>
            <p className="hero-subtitle-seon">
              SEON-grade AI fraud prevention platform that uses real-time threat intelligence to stop job scams, fraudulent recruiters, and advance-fee schemes before you apply or wire money.
            </p>
            <div className="hero-cta-group">
              <Link to={ctaLink} className="btn btn-navy btn-lg">
                Speak with an expert
              </Link>
              <Link to="/analyze" className="btn btn-white-hero btn-lg">
                Start Free Scam Check
              </Link>
            </div>
          </div>

          {/* Right Column: Floating SEON Intelligence Cards */}
          <div className="hero-right-column">
            {/* Registration Node */}
            <div className="seon-flow-node">
              <div className="flow-pill">
                <span>📋</span>
                <span>Registration</span>
              </div>
              <div className="flow-details">
                <div className="flow-row">
                  <span className="flow-label">Email information</span>
                  <span className="flow-val">markwatson8856@gmail.com</span>
                </div>
                <div className="flow-row">
                  <span className="flow-label">IP Information</span>
                  <span className="flow-val">195.91.136.178</span>
                </div>
                <div className="flow-row">
                  <span className="flow-label">Devices & OS</span>
                  <span className="flow-val">User desktop 1</span>
                </div>
                <div className="flow-row">
                  <span className="flow-label">Phone information</span>
                  <span className="flow-val">607-542-7904</span>
                </div>
                <div className="flow-score-row">
                  <div>
                    <span className="flow-label">Fraud score</span>
                    <div className="flow-score-num">
                      <span className="score-green">1</span>
                      <span className="score-denom">/100</span>
                    </div>
                  </div>
                  <span className="badge-activated">Rule activated ▾</span>
                </div>
              </div>
            </div>

            {/* Stack of Floating Intelligence Cards */}
            <div className="seon-cards-stack">
              {/* User Details Card */}
              <div className="seon-widget-card seon-card-user">
                <div className="widget-header">
                  <div>
                    <h4>User Details</h4>
                    <span className="widget-sub">markwatson8856@gmail.com ▾</span>
                  </div>
                  <div className="widget-score-box">
                    <div className="widget-score-val score-amber">
                      42<span className="score-denom">/100</span>
                    </div>
                    <span className="widget-score-lbl">Fraud score</span>
                  </div>
                </div>

                <div className="widget-social-box">
                  <div className="social-tag">f Facebook</div>
                  <div className="social-user">Mark Watson</div>
                  <div className="social-icons-strip">
                    <span></span>
                    <span>🐦</span>
                    <span>📌</span>
                    <span>✆</span>
                    <span>📷</span>
                    <span>🛍️</span>
                  </div>
                </div>

                <div className="widget-metrics-list">
                  <div className="w-metric-row">
                    <span>Deliverable</span>
                    <span className="w-val">No</span>
                  </div>
                  <div className="w-metric-row">
                    <span>No. of data breaches</span>
                    <span className="w-val">235</span>
                  </div>
                  <div className="w-metric-row">
                    <span>IP Location</span>
                    <span className="w-val">Minneapolis</span>
                  </div>
                </div>
              </div>

              {/* Device Card */}
              <div className="seon-widget-card seon-card-device">
                <div className="widget-header">
                  <div>
                    <h4>Device</h4>
                    <span className="widget-sub">💻 User desktop 1 ▾</span>
                  </div>
                  <div className="widget-score-box">
                    <div className="widget-score-val score-teal">
                      16<span className="score-denom">/100</span>
                    </div>
                    <span className="widget-score-lbl">Fraud Score</span>
                  </div>
                </div>

                <div className="widget-metrics-list">
                  <div className="w-metric-row">
                    <span>Similar device hashes</span>
                    <span className="w-val">5 found</span>
                  </div>
                  <div className="w-metric-row">
                    <span>Identical device hashes</span>
                    <span className="w-val">0 found</span>
                  </div>
                  <div className="w-metric-row">
                    <span>Timezone offset</span>
                    <span className="w-val">UTC+01:00</span>
                  </div>
                  <div className="w-metric-row">
                    <span>Screen resolution</span>
                    <span className="w-val">1920×1055</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smooth Organic Wave Divider */}
        <div className="hero-wave-container">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,45 C320,120 420,-15 880,50 C1180,95 1360,25 1440,40 L1440,120 L0,120 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Trusted By Companies Strip */}
      <section className="trusted-strip">
        <div className="trusted-label">
          <span>🛡️</span>
          <span>TRUSTED BY THE WORLD'S MOST AMBITIOUS COMPANIES</span>
        </div>
        <div className="trusted-logos">
          <span className="trusted-logo-item">Revolut</span>
          <span className="trusted-logo-item" style={{ fontFamily: 'monospace', fontWeight: 900 }}>7 Wise</span>
          <span className="trusted-logo-item" style={{ letterSpacing: '0.05em' }}>NORTHSTAR+ GAMING</span>
          <span className="trusted-logo-item" style={{ color: '#ea580c' }}>* kindred</span>
          <span className="trusted-logo-item" style={{ color: '#0d9488' }}>Google Cloud</span>
          <span className="trusted-logo-item" style={{ color: '#16a34a' }}>🍃 Spring Boot</span>
        </div>
      </section>

      {/* How It Works: Three Simple Steps (User Requirement) */}
      <section className="how-it-works-section">
        <div className="section-header">
          <div className="hero-badge" style={{ marginBottom: '1rem' }}>
            <span>⚡</span>
            <span>Verification Pipeline</span>
          </div>
          <h2 className="section-title">
            How It <span style={{ color: 'var(--color-brand)' }}>Works</span>
          </h2>
          <p className="section-desc">
            Three simple steps to verify any job posting or offer letter before taking action.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Submit Job Details or PDF</h3>
            <p>
              Paste the job posting description, company name, and salary, or directly upload an offer letter PDF.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">2</div>
            <h3>AI & Pattern Analysis</h3>
            <p>
              The Spring Boot backend runs Gemini AI analysis and checks scam similarity against known fraud databases.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">3</div>
            <h3>View Risk Score & Signals</h3>
            <p>
              Get an instant Risk Score (0–100), risk tier (LOW/MEDIUM/HIGH), detailed reason, and syndicate alert.
            </p>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginTop: '3.5rem' }}>
          {['Java 17', 'Spring Boot 4', 'React 19', 'Google Gemini AI', 'MySQL 8 (Aiven)', 'Spring Security JWT', 'Apache PDFBox'].map((tech) => (
            <span key={tech} style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#334155',
              padding: '0.4rem 0.95rem',
              borderRadius: '20px',
              fontSize: '0.825rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}>
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Comprehensive Scam Defense Engine */}
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
          <Link to={ctaLink} className="btn btn-navy btn-lg">
            Start Scanning Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-content">
          <div className="brand-logo" style={{ fontSize: '1.2rem' }}>
            <div className="brand-icon" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>🛡️</div>
            <div>Job<span>Shield</span></div>
          </div>
          <p>© {new Date().getFullYear()} JobShield — AI-Powered Job Scam Detection & Threat Intelligence.</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
            Evaluating JobShield for an engineering interview? Explore the <Link to="/demo" style={{ color: 'var(--color-brand)', fontWeight: 700 }}>Recruiter & Architecture Hub →</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
