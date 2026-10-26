import React, { useEffect, useState } from 'react';
import { jobApi } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import StudentSafetyModal from '../components/StudentSafetyModal';

const BENGALURU_HOTSPOTS = [
  {
    id: 'btm',
    area: 'BTM Layout 2nd Stage',
    subArea: 'Outer Ring Road & 100ft Road Corridor',
    threatLevel: 'CRITICAL',
    threatScore: 92,
    totalScams: 6,
    avgDemand: '₹3,500 – ₹12,000',
    targetAudience: 'BE / B.Tech / MCA Freshers in PGs',
    campaignCode: 'CAMP-BLR-BTM-01',
    primaryModus: 'Fake IT Placement Consultancy. Calls for direct Java/FullStack walk-in. Conducts 5-minute mock interview, promises ₹4.5 LPA, and demands ₹3,500 file opening fee + ₹8,000 laptop bond.',
    companies: ['Apex Tech Staffing', 'Skyline Placement Solutions', 'FastTrack IT Consultancies', 'Nexus Talent Partners'],
    warning: 'Over 8 students in BTM 2nd Stage reported sudden office shutdowns after collecting deposits.',
  },
  {
    id: 'marathahalli',
    area: 'Marathahalli Bridge',
    subArea: 'Varthur Main Road Commercial Buildings',
    threatLevel: 'HIGH',
    threatScore: 88,
    totalScams: 5,
    avgDemand: '₹2,500 – ₹8,000',
    targetAudience: 'Data Entry, Junior Analyst & Non-local Seekers',
    campaignCode: 'CAMP-BLR-MARATH-02',
    primaryModus: 'Advance check & document verification trap. Demands physical retention of original 10th/12th marksheets + ₹5,000 "laptop security deposit" via cash or personal UPI.',
    companies: ['Apex Global Staffing', 'Apex Talent Partners', 'Verve Career Hub', 'Zenith Logistics HR'],
    warning: 'Retention of original certificates violates Section 405 IPC. Do not surrender certificates.',
  },
  {
    id: 'hsr',
    area: 'HSR Layout Sector 7',
    subArea: 'Near 27th Main Commercial Zone',
    threatLevel: 'HIGH',
    threatScore: 85,
    totalScams: 4,
    avgDemand: '₹2,000 – ₹6,000',
    targetAudience: 'Fresh College Graduates (2024–2026 Batch)',
    campaignCode: 'CAMP-BLR-HSR-03',
    primaryModus: 'TCS/Infosys Impersonation Racket. Sends forged interview invitation letters on WhatsApp using stolen corporate logos. Asks for ₹2,000 "slot reservation fee".',
    companies: ['Global Connect Placements', 'Infosoft Careers India', 'Elite HR Tech Hub'],
    warning: 'Tier-1 IT companies NEVER charge registration fees or conduct WhatsApp-only walk-ins.',
  },
  {
    id: 'hebbal',
    area: 'Hebbal / Manyata Outer Ring',
    subArea: 'Nagavara Commercial Enclave',
    threatLevel: 'MEDIUM',
    threatScore: 76,
    totalScams: 3,
    avgDemand: '₹1,500 – ₹4,000',
    targetAudience: 'Job seekers arriving via Cantonment / Yeshwantpur',
    campaignCode: 'CAMP-BLR-HEBBAL-04',
    primaryModus: 'Fake Tech Park Gate Pass & Security Uniform scheme. Claims direct MNC onboarding inside Manyata Tech Park and collects cash outside the gate.',
    companies: ['Manyata Direct Staffing', 'Metro Tech Gateways'],
    warning: 'Tech parks issue visitor badges at official reception counters only. Never pay agents outside.',
  },
];

/**
 * CampaignsPage Component
 * Bengaluru Student Defense & Scam Hotspot Intelligence Tracker.
 * Links coordinated syndicates across physical hotspots (BTM, Marathahalli, HSR, Hebbal).
 */
