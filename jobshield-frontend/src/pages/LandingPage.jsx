import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResultCard from '../components/AnalysisResultCard';
import { authApi, jobApi, getSwaggerUrl, isAuthenticated } from '../services/api';

const SAMPLES = {
  checkScam: {
    key: 'checkScam',
    name: '🚨 Fake Check Advance-Fee Scam',
    companyName: 'Apex Global Staffing Corp',
    jobTitle: 'Remote Data Entry Clerk / Assistant',
    salary: '$55/hour ($4,400/week) + Sign-on Bonus',
    expectedScore: 88,
    riskLevel: 'HIGH',
    campaign: 'CAMP-2026-ADVANCE-FEE',
    jobDescription: `Urgently hiring remote Data Entry Operators and Virtual Assistants! No previous experience or resume required. Work from home 2-3 hours daily. Earn $55/hr paid daily via Zelle or Crypto.

Interview conducted entirely via Telegram text chat (Contact @HRApexRecruiter on Telegram).

Selected candidates must purchase home office equipment (MacBook Pro & specialized data entry software) from our certified vendor. We will mail you a company check for $2,400 to cover these expenses. You must immediately deposit the check and wire $2,200 via Western Union / Bitcoin ATM to the vendor to expedite your shipment.

Send your full name, SSN, copy of driver's license, and bank routing details to careers.apexglobal@gmail.com to claim your slot.`
  },
  taskScam: {
    key: 'taskScam',
    name: '⚠️ Task Deposit Scheme (WhatsApp / USDT)',
    companyName: 'FastTrack Global Media Ltd',
    jobTitle: 'Social Media Rating Agent & Video Booster',
    salary: '$250 - $600 daily (Commission-based)',
    expectedScore: 92,
    riskLevel: 'HIGH',
    campaign: 'CAMP-2026-TASK-PONZI',
    jobDescription: `Earn daily income simply by liking videos, boosting seller product ratings, and rating mobile apps! Flexible part-time job from home, 1-2 hours a day.

Payment will be credited immediately to your digital wallet upon completion of 30 review tasks.

Requirement: To unlock task set #1 and register on our platform portal, all applicants must deposit a refundable security balance of $120 in USDT to activate your VIP worker tier. Your deposit is guaranteed to be returned within 24 hours plus 25% commission. Contact our hiring assistant on WhatsApp at +1-987-555-0199.`
  },
  legit: {
    key: 'legit',
    name: '✅ Legitimate Enterprise Tech Role',
    companyName: 'Google LLC',
    jobTitle: 'Senior Java Backend Engineer (Cloud Services)',
    salary: '$165,000 - $190,000 / year + Equity + Full Benefits',
    expectedScore: 12,
    riskLevel: 'LOW',
    campaign: 'None (Verified Enterprise)',
    jobDescription: `About the Role:
Google Cloud is seeking an experienced Senior Software Engineer to design, implement, and operate highly available microservices in Java 17 and Spring Boot.

Requirements:
- 5+ years of software development experience with Java, Spring Boot, or Kotlin.
- Strong proficiency in distributed databases (PostgreSQL, Cloud Spanner) and message queues (Kafka, GCP PubSub).
- Experience with containerization (Docker, Kubernetes) and CI/CD pipelines.
- Bachelor's or Master's degree in Computer Science or equivalent practical experience.

Hiring Process:
1. Recruiter Screen (Google Meet)
2. Technical Coding Assessment (Data Structures & System Design)
3. Virtual Onsite Interviews

Note: Google recruiters will only contact you from @google.com email domains and will NEVER ask for banking credentials, crypto transactions, or equipment prepayments. Apply officially via careers.google.com.`
  }
};

/**
 * LandingPage Component
 * Clean 5-6 word summary header with Two Dedicated Modes:
 * 1. For Normal Users (How It Works + Scam Verification)
 * 2. For Technical Interviewers (1-Click Evaluation Lab + Architecture Defense)
 */
