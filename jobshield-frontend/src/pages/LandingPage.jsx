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
    name: '⚠️ WhatsApp Task Deposit Trap',
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
 * Ultra-clear 10-second summary for both interviewers and jobseekers:
 * 1. The Problem: Freshers lose money to fake walk-in consultancies and check-deposit traps.
 * 2. The Solution: AI scans job text & PDFs to output an instant 0–100 Fraud Risk Score.
 * 3. The Tech: Spring Boot 4 (Java 17) REST API + React 19 + Google Gemini 2.5 Flash + Apache PDFBox.
 */
export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'interviewer'

  // Live test lab state
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

      {/* Hero Section: Punchy Headline & Tab Switcher */}
      <section className="hero-teal-container hero-compact" style={{ paddingBottom: '3.5rem' }}>
        <div className="hero-compact-content" style={{ marginBottom: '1.75rem' }}>
          <h1 className="hero-headline-compact" style={{ marginBottom: '0.65rem' }}>
            AI-Powered Job Scam Detection Platform
          </h1>
          <p style={{
            fontSize: '1.15rem',
            color: 'rgba(255, 255, 255, 0.92)',
            maxWidth: '700px',
            margin: '0 auto 1.5rem',
            lineHeight: 1.45,
            fontWeight: 500
          }}>
            Detect fake job postings, check-deposit scams, and walk-in consultancy traps in seconds.
          </p>

          {/* Two Tabs: Normal User vs Interviewer */}
          <div className="tab-pill-container" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'user'}
              className={`tab-pill-btn ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              <span>👤</span>
              <span>For Job Seekers & Students</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'interviewer'}
              className={`tab-pill-btn ${activeTab === 'interviewer' ? 'active' : ''}`}
              onClick={() => setActiveTab('interviewer')}
            >
              <span>👔</span>
              <span>For Interviewers (Quick Briefing)</span>
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

      {/* 10-SECOND EXECUTIVE SUMMARY STRIP (Visible Immediately to All Visitors) */}
      <div style={{
        maxWidth: '1100px',
        margin: '-2.25rem auto 2.5rem',
        position: 'relative',
        zIndex: 10,
        padding: '0 1rem'
      }}>
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.25rem 1.75rem',
          boxShadow: '0 12px 30px -10px rgba(15, 23, 42, 0.12)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* 1. Problem */}
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#fef2f2', color: '#dc2626', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
              🚨
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                1. The Problem
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', color: '#334155', fontWeight: 600, lineHeight: 1.45 }}>
                Over 40% of freshers lose money to fake walk-in consultancies and advance-fee check scams.
              </p>
            </div>
          </div>

          {/* 2. Solution */}
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#ecfdf5', color: '#059669', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
              🛡️
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                2. The Solution
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', color: '#334155', fontWeight: 600, lineHeight: 1.45 }}>
                AI analyzes job text & PDF offer letters to assign an instant 0–100 Fraud Risk Score.
              </p>
            </div>
          </div>

          {/* 3. Tech Stack */}
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#eff6ff', color: '#2563eb', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
              ⚙️
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                3. The Tech Stack
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', color: '#334155', fontWeight: 600, lineHeight: 1.45 }}>
                Spring Boot 4 (Java 17) REST API + React 19 + Google Gemini 2.5 Flash + Apache PDFBox.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: NORMAL USER / STUDENT VIEW */}
      {activeTab === 'user' && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
          {/* Interactive 1-Click Verification Test Lab */}
          <div className="card" style={{ marginBottom: '2.5rem', border: '1.5px solid var(--color-teal-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  ⚡ Try It in 5 Seconds (Live AI Evaluation)
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  Click a real-world scenario to run live fraud detection through our Spring Boot backend:
                </p>
              </div>
              <span style={{ fontSize: '0.78rem', background: 'var(--color-teal-tint)', color: 'var(--color-brand-dark)', padding: '0.25rem 0.65rem', borderRadius: '12px', fontWeight: 700 }}>
                Google Gemini 2.5 Flash Active
              </span>
            </div>

            {/* Scenario Pills */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
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
                    padding: '0.55rem 1.15rem',
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

            {/* Active Sample Snippet */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {currentSample.jobTitle}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>
                    🏢 {currentSample.companyName} • 💰 {currentSample.salary}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RiskBadge level={currentSample.riskLevel} />
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#64748b' }}>
                    Expected Risk: ~{currentSample.expectedScore}/100
                  </span>
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.825rem',
                color: '#475569',
                maxHeight: '110px',
                overflowY: 'auto',
                lineHeight: 1.45,
                whiteSpace: 'pre-wrap'
              }}>
                {currentSample.jobDescription}
              </div>

              <div style={{ marginTop: '0.85rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleRunLiveAnalysis(selectedSampleKey)}
                  disabled={runningTest}
                  className="btn btn-primary btn-sm"
                  style={{ fontWeight: 700, padding: '0.5rem 1.25rem' }}
                >
                  <span>⚡ {runningTest ? 'Evaluating with Gemini...' : 'Run Live Analysis'}</span>
                </button>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Evaluates via <code>POST /api/jobs/analyze</code>
                </span>
              </div>
            </div>

            {/* Test Loading & Result State */}
            {runningTest && <LoadingSpinner message="Running Google Gemini AI evaluation & pattern check..." />}

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

          {/* 3 Simple Steps */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                How It Works in 3 Steps
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                Simple protection before you apply, attend an interview, or wire money.
              </p>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-num">1</div>
                <h3>Paste Job or PDF</h3>
                <p>Paste any job posting text, WhatsApp message, or upload an appointment letter PDF.</p>
              </div>

              <div className="step-card">
                <div className="step-num">2</div>
                <h3>AI Fraud Scan</h3>
                <p>Gemini AI evaluates fee demands, Telegram redirects, and compares against known scam syndicates.</p>
              </div>

              <div className="step-card">
                <div className="step-num">3</div>
                <h3>Instant Safety Verdict</h3>
                <p>Receive a clear 0–100 Fraud Risk Score with specific red flags and safe next steps.</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link to="/analyze" className="btn btn-navy btn-lg">
                <span>🛡️ Analyze a Job Posting</span>
              </Link>
              <Link to="/campaigns" className="btn btn-secondary btn-lg">
                <span>📍 View Bengaluru Scam Hotspots</span>
              </Link>
            </div>
          </section>

          {/* 3 Core Modules */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                3 Built-In Protections
              </h2>
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper">🔍</div>
                <h3>Job Description Analyzer</h3>
                <p>Pinpoints advance-fee schemes, check-deposit traps, personal Gmail recruiters, and suspicious Telegram chats.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrapper">📄</div>
                <h3>PDF Offer Letter Scanner</h3>
                <p>Extracts text from appointment letters using Apache PDFBox to detect forged company seals and registration fee clauses.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrapper">📍</div>
                <h3>Bengaluru Scam Hotspots</h3>
                <p>Area-wise risk ratings and student warnings for walk-in consultancy hubs in BTM Layout, Marathahalli, and HSR Layout.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: INTERVIEWER WALKTHROUGH & BRIEFING VIEW */}
      {activeTab === 'interviewer' && (
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
          {/* Executive Pitch Card */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, #f0fdf9 0%, #e6f7f2 100%)',
            border: '1.5px solid var(--color-teal-border)',
            marginBottom: '2rem',
            padding: '1.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
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
                  👔 Interviewer Executive Briefing
                </span>
                <h2 style={{ fontSize: '1.55rem', fontWeight: 800, margin: '0.25rem 0 0.5rem', color: '#0f172a' }}>
                  Project Overview for Interviewers
                </h2>
                <div style={{ color: '#334155', fontSize: '0.925rem', maxWidth: '680px', lineHeight: 1.6 }}>
                  <p style={{ margin: '0 0 0.5rem' }}>
                    <strong>What it is:</strong> A full-stack AI security platform that stops job recruitment fraud before applicants wire money or attend fraudulent walk-in interviews.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Why it's defensible:</strong> Built with a multi-layered detection engine (Gemini AI + heuristic regex fallback), stateless JWT security, and memory-safe Apache PDFBox parsing.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={handle1ClickLogin}
                  disabled={loggingIn}
                  className="btn btn-navy"
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem', fontWeight: 700 }}
                >
                  ⚡ {loggingIn ? 'Logging In...' : '1-Click Recruiter Demo Login'}
                </button>
                <a
                  href={getSwaggerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ textAlign: 'center', fontWeight: 600 }}
                >
                  📚 OpenAPI / Swagger Docs ↗
                </a>
              </div>
            </div>
          </div>

          {/* Interactive 1-Click Verification Test Lab */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Live API Verification Test
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                  Select a test case to execute live against the backend:
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {Object.values(SAMPLES).map((sample) => (
                <button
                  key={sample.key}
                  type="button"
                  onClick={() => handleRunLiveAnalysis(sample.key)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: selectedSampleKey === sample.key ? 'var(--color-brand-contrast)' : '#ffffff',
                    color: selectedSampleKey === sample.key ? '#ffffff' : '#334155',
                    border: '1px solid ' + (selectedSampleKey === sample.key ? 'var(--color-brand-contrast)' : 'var(--color-border)'),
                    padding: '0.5rem 1rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {sample.name}
                </button>
              ))}
            </div>

            {/* Test Loading & Result State */}
            {runningTest && <LoadingSpinner message="Sending payload to Spring Boot REST API..." />}

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

          {/* Key Technical Interview Q&As */}
          <div className="card" style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 1.25rem', color: '#0f172a' }}>
              Key Technical Interview Questions You Can Defend
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeftWidth: '4px', borderLeftColor: 'var(--color-brand)' }}>
                <h4 style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem', fontSize: '1rem' }}>
                  Q: What happens if Google Gemini AI is down or rate-limited?
                </h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                  <strong>Answer:</strong> The backend implements a resilient fallback architecture. In <code>GeminiServiceImpl</code>, if the external API call fails, it automatically delegates to a regex heuristic engine so the assessment completes with 0% downtime.
                </p>
              </div>

              <div style={{ padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeftWidth: '4px', borderLeftColor: 'var(--color-brand)' }}>
                <h4 style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem', fontSize: '1rem' }}>
                  Q: Why stateless JWT rather than server-side HTTP Sessions?
                </h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                  <strong>Answer:</strong> Stateless JWT eliminates session storage on JVM heap memory, allowing horizontal scaling across cloud instances without sticky sessions or Redis cluster overhead.
                </p>
              </div>

              <div style={{ padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeftWidth: '4px', borderLeftColor: 'var(--color-brand)' }}>
                <h4 style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem', fontSize: '1rem' }}>
                  Q: How do you prevent Out-Of-Memory (OOM) leaks during PDF text parsing?
                </h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                  <strong>Answer:</strong> In <code>PdfServiceImpl</code>, the <code>PDDocument</code> is wrapped in a <code>try-with-resources</code> block, ensuring native file descriptors and memory buffers are reclaimed immediately upon parsing.
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
