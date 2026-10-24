import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { isAuthenticated, authApi } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const PREVIEWS = {
  checkScam: {
    title: 'Remote Data Entry Clerk / Assistant',
    company: 'Apex Global Staffing Corp',
    salary: '$55/hr ($4,400/week) + Sign-on Bonus',
    riskScore: 88,
    riskLevel: 'HIGH',
    type: 'Advance-Fee / Check Fraud Syndicate',
    campaign: 'CAMP-2026-ADVANCE-FEE',
    flags: [
      'Advance-Fee Demand: $150 deposit for office laptop setup',
      'Unverified Channel: Interview exclusively conducted via Telegram (@apex_recruiter)',
      'Fake Check Scam: Required to deposit company check and wire funds to vendor',
      'Unrealistic Salary: $55/hr entry-level rate without resume screening'
    ],
    aiReasoning: 'Textbook advance-fee equipment purchase scam. Scammers impersonate legitimate recruitment agencies to send fraudulent cashier checks and request irreversible wire/crypto transfers before the check bounces.',
    description: 'Work from home 2-3 hours daily. Earn $55/hr paid daily. Interview via Telegram @apex_recruiter. We will mail you a company check for $2,400 to purchase equipment from our certified vendor. Deposit check and wire $2,200 immediately to expedite shipping.'
  },
  taskScam: {
    title: 'Social Media Rating Agent & Video Booster',
    company: 'FastTrack Global Media Ltd',
    salary: '$250 - $600 daily (Commission-based)',
    riskScore: 92,
    riskLevel: 'HIGH',
    type: 'Ponzi Task-Deposit Scheme',
    campaign: 'CAMP-2026-TASK-PONZI',
    flags: [
      'Crypto Deposit Required: $120 USDT to activate VIP worker account',
      'Unregistered Entity: Contact via unofficial WhatsApp number (+1-987-555-0199)',
      'Artificial Task Fraud: Liking videos / rating apps for unrealistic returns'
    ],
    aiReasoning: 'High-risk task completion scheme. Victims are lured with small early rewards and then coerced into depositing escalating crypto balances to release supposedly earned commissions.',
    description: 'Earn daily income liking videos and rating apps. Complete 30 daily tasks. To start, deposit $120 USDT refundable security balance to activate your account. Contact HR via WhatsApp.'
  },
  legitimate: {
    title: 'Senior Java Backend Engineer (Cloud Services)',
    company: 'Google LLC',
    salary: '$165,000 - $190,000 / year + Equity + Full Benefits',
    riskScore: 12,
    riskLevel: 'LOW',
    type: 'Verified Corporate Opportunity',
    campaign: 'None (Legitimate Enterprise)',
    flags: [
      'Official Application Portal (careers.google.com)',
      'Standard Multi-Stage Technical Interview Pipeline',
      'Comprehensive 401(k), Equity & Health Coverage Included',
      'No Upfront Payment or Banking Demands'
    ],
    aiReasoning: 'Authentic employment posting matching standard Google engineering specifications. Structured interview pipeline with zero financial demands or untraceable communication channels.',
    description: 'Google Cloud is seeking an experienced Senior Software Engineer to design, implement, and operate highly available microservices in Java 17 and Spring Boot. Apply officially via careers.google.com.'
  }
};

/**
 * LandingPage Component
 * Public introduction to JobShield's AI scam detection capabilities.
 */
