import React, { useEffect, useState } from 'react';
import { jobApi } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const STORAGE_KEY = 'jobshield_user_reported_scams';

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

const STANDARD_AREAS = [
  'BTM Layout 2nd Stage',
  'Marathahalli Bridge',
  'HSR Layout Sector 7',
  'Hebbal / Manyata Outer Ring',
  'Indiranagar 100ft Road',
  'Koramangala 5th Block',
  'Rajajinagar Industrial Area',
  'OTHER'
];

/**
 * Merge base hotspots with locally stored user reports
 */
function mergeHotspots(baseList, userReports) {
  if (!userReports || userReports.length === 0) {
    return baseList.map(item => ({ ...item, companies: [...item.companies] }));
  }

  // Deep clone base list
  const list = baseList.map(item => ({
    ...item,
    companies: [...item.companies],
    userReportCount: 0,
  }));

  const customAreas = [];

  userReports.forEach((rep) => {
    const targetArea = (rep.area === 'OTHER' ? rep.customArea : rep.area) || 'Bengaluru';
    const existing = list.find(h => h.area.toLowerCase() === targetArea.toLowerCase());

    if (existing) {
      existing.fakeOfficesCount = (existing.fakeOfficesCount || 0) + 1;
      existing.userReportCount = (existing.userReportCount || 0) + 1;
      if (rep.company && !existing.companies.includes(rep.company)) {
        existing.companies.push(`${rep.company} (Reported)`);
      }
      if (rep.notes) {
        existing.safetyTip = `Latest Community Report: ${rep.notes}`;
      }
    } else {
      // Check if already in customAreas
      const existingCustom = customAreas.find(c => c.area.toLowerCase() === targetArea.toLowerCase());
      if (existingCustom) {
        existingCustom.fakeOfficesCount += 1;
        existingCustom.userReportCount += 1;
        if (rep.company && !existingCustom.companies.includes(rep.company)) {
          existingCustom.companies.push(rep.company);
        }
      } else {
        customAreas.push({
          id: `custom_${rep.id || Date.now()}`,
          area: targetArea,
          riskLevel: 'HIGH',
          riskScore: 89,
          badgeText: 'COMMUNITY REPORTED',
          fakeOfficesCount: 1,
          userReportCount: 1,
          avgExtortion: rep.fee || '₹3,000 – ₹7,000',
          primaryTactic: rep.tactic || 'Walk-In Registration Fee Demand',
          safetyTip: rep.notes || 'Student beware: Verify office registration before paying cash.',
          companies: rep.company ? [rep.company] : ['Suspect Consultancy'],
          isUserCreated: true,
          reportId: rep.id,
        });
      }
    }
  });

  return [...customAreas, ...list];
}

/**
 * CampaignsPage Component
 * Bengaluru Scam Hotspots & Community Reporting Feature
 */
