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
          {/* Subtle Sample Helper */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>💡 Want to test with sample job text?</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleLoadSampleOnly('scam')}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
              >
                🚨 Load Scam Sample
              </button>
              <button
                type="button"
                onClick={() => handleLoadSampleOnly('legit')}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#86efac' }}
              >
                ✅ Load Legit Sample
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
