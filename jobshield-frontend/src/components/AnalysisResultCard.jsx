import React from 'react';
import RiskBadge from './RiskBadge';

/**
 * AnalysisResultCard Component
 * Displays the comprehensive analysis result returned from backend:
 * - Risk Score (0–100)
 * - Risk Level (LOW, MEDIUM, HIGH)
 * - AI Reason & Explanation
 * - Pattern Matching Metrics (matched scams, similarity %, similar companies)
 */
export default function AnalysisResultCard({ result, onReset, jobTitle, companyName, location }) {
  if (!result) return null;

  const {
    riskScore = 0,
    riskLevel = 'LOW',
    reason = '',
    matchedScams = 0,
    highestSimilarity = 0,
    similarCompanies = []
  } = result;

  const safeLevel = (riskLevel || 'LOW').toUpperCase();

  const evidenceHeaders = {
    HIGH: { icon: '🚨', label: 'Critical Fraud Signals & AI Evidence', badge: 'High Danger' },
    MEDIUM: { icon: '⚠️', label: 'Suspicious Red Flags & Warning Indicators', badge: 'Caution Advised' },
    LOW: { icon: '✅', label: 'Verification & Authenticity Evidence', badge: 'Legitimate Signals' }
  };

  const currentEvidence = evidenceHeaders[safeLevel] || evidenceHeaders.LOW;

  return (
    <div className="analysis-result-card">
      <div className={`result-header risk-${safeLevel}`}>
        <div className="score-badge">
          <div className="seon-score-box">
            <span className={`seon-score-num text-risk-${safeLevel}`}>{riskScore}</span>
            <span className="seon-score-denom">/100</span>
          </div>
          <div>
            <div className="score-title">Fraud Risk Score</div>
            <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RiskBadge level={safeLevel} />
              <span style={{ fontSize: '0.8rem', color: safeLevel === 'HIGH' ? 'var(--risk-high-text)' : safeLevel === 'MEDIUM' ? 'var(--risk-medium-text)' : 'var(--risk-low-text)', fontWeight: 700 }}>
                {currentEvidence.badge}
              </span>
            </div>
          </div>
        </div>

        {onReset && (
          <button className="btn btn-secondary btn-sm" onClick={onReset}>
            <span>↻</span>
            <span>Analyze Another Job</span>
          </button>
        )}
      </div>

      <div className="result-body">
        {jobTitle && (
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>TARGET POSTING:</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
              {jobTitle} {companyName ? `at ${companyName}` : ''}
            </h3>
            {location && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                flexWrap: 'wrap',
                marginTop: '0.4rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.3rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#334155'
              }}>
                <span>📍 Interview Location:</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{location}</span>
                {['btm', 'marathahalli', 'hsr', 'hebbal'].some(h => location.toLowerCase().includes(h)) && (
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    background: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '12px',
                    marginLeft: '0.25rem'
                  }}>
                    🚨 Flagged Bengaluru Hotspot
                  </span>
                )}
                {['electronic city', 'whitefield', 'ecity', 'itpl'].some(h => location.toLowerCase().includes(h)) && (
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    background: '#ecfdf5',
                    color: '#047857',
                    border: '1px solid #a7f3d0',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '12px',
                    marginLeft: '0.25rem'
                  }}>
                    ✅ Verified Tech SEZ
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* AI Explanation & Evidence-Backed Reasoning */}
        <div className="result-section">
          <h4>
            <span>{currentEvidence.icon}</span>
            <span>{currentEvidence.label}</span>
          </h4>
          <div className={`reason-box risk-${safeLevel}`}>
            {reason || 'No detailed explanation provided.'}
          </div>
        </div>

        {/* Pattern & Similarity Signals */}
        <div className="result-section">
          <h4>
            <span>🔍</span>
            <span>Pattern Match & Syndicate Signals</span>
          </h4>
          <div className="metrics-row">
            <div className="mini-metric-card">
              <div className="label">Matched Scam Signals</div>
              <div className="val">{matchedScams ?? 0}</div>
            </div>

            <div className="mini-metric-card">
              <div className="label">Highest Similarity</div>
              <div className="val">{highestSimilarity ? `${Math.round(highestSimilarity)}%` : '0%'}</div>
            </div>

            <div className="mini-metric-card">
              <div className="label">Syndicate Risk Status</div>
              <div className="val" style={{ fontSize: '1rem', color: safeLevel === 'HIGH' ? 'var(--risk-high-text)' : safeLevel === 'MEDIUM' ? 'var(--risk-medium-text)' : 'var(--risk-low-text)' }}>
                {highestSimilarity >= 80 ? '⚠️ High Coordinated Match' : (highestSimilarity >= 60 ? '⚡ Partial Match' : '✓ Low Cluster Risk')}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Companies Flagged */}
        {similarCompanies && similarCompanies.length > 0 && (
          <div className="result-section">
            <h4>
              <span>🏢</span>
              <span>Reused Scam Patterns Detected in Other Postings:</span>
            </h4>
            <div className="company-tag-list">
              {similarCompanies.map((comp, idx) => (
                <span key={idx} className="company-tag">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