export default function LandingPage() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const [activeTab, setActiveTab] = useState('checkScam');
  const [loggingIn, setLoggingIn] = useState(false);

  const currentPreview = PREVIEWS[activeTab];

  const handleInstantDemoLogin = async (destination = '/dashboard') => {
    try {
      setLoggingIn(true);
      await authApi.login({
        email: 'demo@jobshield.com',
        password: 'Password@123',
      });
      navigate(destination);
    } catch (err) {
      navigate('/login');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div>
      <Navbar />

      {/* Recruiter & Interviewer Instant Banner */}
      <div style={{
        backgroundColor: '#1e3a8a',
        color: '#ffffff',
        padding: '0.75rem 1rem',
        fontSize: '0.9rem',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.85rem',
        flexWrap: 'wrap'
      }}>
        <span>👔 <strong>Reviewing this project for a developer interview?</strong></span>
        <button
          onClick={() => handleInstantDemoLogin('/dashboard')}
          disabled={loggingIn}
          style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            border: 'none',
            padding: '0.35rem 0.9rem',
            borderRadius: '6px',
            fontWeight: 800,
            fontSize: '0.825rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(16,185,129,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          ⚡ {loggingIn ? 'Signing in...' : '1-Click Instant Recruiter Access'}
        </button>
        <span style={{ opacity: 0.9, fontSize: '0.82rem' }}>
          (No password entry needed — instantly opens pre-seeded dashboard)
        </span>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span>⚡</span>
          <span>Next-Gen Cybersecurity for Job Seekers</span>
        </div>

        <h1 className="hero-title">
          Protect Yourself From Job Scams
        </h1>

        <p className="hero-subtitle">
          Leverage Google Gemini AI, PDF offer letter scanning, pattern matching, and 
          cross-company campaign clustering to uncover fraudulent job offers before you apply or pay.
        </p>

        <div className="hero-actions">
          <button
            onClick={() => handleInstantDemoLogin('/analyze')}
            disabled={loggingIn}
            className="btn btn-primary btn-lg"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
              cursor: 'pointer'
            }}
          >
            <span>⚡ {loggingIn ? 'Loading Demo...' : '1-Click Test Live AI Scanner'}</span>
          </button>
          <a
            href="#live-demo"
            className="btn btn-secondary btn-lg"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              borderColor: 'rgba(255,255,255,0.2)',
              textDecoration: 'none'
            }}
          >
            <span>🔍 Inspect Real Scams Below (Zero Clicks)</span>
          </a>
        </div>

        {/* Tech Stack Pills for Interviewers */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
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

      {/* Interactive Live Scam Inspection Showcase (Zero Clicks / Instant Understanding) */}
      <section id="live-demo" style={{ maxWidth: '1050px', margin: '-2rem auto 3rem', padding: '0 1rem' }}>
        <div className="card" style={{
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb' }}>
                Interactive Engine Showcase
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                How JobShield Detects Fraudulent Job Postings
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                Click between real threat scenarios to inspect how our AI evaluates scam signals in milliseconds:
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: activeTab === 'checkScam' ? '#ef4444' : '#fee2e2',
                  color: activeTab === 'checkScam' ? '#ffffff' : '#b91c1c',
                  border: '1px solid #fca5a5',
                  fontWeight: 700
                }}
                onClick={() => setActiveTab('checkScam')}
              >
                🚨 Fake Check Scam
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: activeTab === 'taskScam' ? '#f59e0b' : '#fef3c7',
                  color: activeTab === 'taskScam' ? '#ffffff' : '#b45309',
                  border: '1px solid #fcd34d',
                  fontWeight: 700
                }}
                onClick={() => setActiveTab('taskScam')}
              >
                ⚠️ Task Deposit Scheme
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: activeTab === 'legitimate' ? '#10b981' : '#dcfce7',
                  color: activeTab === 'legitimate' ? '#ffffff' : '#15803d',
                  border: '1px solid #86efac',
                  fontWeight: 700
                }}
                onClick={() => setActiveTab('legitimate')}
              >
                ✅ Legitimate Tech Role
              </button>
            </div>
          </div>

          {/* Inspection View Card */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                  {currentPreview.title}
                </h3>
                <div style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>
                  🏢 {currentPreview.company} • 💰 {currentPreview.salary}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <RiskBadge level={currentPreview.riskLevel} />
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: currentPreview.riskScore >= 70 ? '#ef4444' : '#10b981' }}>
                  {currentPreview.riskScore}/100
                </span>
              </div>
            </div>

            {/* Red Flags / Assessment */}
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                🚩 Detected Threat Indicators:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {currentPreview.flags.map((flag, idx) => (
                  <div key={idx} style={{
                    fontSize: '0.85rem',
                    color: currentPreview.riskLevel === 'HIGH' ? '#991b1b' : '#166534',
                    background: currentPreview.riskLevel === 'HIGH' ? '#fef2f2' : '#f0fdf4',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${currentPreview.riskLevel === 'HIGH' ? '#ef4444' : '#22c55e'}`
                  }}>
                    {flag}
                  </div>
                ))}
              </div>
            </div>

            {/* Gemini AI Reasoning Box */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                🤖 Gemini AI Scam Assessment:
              </h4>
              <div style={{
                fontSize: '0.875rem',
                color: '#334155',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                lineHeight: '1.5'
              }}>
                {currentPreview.aiReasoning}
              </div>
            </div>

            {/* Bottom 1-Click Launch Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
                🏷️ Campaign Association: <strong>{currentPreview.campaign}</strong>
              </div>

              <button
                onClick={() => handleInstantDemoLogin('/analyze')}
                disabled={loggingIn}
                className="btn btn-primary btn-sm"
                style={{ fontWeight: 700, cursor: 'pointer' }}
              >
                ⚡ {loggingIn ? 'Logging in...' : '1-Click Launch Full App & Live Scanner →'}
              </button>
            </div>
          </div>
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
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
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
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Empowering job seekers worldwide against fraudulent recruiters, deceptive offers, and fee extortion.
          </p>
        </div>
      </footer>
    </div>
  );
}