export default function CampaignsPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'RISK' | 'SAFE' | 'COMMUNITY'
  const [showReportForm, setShowReportForm] = useState(false);
  const [userReports, setUserReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [formState, setFormState] = useState({
    area: 'BTM Layout 2nd Stage',
    customArea: '',
    company: '',
    fee: '',
    tactic: 'Fake Walk-In / Registration Fee Demanded',
    notes: '',
  });

  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Attempt backend sync, fallback gracefully
    jobApi.getCampaigns()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (formState.area === 'OTHER' && !formState.customArea.trim()) {
      setFormError('Please specify the custom locality or street name.');
      return;
    }

    if (!formState.company.trim()) {
      setFormError('Please provide the company or consultancy name.');
      return;
    }

    if (!formState.notes.trim()) {
      setFormError('Please add a short note or warning about what happened during the walk-in.');
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      area: formState.area,
      customArea: formState.customArea.trim(),
      company: formState.company.trim(),
      fee: formState.fee.trim() || '₹2,500 – ₹5,000 (Approx)',
      tactic: formState.tactic,
      notes: formState.notes.trim(),
      createdAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const updated = [newReport, ...userReports];
    setUserReports(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save report to localStorage', err);
    }

    setFormSuccess('Scam report published! It has been added to the Bengaluru hotspot intelligence board.');
    setFormState({
      area: 'BTM Layout 2nd Stage',
      customArea: '',
      company: '',
      fee: '',
      tactic: 'Fake Walk-In / Registration Fee Demanded',
      notes: '',
    });

    setTimeout(() => {
      setShowReportForm(false);
      setFormSuccess('');
    }, 2500);
  };

  const handleClearUserReports = () => {
    if (window.confirm('Are you sure you want to clear your reported scam hotspots?')) {
      localStorage.removeItem(STORAGE_KEY);
      setUserReports([]);
    }
  };

  const combinedHotspots = mergeHotspots(BENGALURU_HOTSPOTS, userReports);

  const displayedHotspots = combinedHotspots.filter((item) => {
    if (filter === 'RISK') return item.riskLevel === 'HIGH' || item.riskLevel === 'MEDIUM';
    if (filter === 'SAFE') return item.riskLevel === 'LOW';
    if (filter === 'COMMUNITY') return item.isUserCreated || (item.userReportCount && item.userReportCount > 0);
    return true;
  });

  return (
    <div className="page-container" style={{ maxWidth: '1150px' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
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

        {/* Action Button: Report a Scam */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {userReports.length > 0 && (
            <button
              type="button"
              onClick={handleClearUserReports}
              className="btn btn-secondary btn-sm"
              title="Clear locally added reports"
              style={{ fontSize: '0.8rem' }}
            >
              Reset Reports
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowReportForm(!showReportForm)}
            className="btn btn-primary"
            style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>{showReportForm ? '✕ Close Form' : '🚨 Report a Scam / Add Hotspot'}</span>
          </button>
        </div>
      </div>

      {/* Community Report Form Drawer / Card */}
      {showReportForm && (
        <div className="card" style={{
          marginBottom: '2rem',
          border: '2px solid #ef4444',
          background: '#fffbfb',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                🚨 Report a Fake Consultancy or Scam Hotspot
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                Help fellow students avoid fake walk-in interviews, registration fee traps, and original document withholding.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowReportForm(false)}
              className="btn btn-secondary btn-sm"
            >
              ✕ Close
            </button>
          </div>

          {formError && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>❌ {formError}</div>}
          {formSuccess && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>✅ {formSuccess}</div>}

          <form onSubmit={handleFormSubmit}>
            <div className="auth-row">
              <div className="form-group">
                <label className="form-label" htmlFor="area">
                  Bengaluru Locality / Area *
                </label>
                <select
                  id="area"
                  name="area"
                  className="form-input"
                  value={formState.area}
                  onChange={handleInputChange}
                >
                  {STANDARD_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a === 'OTHER' ? '+ Other Bengaluru Locality (Type below)' : a}
                    </option>
                  ))}
                </select>
              </div>

              {formState.area === 'OTHER' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="customArea">
                    Specific Area / Metro Landmark *
                  </label>
                  <input
                    id="customArea"
                    type="text"
                    name="customArea"
                    className="form-input"
                    placeholder="e.g. Indiranagar CMH Road or Jayanagar 4th Block"
                    value={formState.customArea}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="company">
                  Suspect Company / Consultancy Name *
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  className="form-input"
                  placeholder="e.g. Apex Global HR / Vertex Technologies"
                  value={formState.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="auth-row">
              <div className="form-group">
                <label className="form-label" htmlFor="tactic">
                  Primary Scam Tactic Observed *
                </label>
                <select
                  id="tactic"
                  name="tactic"
                  className="form-input"
                  value={formState.tactic}
                  onChange={handleInputChange}
                >
                  <option value="Fake Walk-In / Registration Fee Demanded">Fake Walk-In / Registration Fee Demanded</option>
                  <option value="Withholding Original Marksheets / Degree Certificates">Withholding Original Marksheets / Degree</option>
                  <option value="Cash Security Deposit for Laptop / Uniform">Cash Deposit for Laptop / Training Uniform</option>
                  <option value="Impersonating Tier-1 MNC (TCS/Infosys) Walk-In">Impersonating Tier-1 MNC (TCS / Infosys)</option>
                  <option value="Telegram / WhatsApp Rating Task Trap">Telegram / WhatsApp Task Trap</option>
                  <option value="Fake Call Letter with Slot Booking Charge">Fake Call Letter with Slot Booking Fee</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fee">
                  Fee Demanded (e.g. ₹3,500)
                </label>
                <input
                  id="fee"
                  type="text"
                  name="fee"
                  className="form-input"
                  placeholder="e.g. ₹3,500 registration or ₹10,000 deposit"
                  value={formState.fee}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">
                Incident Summary & Warning for Students *
              </label>
              <textarea
                id="notes"
                name="notes"
                className="form-textarea"
                rows={3}
                placeholder="Describe what occurred (e.g. They conducted a 2-minute mock interview in a small room and demanded ₹3,000 cash before handing over the appointment letter)..."
                value={formState.notes}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowReportForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: '#dc2626', borderColor: '#b91c1c' }}
              >
                🛡️ Publish Hotspot Report
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {[
          { key: 'ALL', label: `All Areas (${combinedHotspots.length})` },
          { key: 'RISK', label: '🚨 High-Risk Hotspots' },
          { key: 'SAFE', label: '✅ Verified Tech SEZ' },
          ...(userReports.length > 0 ? [{ key: 'COMMUNITY', label: `👥 Community Reports (${userReports.length})` }] : []),
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
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
                        {spot.userReportCount > 0 && (
                          <span style={{
                            display: 'inline-block',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '12px',
                          }}>
                            👥 {spot.userReportCount} Community {spot.userReportCount === 1 ? 'Report' : 'Reports'}
                          </span>
                        )}
                      </div>
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