export default function LandingPage() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'interviewer'

  // Interviewer demo state
  const [selectedSampleKey, setSelectedSampleKey] = useState('checkScam');
  const [runningTest, setRunningTest] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testError, setTestError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const currentSample = SAMPLES[selectedSampleKey];

  const handle1ClickLogin = async () => {
    try {
      setLoggingIn(true);
      await authApi.login({
        email: 'demo@jobshield.com',
        password: 'Password@123',
      });
      navigate('/analyze');
    } catch (err) {
      navigate('/login');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleRunLiveAnalysis = async (sampleKey) => {
    const sample = SAMPLES[sampleKey];
    if (!sample) return;

    setSelectedSampleKey(sampleKey);
    setRunningTest(true);
    setTestError(null);
    setTestResult(null);

    try {
      const payload = {
        companyName: sample.companyName,
        jobTitle: sample.jobTitle,
        salary: sample.salary,
        jobDescription: sample.jobDescription,
      };
      const res = await jobApi.analyzeJob(payload);
      setTestResult(res);
    } catch (err) {
      setTestError(err.message || 'Failed to complete AI evaluation.');
    } finally {
      setRunningTest(false);
    }
  };

  return (
    <div className="landing-page-root">
      <Navbar theme="teal" />

      {/* Hero Section: 5-Word Summary & Two Dedicated Tabs */}
      <section className="hero-teal-container hero-compact">
        <div className="hero-compact-content">
          <h1 className="hero-headline-compact">
            AI-Powered Job Scam Detection Platform
          </h1>

          {/* Only Two Tabs */}
          <div className="tab-pill-container" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'user'}
              className={`tab-pill-btn ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              <span>👤</span>
              <span>Normal User</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'interviewer'}
              className={`tab-pill-btn ${activeTab === 'interviewer' ? 'active' : ''}`}
              onClick={() => setActiveTab('interviewer')}
            >
              <span>👔</span>
              <span>Interviewer Walkthrough</span>
            </button>
          </div>
        </div>

        {/* Organic Wave Divider */}
        <div className="hero-wave-container">
          <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,30 C320,80 420,0 880,35 C1180,65 1360,15 1440,25 L1440,90 L0,90 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* TAB 1: NORMAL USER VIEW */}
      {activeTab === 'user' && (
        <div>
          {/* How It Works: Three Simple Steps */}
          <section className="how-it-works-section" style={{ paddingTop: '2rem' }}>
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

            {/* User Quick Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2.5rem' }}>
              <Link to="/analyze" className="btn btn-navy btn-lg">
                <span>🛡️ Start Free Scam Check</span>
              </Link>
              <Link to="/scan-pdf" className="btn btn-secondary btn-lg">
                <span>📄 Scan Offer Letter PDF</span>
              </Link>
            </div>

            {/* Tech Stack Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginTop: '3rem' }}>
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
              <Link to="/analyze" className="btn btn-navy btn-lg">
                Start Scanning Now →
              </Link>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: INTERVIEWER WALKTHROUGH VIEW */}
      {activeTab === 'interviewer' && (
        <section className="page-container" style={{ paddingTop: '1.5rem', maxWidth: '1150px' }}>
          {/* Quick Access Card */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, #f0fdf9 0%, #e6f7f2 100%)',
            border: '1px solid var(--color-teal-border)',
            marginBottom: '2rem',
            padding: '1.75rem 2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#ffffff',
                  color: 'var(--color-brand-dark)',
                  border: '1px solid var(--color-teal-border)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem'
                }}>
                  👔 Technical Interviewer & Recruiter Portal
                </span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0.25rem 0 0.5rem', color: '#0f172a' }}>
                  Architecture & Live Demo Evaluation Hub
                </h2>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem', maxWidth: '650px', lineHeight: 1.5 }}>
                  Instantly test our real-time scam detection algorithms, inspect defensible system design decisions, and log in with pre-seeded test data without registering dummy accounts.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={handle1ClickLogin}
                  disabled={loggingIn}
                  className="btn btn-navy"
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
                >
                  ⚡ {loggingIn ? 'Logging In...' : '1-Click Login to Recruiter Portal'}
                </button>
                <a
                  href={getSwaggerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ textAlign: 'center' }}
                >
                  📚 OpenAPI / Swagger Docs ↗
                </a>
              </div>
            </div>
          </div>

          {/* Interactive 1-Click Verification Test Lab */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Interactive 1-Click Live Test Lab
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  Select a real-world scenario to run live AI analysis through the Spring Boot API:
                </p>
              </div>
              <span style={{ fontSize: '0.78rem', background: 'var(--color-teal-tint)', color: 'var(--color-brand-dark)', padding: '0.25rem 0.65rem', borderRadius: '12px', fontWeight: 700 }}>
                Live Gemini API Connected
              </span>
            </div>

            {/* Scenario Selector Pills */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {Object.values(SAMPLES).map((sample) => (
                <button
                  key={sample.key}
                  type="button"
                  onClick={() => handleRunLiveAnalysis(sample.key)}
                  className="btn"
                  style={{
                    backgroundColor: selectedSampleKey === sample.key ? 'var(--color-brand-contrast)' : '#ffffff',
                    color: selectedSampleKey === sample.key ? '#ffffff' : '#334155',
                    border: '1px solid ' + (selectedSampleKey === sample.key ? 'var(--color-brand-contrast)' : 'var(--color-border)'),
                    padding: '0.6rem 1.15rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    boxShadow: selectedSampleKey === sample.key ? '0 4px 12px rgba(12, 20, 39, 0.2)' : 'none'
                  }}
                >
                  {sample.name}
                </button>
              ))}
            </div>

            {/* Active Sample Details Preview */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {currentSample.jobTitle}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.2rem' }}>
                    🏢 {currentSample.companyName} • 💰 {currentSample.salary}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RiskBadge level={currentSample.riskLevel} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>
                    Expected Risk: ~{currentSample.expectedScore}/100
                  </span>
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                fontSize: '0.85rem',
                color: '#475569',
                maxHeight: '140px',
                overflowY: 'auto',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {currentSample.jobDescription}
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleRunLiveAnalysis(selectedSampleKey)}
                  disabled={runningTest}
                  className="btn btn-primary"
                  style={{ fontWeight: 700 }}
                >
                  <span>⚡ {runningTest ? 'Running Verification...' : 'Run 1-Click Verification Test'}</span>
                </button>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Sends POST request to <code>/api/jobs/analyze</code>
                </span>
              </div>
            </div>

            {/* Test Loading & Result State */}
            {runningTest && <LoadingSpinner message="Contacting Spring Boot backend & running Gemini AI analysis..." />}

            {testError && (
              <div className="alert alert-error" style={{ marginTop: '1rem' }}>
                <span>❌ {testError}</span>
              </div>
            )}

            {testResult && !runningTest && (
              <AnalysisResultCard
                result={testResult}
                jobTitle={currentSample.jobTitle}
                companyName={currentSample.companyName}
                onReset={() => setTestResult(null)}
              />
            )}
          </div>

          {/* Key Technical Questions You Can Defend in Interviews */}
          <div className="card" style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 1.25rem', color: '#0f172a' }}>
              Key Technical Interview Questions & Answers
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ paddingLeft: '1.25rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeftWidth: '4px', borderLeftColor: 'var(--color-brand)' }}>
                <h4 style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem', fontSize: '1.05rem' }}>
                  Q: What happens if Google Gemini is down or rate-limited?
                </h4>
                <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
                  <strong>Answer:</strong> The backend implements a <em>resilient fallback architecture</em>. In <code>GeminiServiceImpl</code>, if the external HTTP request throws an exception, it seamlessly delegates to a deterministic heuristic keyword regex engine so the user still gets a risk assessment and the system never crashes.
                </p>
              </div>

              <div style={{ paddingLeft: '1.25rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeftWidth: '4px', borderLeftColor: 'var(--color-brand)' }}>
                <h4 style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem', fontSize: '1.05rem' }}>
                  Q: Why use stateless JWT instead of HTTP Sessions?
                </h4>
                <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
                  <strong>Answer:</strong> Stateless JWT eliminates session storage on JVM heap memory, allowing horizontal scaling across multiple container instances on cloud infrastructure (Render/Kubernetes) without sticky sessions.
                </p>
              </div>

              <div style={{ paddingLeft: '1.25rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeftWidth: '4px', borderLeftColor: 'var(--color-brand)' }}>
                <h4 style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem', fontSize: '1.05rem' }}>
                  Q: How do you prevent Out-Of-Memory (OOM) errors during PDF generation?
                </h4>
                <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
                  <strong>Answer:</strong> In <code>PdfServiceImpl</code>, the <code>PDDocument</code> is allocated inside a <code>try-with-resources</code> block, ensuring all native buffers and file descriptors are reclaimed immediately upon completion. The PDF bytes are streamed through a <code>ByteArrayOutputStream</code> rather than written to disk.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-content">
          <div className="brand-logo" style={{ fontSize: '1.2rem' }}>
            <div className="brand-icon" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>🛡️</div>
            <div>Job<span>Shield</span></div>
          </div>
          <p>© {new Date().getFullYear()} JobShield — AI-Powered Job Scam Detection & Threat Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
