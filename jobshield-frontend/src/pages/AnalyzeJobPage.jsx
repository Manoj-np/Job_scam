import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobApi } from '../services/api';
import AnalysisResultCard from '../components/AnalysisResultCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SAMPLES = {
  scam: {
    companyName: 'Apex Global Staffing Corp',
    jobTitle: 'Remote Data Entry Specialist / Virtual Assistant',
    salary: '$55/hour ($4,400/week) + Sign-on Bonus',
    jobDescription: `Urgently hiring Remote Data Entry Operators and Virtual Assistants! No previous experience or resume required. Work from home 2-3 hours daily. Earn $55/hr paid daily via Zelle or Crypto.

Interview conducted entirely via Telegram text chat (Contact @HRApexRecruiter on Telegram).

Selected candidates must purchase home office equipment (MacBook Pro & specialized data entry software) from our certified vendor. We will mail you a company cashier's check for $2,400 to cover these expenses. You must immediately deposit the check and wire $2,200 via Western Union / Bitcoin ATM to the vendor to expedite your shipment.

Send your full name, SSN, copy of driver's license, and bank routing details to careers.apexglobal@gmail.com to claim your slot.`
  },
  suspicious: {
    companyName: 'FastTrack Global Media Ltd',
    jobTitle: 'Social Media Rating Agent & Video Optimizer',
    salary: '$250 - $600 daily (Commission-based)',
    jobDescription: `Earn daily income simply by liking videos, boosting seller product ratings, and rating mobile apps! Flexible part-time job from home, 1-2 hours a day.

Payment will be credited immediately to your digital wallet upon completion of 30 review tasks.

Requirement: To unlock task set #1 and register on our platform portal, all applicants must deposit a refundable security balance of $120 in USDT to activate your VIP worker tier. Your deposit is guaranteed to be returned within 24 hours plus 25% commission. Contact our hiring assistant on WhatsApp at +1-987-555-0199.`
  },
  legit: {
    companyName: 'Google LLC',
    jobTitle: 'Senior Java Backend Engineer (Cloud Services)',
    salary: '$165,000 - $190,000 / year + Equity + Full Benefits',
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
 * AnalyzeJobPage Component
 * Submits structured job details to POST /api/jobs/analyze for AI evaluation.
 */
export default function AnalyzeJobPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    salary: '',
    jobDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleLoadAndAnalyze = async (key) => {
    const sample = SAMPLES[key];
    if (!sample) return;

    setFormData(sample);
    setError(null);
    setLoading(true);

    try {
      const payload = {
        companyName: sample.companyName.trim(),
        jobTitle: sample.jobTitle.trim(),
        salary: sample.salary.trim() || null,
        jobDescription: sample.jobDescription.trim(),
      };

      const response = await jobApi.analyzeJob(payload);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to analyze job posting.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleOnly = (key) => {
    if (SAMPLES[key]) {
      setFormData(SAMPLES[key]);
      setError(null);
    }
  };

  useEffect(() => {
    const demoParam = searchParams.get('demo');
    if (demoParam && SAMPLES[demoParam]) {
      handleLoadAndAnalyze(demoParam);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation matching backend AnalyzeJobRequest
    if (!formData.companyName.trim()) {
      setError('Company Name is required.');
      return;
    }

    if (!formData.jobTitle.trim()) {
      setError('Job Title is required.');
      return;
    }

    if (!formData.jobDescription.trim()) {
      setError('Job Description is required.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        companyName: formData.companyName.trim(),
        jobTitle: formData.jobTitle.trim(),
        salary: formData.salary.trim() || null,
        jobDescription: formData.jobDescription.trim(),
      };

      const response = await jobApi.analyzeJob(payload);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to analyze job posting.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setFormData({
      companyName: '',
      jobTitle: '',
      salary: '',
      jobDescription: '',
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analyze Job Posting</h1>
          <p className="page-subtitle">
            Submit suspicious job offers or descriptions to detect scam indicators and fraud syndicates.
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">❌ {error}</div>}

      {/* When analysis has finished, show results */}
      {result && (
        <AnalysisResultCard
          result={result}
          onReset={handleReset}
          jobTitle={formData.jobTitle}
          companyName={formData.companyName}
        />
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="card" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <LoadingSpinner message="Evaluating posting with Google Gemini AI and cross-referencing scam patterns..." />
        </div>
      )}

      {/* Job Entry Form */}
      {!result && !loading && (
        <div className="card">
          {/* Quick Demo Presets for Interviewer */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(99,102,241,0.08))',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                  Recruiter 1-Click Instant AI Evaluation:
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Single click fills form and executes live Gemini AI analysis immediately
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => handleLoadAndAnalyze('scam')}
              >
                🚨 1-Click Run: Fake Check Scam
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => handleLoadAndAnalyze('suspicious')}
              >
                ⚠️ 1-Click Run: Task Deposit Scheme
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => handleLoadAndAnalyze('legit')}
              >
                ✅ 1-Click Run: Legitimate Tech Role
              </button>
            </div>
            
            <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#64748b' }}>
              <span>Want to edit manually first? </span>
              <button
                type="button"
                onClick={() => handleLoadSampleOnly('scam')}
                style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              >
                Fill scam text without running
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-row">
              <div className="form-group">
                <label className="form-label" htmlFor="companyName">
                  Company / Organization Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  className="form-input"
                  placeholder="e.g. Apex Global Solutions"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="jobTitle">
                  Job Role / Title *
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  name="jobTitle"
                  className="form-input"
                  placeholder="e.g. Remote Data Entry Specialist"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="salary">
                Offered Salary / Compensation (Optional)
              </label>
              <input
                id="salary"
                type="text"
                name="salary"
                className="form-input"
                placeholder="e.g. $45/hr or ₹50,000/month"
                value={formData.salary}
                onChange={handleChange}
              />
              <span className="form-hint">Unusually high salaries for entry-level work are a strong scam indicator.</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="jobDescription">
                Full Job Description or Email Message *
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                className="form-textarea"
                rows={9}
                placeholder="Paste the complete job posting text, communication received via email/WhatsApp, requirements, and payment instructions..."
                value={formData.jobDescription}
                onChange={handleChange}
                required
              />
              <span className="form-hint">Include interview instructions, payment terms, or contact links if mentioned.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary btn-lg">
                <span>🛡️ Run AI Scam Analysis</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
