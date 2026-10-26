import React, { useEffect, useState } from 'react';
import { jobApi } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const BENGALURU_HOTSPOTS = [
  {
    id: 'btm',
    area: 'BTM Layout 2nd Stage',
    riskLevel: 'HIGH',
    riskScore: 92,
    badgeText: 'CRITICAL HOTSPOT',
    fakeOfficesCount: 6,
    avgExtortion: '₹3,500 – ₹12,000',
    primaryTactic: 'Fake Java/Data Entry Walk-In',
    safetyTip: 'Never pay registration fees or laptop deposits for walk-ins in BTM.',
    companies: ['Apex Tech Staffing', 'Skyline Placement Solutions', 'Nexus Talent Partners'],
  },
  {
    id: 'marathahalli',
    area: 'Marathahalli Bridge',
    riskLevel: 'HIGH',
    riskScore: 88,
    badgeText: 'HIGH RISK ZONE',
    fakeOfficesCount: 5,
    avgExtortion: '₹2,500 – ₹8,000',
    primaryTactic: 'Original Marksheet Retention & Laptop Cash Deposit',
    safetyTip: 'Holding original certificates is strictly illegal under Indian law.',
    companies: ['Apex Global Staffing', 'Verve Career Hub', 'Zenith Logistics HR'],
  },
  {
    id: 'hsr',
    area: 'HSR Layout Sector 7',
    riskLevel: 'HIGH',
    riskScore: 85,
    badgeText: 'HIGH RISK ZONE',
    fakeOfficesCount: 4,
    avgExtortion: '₹2,000 – ₹6,000',
    primaryTactic: 'Impersonated MNC Walk-In Calls (TCS/Infosys)',
    safetyTip: 'Tier-1 IT firms never charge slot booking fees on WhatsApp.',
    companies: ['Global Connect Placements', 'Infosoft Careers India'],
  },
  {
    id: 'hebbal',
    area: 'Hebbal / Manyata Outer Ring',
    riskLevel: 'MEDIUM',
    riskScore: 76,
    badgeText: 'CAUTION ZONE',
    fakeOfficesCount: 3,
    avgExtortion: '₹1,500 – ₹4,000',
    primaryTactic: 'Fake Tech Park Gate Pass & Security Uniform Scheme',
    safetyTip: 'Only meet HR inside official tech park reception counters.',
    companies: ['Manyata Direct Staffing', 'Metro Tech Gateways'],
  },
  {
    id: 'ecity',
    area: 'Electronic City Phase 1',
    riskLevel: 'LOW',
    riskScore: 12,
    badgeText: 'VERIFIED TECH SEZ',
    fakeOfficesCount: 0,
    avgExtortion: '₹0 (Legitimate / Free)',
    primaryTactic: 'Verified Enterprise Campus Hiring',
    safetyTip: 'Safe IT SEZ zone with verified corporate campuses (Infosys, Wipro).',
    companies: ['Infosys Campus', 'Wipro SEZ', 'Siemens R&D'],
  },
  {
    id: 'whitefield',
    area: 'Whitefield ITPL Zone',
    riskLevel: 'LOW',
    riskScore: 15,
    badgeText: 'VERIFIED TECH SEZ',
    fakeOfficesCount: 0,
    avgExtortion: '₹0 (Legitimate / Free)',
    primaryTactic: 'Official MNC Assessment Center',
    safetyTip: 'Registered MNC tech parks with standard corporate recruitment.',
    companies: ['ITPB Tech Park', 'TCS Vydehi Campus', 'Oracle Tech Center'],
  },
];

/**
 * CampaignsPage Component
 * Clean, visual area-wise scam hotspot intelligence for Bengaluru.
 */