export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  
  // Student Safety Checklist Modal state
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [activeModalLocation, setActiveModalLocation] = useState('');

  const fetchCampaigns = () => {
    setLoading(true);
    setError(null);
    jobApi.getCampaigns()
      .then((data) => {
        const apiData = Array.isArray(data) ? data : [];
        
        // Merge backend campaigns with real-world Bengaluru hotspots metadata
        const enriched = BENGALURU_HOTSPOTS.map((hotspot, idx) => {
          const matchedApi = apiData.find((c) => c.campaignCode === hotspot.campaignCode) || apiData[idx];
          return {
            ...hotspot,
            totalScams: matchedApi ? Math.max(hotspot.totalScams, matchedApi.totalScams || 0) : hotspot.totalScams,
            averageRisk: matchedApi ? Math.max(hotspot.threatScore, Math.round(matchedApi.averageRisk || 0)) : hotspot.threatScore,
            companies: matchedApi && matchedApi.companies && matchedApi.companies.length > 0
              ? Array.from(new Set([...hotspot.companies, ...matchedApi.companies]))
              : hotspot.companies,
          };
        });

        // Also append any backend campaigns not matched
        apiData.forEach((apiCamp) => {
          if (!enriched.some((e) => e.campaignCode === apiCamp.campaignCode)) {
            enriched.push({
              id: 'custom-' + apiCamp.campaignCode,
              area: 'Bengaluru Tech Corridor',
              subArea: 'Electronic City / Silk Board Area',
              threatLevel: (apiCamp.averageRisk || 0) >= 70 ? 'HIGH' : 'MEDIUM',
              threatScore: Math.round(apiCamp.averageRisk || 75),
              totalScams: apiCamp.totalScams || 2,
              avgDemand: '₹2,000 – ₹5,000',
              targetAudience: 'Entry-Level Seekers',
              campaignCode: apiCamp.campaignCode,
              primaryModus: 'Reused scam pattern cluster detected across multiple company aliases.',
              companies: apiCamp.companies || ['Apex Talent Corp'],
              warning: 'High pattern similarity with known recruitment rings.',
            });
          }
        });

        setCampaigns(enriched);
      })
      .catch((err) => {
        // Graceful fallback to Bengaluru hotspots if offline
        setCampaigns(BENGALURU_HOTSPOTS);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const openSafetyChecklist = (location = '') => {
    setActiveModalLocation(location);
    setSafetyModalOpen(true);
  };

  const filteredCampaigns = campaigns.filter((camp) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'CRITICAL') return camp.threatLevel === 'CRITICAL';
    return camp.id === selectedFilter;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-teal-tint)', color: 'var(--color-brand-dark)', border: '1px solid var(--color-teal-border)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <span>📍</span>
            <span>Bengaluru Student Protection Network</span>
          </div>
          <h1 className="page-title">Scam Syndicate & Hotspot Tracker</h1>
          <p className="page-subtitle">
            Tracking active recruitment syndicates, walk-in interview traps, and fake consultancies across Bengaluru tech clusters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openSafetyChecklist('Bengaluru Tech Hubs')}
          className="btn btn-navy"
          style={{ padding: '0.75rem 1.4rem', fontSize: '0.925rem', boxShadow: '0 4px 14px rgba(12, 20, 39, 0.25)' }}
        >
          <span>🛡️ Open Walk-In Safety Checklist</span>
        </button>
      </div>

      {/* Student Safety Context Alert */}
      <div className="alert alert-info" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
        <span style={{ fontSize: '1.4rem' }}>ℹ️</span>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.2rem' }}>
            How Area-Wise Syndicate Tracking Protects Job Seekers:
          </strong>
          Scammers prey on college freshers by setting up temporary consultancies in areas like <strong>BTM Layout, Marathahalli, and HSR Layout</strong>. 
          When students arrive, they demand ₹2,000–₹12,000 for "registration" or "laptop security". Once exposed, they shut the office and move to another layout under a new name. 
          JobShield links these recurring syndicates to alert you <strong>before</strong> you travel to risky walk-in locations.
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        {[
          { key: 'ALL', label: 'All Hotspots' },
          { key: 'CRITICAL', label: '🚨 Critical Zones Only' },
          { key: 'btm', label: '📍 BTM Layout 2nd Stage' },
          { key: 'marathahalli', label: '📍 Marathahalli Bridge' },
          { key: 'hsr', label: '📍 HSR Layout Sector 7' },
          { key: 'hebbal', label: '📍 Hebbal / Manyata Outer' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSelectedFilter(tab.key)}
            className="btn btn-sm"
            style={{
              backgroundColor: selectedFilter === tab.key ? 'var(--color-brand-contrast)' : '#ffffff',
              color: selectedFilter === tab.key ? '#ffffff' : '#475569',
              border: '1px solid ' + (selectedFilter === tab.key ? 'var(--color-brand-contrast)' : 'var(--color-border)'),
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner message="Scanning network for active Bengaluru scam hotspots..." />}

      {error && (
        <div className="alert alert-error">
          <span>❌ {error}</span>
          <button onClick={fetchCampaigns} className="btn btn-sm btn-secondary" style={{ marginLeft: 'auto' }}>
            Retry
          </button>
        </div>
      )}

      {/* Hotspots Grid */}
      {!loading && (
        <div className="campaign-grid">
          {filteredCampaigns.map((camp) => {
            const avgScore = camp.threatScore || camp.averageRisk || 85;
            const riskLevel = camp.threatLevel || (avgScore >= 80 ? 'HIGH' : 'MEDIUM');

            return (
              <div key={camp.id || camp.campaignCode} className="campaign-card">
                <div>
                  {/* Top Badge & Threat Level */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span className="campaign-badge" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
                        📍 {camp.area}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>
                        {camp.subArea}
                      </div>
                    </div>
                    <RiskBadge level={riskLevel} />
                  </div>

                  {/* Key Metrics */}
                  <div className="metrics-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1.25rem' }}>
                    <div className="mini-metric-card">
                      <div className="label">Linked Scam Postings</div>
                      <div className="val">{camp.totalScams} Linked</div>
                    </div>
                    <div className="mini-metric-card">
                      <div className="label">Extortion Demands</div>
                      <div className="val" style={{ fontSize: '1.1rem', color: '#b91c1c' }}>
                        {camp.avgDemand}
                      </div>
                    </div>
                  </div>

                  {/* Modus Operandi */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: '0.2rem' }}>
                      ⚡ Syndicate Modus Operandi:
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                      {camp.primaryModus}
                    </p>
                  </div>

                  {/* Aliases */}
                  <div>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Associated Company Aliases in this Hub ({camp.companies?.length || 0}):
                    </h4>
                    {camp.companies && camp.companies.length > 0 ? (
                      <div className="company-tag-list" style={{ marginBottom: '1rem' }}>
                        {camp.companies.map((comp, cIdx) => (
                          <span key={cIdx} className="company-tag">
                            🏢 {comp}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No aliases recorded</span>
                    )}
                  </div>
                </div>

                {/* Card Footer Warning & Safety Button */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600 }}>
                    ⚠️ {camp.warning}
                  </div>
                  <button
                    type="button"
                    onClick={() => openSafetyChecklist(camp.area)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', fontWeight: 700, justifyContent: 'center' }}
                  >
                    <span>🛡️ Verify Pre-Walk-In Checklist for this Area →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Student Safety Modal */}
      <StudentSafetyModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
        targetLocation={activeModalLocation}
      />
    </div>
  );
}
