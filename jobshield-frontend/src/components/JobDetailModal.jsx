import React, { useEffect, useState } from 'react';
import { jobApi } from '../services/api';
import RiskBadge from './RiskBadge';
import LoadingSpinner from './LoadingSpinner';

/**
 * JobDetailModal Component
 * Shows complete scan details fetched from GET /api/jobs/{analysisId}
 */
export default function JobDetailModal({ analysisId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await jobApi.downloadPdfReport(analysisId);
    } catch (err) {
      alert('Failed to download report: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!analysisId) return;

    setLoading(true);
    setError(null);

    jobApi.getAnalysisById(analysisId)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load analysis details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [analysisId]);

  if (!analysisId) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ color: '#ffffff', fontWeight: 800 }}>Analysis Details</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Report ID #{analysisId}
            </span>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem' }}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading && <LoadingSpinner message="Fetching job scan report..." />}

          {error && <div className="alert alert-error">❌ {error}</div>}

          {data && !loading && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                    {data.jobTitle}
                  </h2>
                  <div style={{ color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>
                    🏢 {data.companyName} {data.salary ? `• 💰 ${data.salary}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <RiskBadge level={data.riskLevel} />
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                    {data.riskScore}/100
                  </span>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  AI Scam Assessment & Evidence
                </h4>
                <div className={`reason-box risk-${data.riskLevel || 'LOW'}`}>
                  {data.reason || 'No specific explanation recorded.'}
                </div>
              </div>

              {data.createdAt && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong>Scanned At:</strong> {new Date(data.createdAt).toLocaleString()}
                </div>
              )}

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Analyzed Job Description
                </h4>
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '1rem',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.9rem',
                    color: 'var(--text-light-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  {data.jobDescription}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {data ? (
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem' }}
            >
              <span>{downloading ? '⏳' : '📥'}</span>
              <span>{downloading ? 'Generating Report...' : 'Download PDF Audit Report'}</span>
            </button>
          ) : <div />}
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