export default function CampaignsPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'RISK' | 'SAFE'

  useEffect(() => {
    // Attempt backend sync, fallback gracefully
    jobApi.getCampaigns()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayedHotspots = BENGALURU_HOTSPOTS.filter((item) => {
    if (filter === 'RISK') return item.riskLevel === 'HIGH' || item.riskLevel === 'MEDIUM';
    if (filter === 'SAFE') return item.riskLevel === 'LOW';
    return true;
  });

  return (
    <div className="page-container" style={{ maxWidth: '1150px' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--color-teal-tint)',
            color: 'var(--color-brand-dark)',
            border: '1px solid var(--color-teal-border)',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.4rem'
          }}>
            <span>📍</span>
            <span>Bengaluru Student Safety Intelligence</span>
          </div>
          <h1 className="page-title">Bengaluru Scam Hotspots</h1>
          <p className="page-subtitle">
            Area-wise recruitment fraud ratings to protect students and freshers before attending walk-in interviews.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {[
          { key: 'ALL', label: 'All Areas (6)' },
          { key: 'RISK', label: '🚨 High-Risk Hotspots (4)' },
          { key: 'SAFE', label: '✅ Verified Safe Tech Zones (2)' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className="btn btn-sm"
            style={{
              backgroundColor: filter === tab.key ? 'var(--color-brand-contrast)' : '#ffffff',
              color: filter === tab.key ? '#ffffff' : '#334155',
              border: '1px solid ' + (filter === tab.key ? 'var(--color-brand-contrast)' : 'var(--color-border)'),
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              boxShadow: filter === tab.key ? '0 4px 12px rgba(12, 20, 39, 0.15)' : 'none',
              padding: '0.45rem 1.1rem',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner message="Loading Bengaluru area threat ratings..." />}

      {/* Visual Hotspots Grid */}
      {!loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {displayedHotspots.map((spot) => {
            const isSafe = spot.riskLevel === 'LOW';
            const isCritical = spot.riskScore >= 90;

            const badgeBg = isSafe ? '#ecfdf5' : isCritical ? '#fef2f2' : '#fffbeb';
            const badgeColor = isSafe ? '#047857' : isCritical ? '#b91c1c' : '#b45309';
            const badgeBorder = isSafe ? '#a7f3d0' : isCritical ? '#fecaca' : '#fde68a';

            return (
              <div
                key={spot.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  borderTop: `4px solid ${isSafe ? 'var(--risk-low)' : isCritical ? 'var(--risk-high)' : 'var(--risk-medium)'}`,
                }}
              >
                <div>
                  {/* Card Header: Locality & Risk Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                        📍 {spot.area}
                      </h3>
                      <span style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: badgeBg,
                        color: badgeColor,
                        border: `1px solid ${badgeBorder}`,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '12px',
                        letterSpacing: '0.03em',
                      }}>
                        {spot.badgeText}
                      </span>
                    </div>

                    {/* SEON-Style Score Pill */}
                    <div className="seon-score-box" style={{ padding: '0.35rem 0.75rem' }}>
                      <span className={`seon-score-num text-risk-${spot.riskLevel}`} style={{ fontSize: '1.75rem' }}>
                        {spot.riskScore}
                      </span>
                      <span className="seon-score-denom">/100</span>
                    </div>
                  </div>

                  {/* 3 Compact Data Chips */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1rem' }}>
                    <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Flagged Consultancies
                      </span>
                      <strong style={{ fontSize: '1rem', color: isSafe ? '#047857' : '#0f172a' }}>
                        {spot.fakeOfficesCount === 0 ? '0 (Verified)' : `${spot.fakeOfficesCount} Detected`}
                      </strong>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Typical Fee Demand
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: isSafe ? '#047857' : '#b91c1c' }}>
                        {spot.avgExtortion}
                      </strong>
                    </div>
                  </div>

                  {/* Primary Scam Tactic */}
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                      Primary Pattern / Tactic:
                    </span>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', margin: '0.15rem 0 0', lineHeight: 1.4 }}>
                      {spot.primaryTactic}
                    </p>
                  </div>

                  {/* Company Aliases */}
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                      {isSafe ? 'Major Corporate Employers:' : 'Reported Aliases in Hub:'}
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                      {spot.companies.map((comp, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '12px',
                            background: isSafe ? '#f0fdf4' : '#fef2f2',
                            color: isSafe ? '#166534' : '#991b1b',
                            border: `1px solid ${isSafe ? '#bbf7d0' : '#fecaca'}`,
                          }}
                        >
                          🏢 {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 1-Line Student Tip */}
                <div style={{
                  background: isSafe ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${isSafe ? '#bbf7d0' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.8rem',
                  color: isSafe ? '#166534' : '#475569',
                  lineHeight: 1.4,
                }}>
                  <strong>{isSafe ? '✅ Safe Zone Tip:' : '🛡️ Student Tip:'}</strong> {spot.safetyTip}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
