import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResultCard from '../components/AnalysisResultCard';
import { authApi, jobApi, getSwaggerUrl } from '../services/api';

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
 * InterviewerDemoPage Component
 * Dedicated evaluation hub for HR, recruiters, and engineering interviewers.
 */
export default function InterviewerDemoPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('textScan');
  const [selectedSampleKey, setSelectedSampleKey] = useState('checkScam');
  const [runningTest, setRunningTest] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testError, setTestError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // PDF demo state
  const [pdfScanning, setPdfScanning] = useState(false);
  const [pdfResult, setPdfResult] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [currentPdfName, setCurrentPdfName] = useState('');

  const currentSample = SAMPLES[selectedSampleKey];

  const handle1ClickLogin = async () => {
    try {
      setLoggingIn(true);
      await authApi.login({
        email: 'demo@jobshield.com',
        password: 'Password@123',
      });
      navigate('/dashboard');
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

  const handleRunPdfAnalysis = async (filename) => {
    setPdfScanning(true);
    setPdfError(null);
    setPdfResult(null);
    setCurrentPdfName(filename);

    try {
      const res = await fetch(`/sample_pdfs/${filename}`);
      if (!res.ok) throw new Error(`Could not fetch ${filename}`);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'application/pdf' });
      const scanRes = await jobApi.analyzePdf(file);
      setPdfResult(scanRes);
    } catch (err) {
      setPdfError(err.message || 'Failed to analyze PDF file.');
    } finally {
      setPdfScanning(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-main)' }}>
      <Navbar />

      {/* Recruiter Evaluation Banner */}
      <div style={{
        background: 'linear-gradient(180deg, #edf2fe 0%, #e8edff 45%, #f4f7fd 100%)',
        color: '#0f172a',
        padding: '3rem 1.5rem',
        borderBottom: '1px solid #e8ecf4'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff', color: '#4361ee', border: '1px solid #c7d2fe', padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.825rem', fontWeight: 700, marginBottom: '1rem', boxShadow: '0 2px 6px rgba(67, 97, 238, 0.1)' }}>
            <span>👔</span>
            <span>Recruiter & Technical Interviewer Evaluation Center</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ maxWidth: '700px' }}>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 0.75rem', color: '#0f172a' }}>
                JobShield Architecture & <span style={{ color: 'var(--color-brand)' }}>Live Demo</span> Hub
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
                This dedicated portal allows hiring managers and interviewers to evaluate all platform capabilities in 1 click without manual typing or registering test accounts.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={handle1ClickLogin}
                disabled={loggingIn}
                className="btn btn-primary btn-lg"
                style={{
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <span>⚡ {loggingIn ? 'Logging In...' : '1-Click Login to Recruiter Portal'}</span>
              </button>
              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Pre-seeded with real scam scans & campaigns
              </div>
            </div>
          </div>

          {/* Quick Architecture Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
            {['Java 17', 'Spring Boot 4', 'React 19', 'Google Gemini AI', 'MySQL 8 (Aiven)', 'Spring Security JWT', 'Apache PDFBox'].map((tech) => (
              <span key={tech} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#475569',
                padding: '0.3rem 0.75rem',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                {tech}
              </span>
            ))}
            <a
              href={getSwaggerUrl()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: '#4361ee',
                padding: '0.3rem 0.85rem',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              📚 OpenAPI / Swagger Docs ↗
            </a>
          </div>
        </div>
      </div>

      {/* Main Tabbed Interactive Center */}
      <div style={{ maxWidth: '1100px', margin: '2rem auto 4rem', padding: '0 1rem' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.65rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.65rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          {[
            { id: 'textScan', label: '⚡ 1-Click AI Job Scanner' },
            { id: 'pdfScan', label: '📄 PDF Offer Letter Extraction' },
            { id: 'campaigns', label: '🕸️ Syndicate Threat Engine' },
            { id: 'faq', label: '🎙️ Architecture & Interview Q&A' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--color-brand)' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--color-brand)' : '#e2e8f0',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(67, 97, 238, 0.25)' : 'none',
                padding: '0.65rem 1.4rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.925rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Live AI Text Scanner */}
        {activeTab === 'textScan' && (
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#0f172a' }}>
                Test Live AI Evaluation on Realistic Scenarios
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 1.25rem' }}>
                Click any scenario below to immediately trigger the live backend Gemini AI evaluation and pattern similarity check:
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  className="btn"
                  style={{
                    background: selectedSampleKey === 'checkScam' ? '#ef4444' : '#fef2f2',
                    color: selectedSampleKey === 'checkScam' ? '#ffffff' : '#b91c1c',
                    border: '1px solid #fecaca',
                    fontWeight: 700
                  }}
                  onClick={() => handleRunLiveAnalysis('checkScam')}
                >
                  🚨 1-Click Run: Fake Check Scam
                </button>

                <button
                  type="button"
                  className="btn"
                  style={{
                    background: selectedSampleKey === 'taskScam' ? '#f59e0b' : '#fffbeb',
                    color: selectedSampleKey === 'taskScam' ? '#ffffff' : '#b45309',
                    border: '1px solid #fde68a',
                    fontWeight: 700
                  }}
                  onClick={() => handleRunLiveAnalysis('taskScam')}
                >
                  ⚠️ 1-Click Run: WhatsApp Task Scheme
                </button>

                <button
                  type="button"
                  className="btn"
                  style={{
                    background: selectedSampleKey === 'legit' ? '#10b981' : '#ecfdf5',
                    color: selectedSampleKey === 'legit' ? '#ffffff' : '#047857',
                    border: '1px solid #a7f3d0',
                    fontWeight: 700
                  }}
                  onClick={() => handleRunLiveAnalysis('legit')}
                >
                  ✅ 1-Click Run: Legitimate Tech Role
                </button>
              </div>

              {/* Sample Details Preview */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <strong style={{ color: '#0f172a' }}>Selected Scenario: {currentSample.name}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Expected Risk: {currentSample.riskLevel} (~{currentSample.expectedScore}/100)</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.5rem' }}>
                  🏢 <strong>Company:</strong> {currentSample.companyName} • 💰 <strong>Salary:</strong> {currentSample.salary}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#334155', maxHeight: '130px', overflowY: 'auto', background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', whiteSpace: 'pre-line' }}>
                  {currentSample.jobDescription}
                </div>
              </div>

              {runningTest && (
                <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <LoadingSpinner message="Sending payload to POST /api/jobs/analyze (Google Gemini AI + Fallback Heuristics)..." />
                </div>
              )}

              {testError && (
                <div className="alert alert-error">❌ {testError}</div>
              )}

              {testResult && !runningTest && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.75rem' }}>
                    ⚡ Live Backend AI Evaluation Result:
                  </h3>
                  <AnalysisResultCard
                    result={testResult}
                    onReset={() => setTestResult(null)}
                    jobTitle={currentSample.jobTitle}
                    companyName={currentSample.companyName}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PDF Scanner */}
        {activeTab === 'pdfScan' && (
          <div className="card">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
              Apache PDFBox Document Extraction & Evaluation
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 1.25rem' }}>
              Test real PDF appointment letters. The backend extracts the raw text stream via Apache PDFBox and scans for fraudulent stipulations:
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button
                type="button"
                className="btn"
                style={{ background: 'var(--risk-high-bg)', color: 'var(--risk-high-text)', border: '1px solid var(--risk-high-border)', fontWeight: 700 }}
                onClick={() => handleRunPdfAnalysis('Sample_Scam_Job_Offer_Letter.pdf')}
              >
                🚨 1-Click Scan: Fake Scam Offer Letter PDF
              </button>

              <button
                type="button"
                className="btn"
                style={{ background: 'var(--risk-low-bg)', color: 'var(--risk-low-text)', border: '1px solid var(--risk-low-border)', fontWeight: 700 }}
                onClick={() => handleRunPdfAnalysis('Sample_Legitimate_Job_Offer_Letter.pdf')}
              >
                ✅ 1-Click Scan: Legitimate Offer Letter PDF
              </button>

              <a
                href="/sample_pdfs/Sample_Scam_Job_Offer_Letter.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                👁️ View / Download Raw PDF ↗
              </a>
            </div>

            {pdfScanning && (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <LoadingSpinner message="Uploading file to POST /api/jobs/analyze-pdf (Extracting text with Apache PDFBox)..." />
              </div>
            )}

            {pdfError && <div className="alert alert-error">❌ {pdfError}</div>}

            {pdfResult && !pdfScanning && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
                  📄 Live PDF Scan Result ({currentPdfName}):
                </h3>
                <AnalysisResultCard
                  result={pdfResult}
                  onReset={() => setPdfResult(null)}
                  jobTitle="Uploaded PDF Offer Letter"
                  companyName={currentPdfName}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Campaigns */}
        {activeTab === 'campaigns' && (
          <div className="card">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
              Syndicate Threat Detection & Similarity Clustering
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.25rem' }}>
              Fraudulent recruitment rings frequently create multiple shell company names while recycling identical interview templates, Telegram handles, and bank wire instructions. JobShield uses an in-memory Jaccard token similarity engine to automatically group these into threat campaigns:
            </p>

            <div style={{ background: '#172033', padding: '1.25rem', borderRadius: '10px', border: '1px solid #2e3c54', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="campaign-badge">🏷️ CAMP-2026-ADVANCE-FEE</span>
                <RiskBadge level="HIGH" />
              </div>
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem', fontSize: '1.1rem' }}>
                Coordinated Cashier Check & Equipment Deposit Ring
              </div>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 0.75rem', lineHeight: '1.5' }}>
                Linked Postings: <strong>2 shell companies identified</strong> (<em>Apex Global Staffing</em> and <em>Apex Talent Partners</em>) sharing the Telegram recruiter handle <code>@apex_recruiter</code> and fake equipment check instructions.
              </p>
              <div style={{ fontSize: '0.9rem', color: '#60a5fa', fontWeight: 700 }}>
                Average Threat Score: 90/100
              </div>
            </div>

            <button
              onClick={handle1ClickLogin}
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
            >
              ⚡ Log in as Recruiter to View All Live Campaigns →
            </button>
          </div>
        )}

        {/* TAB 4: Architecture & Interview Q&A */}
        {activeTab === 'faq' && (
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.75rem', color: '#ffffff' }}>
                Technical Architecture & Endpoints
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ background: '#172033', padding: '1.25rem', borderRadius: '10px', border: '1px solid #2e3c54' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>📚</div>
                  <h4 style={{ margin: '0 0 0.35rem', fontWeight: 800, color: '#ffffff' }}>OpenAPI / Swagger UI</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1rem', lineHeight: '1.5' }}>
                    Interactive Swagger 3 UI with JWT Bearer authentication scheme.
                  </p>
                  <a href={getSwaggerUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                    Open Swagger UI ↗
                  </a>
                </div>

                <div style={{ background: '#172033', padding: '1.25rem', borderRadius: '10px', border: '1px solid #2e3c54' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>📊</div>
                  <h4 style={{ margin: '0 0 0.35rem', fontWeight: 800, color: '#ffffff' }}>JVM System Telemetry</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1rem', lineHeight: '1.5' }}>
                    Real-time backend heap memory, active threads, and uptime metrics.
                  </p>
                  <a href="https://jobshield-backend.onrender.com/api/system/metrics" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                    View /api/system/metrics ↗
                  </a>
                </div>

                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>📥</div>
                  <h4 style={{ margin: '0 0 0.35rem', fontWeight: 800, color: '#0f172a' }}>Dynamic PDF Audit Report</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem', lineHeight: '1.5' }}>
                    Generated on-the-fly via Apache PDFBox with security verification stamps.
                  </p>
                  <button onClick={handle1ClickLogin} className="btn btn-sm btn-secondary">
                    Download in Dashboard ↗
                  </button>
                </div>
              </div>
            </div>

            {/* Top Interview Questions & Winning Answers */}
            <div className="card">
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1rem', color: '#0f172a' }}>
                Key Technical Questions You Can Defend in Interviews
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ paddingLeft: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeftWidth: '4px', borderLeftColor: '#4361ee' }}>
                  <h4 style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem', fontSize: '1.05rem' }}>
                    Q: What happens if Google Gemini is down or rate-limited?
                  </h4>
                  <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
                    <strong>Answer:</strong> The backend implements a <em>resilient fallback architecture</em>. In <code>GeminiServiceImpl</code>, if the external HTTP request throws an exception, it seamlessly delegates to a deterministic heuristic keyword regex engine so the user still gets a risk assessment and the system never crashes.
                  </p>
                </div>

                <div style={{ paddingLeft: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeftWidth: '4px', borderLeftColor: '#4361ee' }}>
                  <h4 style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem', fontSize: '1.05rem' }}>
                    Q: Why use stateless JWT instead of HTTP Sessions?
                  </h4>
                  <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
                    <strong>Answer:</strong> Stateless JWT eliminates session storage on JVM heap memory, allowing horizontal scaling across multiple container instances on cloud infrastructure (Render/Kubernetes) without sticky sessions.
                  </p>
                </div>

                <div style={{ paddingLeft: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeftWidth: '4px', borderLeftColor: '#4361ee' }}>
                  <h4 style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem', fontSize: '1.05rem' }}>
                    Q: How do you prevent Out-Of-Memory (OOM) errors during PDF generation?
                  </h4>
                  <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
                    <strong>Answer:</strong> In <code>PdfServiceImpl</code>, the <code>PDDocument</code> is allocated inside a <code>try-with-resources</code> block, ensuring all native buffers and file descriptors are reclaimed immediately upon completion. The PDF bytes are streamed through a <code>ByteArrayOutputStream</code> rather than written to disk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
