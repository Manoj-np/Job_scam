import React, { useState } from 'react';

const CHECKLIST_ITEMS = [
  {
    id: 'walkInNoScreening',
    label: 'Direct Walk-In Without Prior Technical Screening',
    desc: 'You received an instant interview call without applying officially, without an online coding test, or without an HR phone verification.',
    severity: 'medium',
  },
  {
    id: 'unverifiedLocation',
    label: 'Office in Rented Flat / Small Commercial Complex',
    desc: 'The interview location is a 1-room office in a local commercial building (e.g., BTM, Marathahalli) rather than a registered tech park / corporate SEZ.',
    severity: 'high',
  },
  {
    id: 'moneyDemand',
    label: 'Demand for Upfront Registration, Training, or Laptop Fee',
    desc: 'They ask for ₹1,000 to ₹15,000 under the pretext of "file opening", "background check", "training bond", or "refundable laptop security deposit".',
    severity: 'critical',
  },
  {
    id: 'originalCertificates',
    label: 'Retention of Original Educational Marksheets',
    desc: 'They demand to collect your original 10th/12th/Degree certificates. (Holding original certificates is strictly ILLEGAL under Indian Labor Law).',
    severity: 'critical',
  },
  {
    id: 'instantOffer',
    label: '5-Minute Generic Interview Followed by Instant Offer',
    desc: 'The interviewer asks basic personal questions for 5 minutes and immediately claims you are selected with a high starting salary (₹30,000–₹50,000/mo).',
    severity: 'high',
  },
  {
    id: 'telegramWhatsappOnly',
    label: 'Communication Restricted to Telegram / Personal UPI',
    desc: 'No official @company.com email domain. All instructions, fees, and updates come from personal WhatsApp numbers or Telegram handles.',
    severity: 'high',
  },
];

/**
 * StudentSafetyModal Component
 * Interactive Pre-Walk-In safety checklist to protect students and freshers
 * entering high-risk consultancy hotspots (e.g., Bengaluru clusters).
 */
export default function StudentSafetyModal({ isOpen, onClose, targetLocation }) {
  const [checked, setChecked] = useState({});

  if (!isOpen) return null;

  const toggleCheck = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  let riskTier = {
    level: 'LOW',
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    title: '✓ Safe Signs Observed',
    message: 'Always remember: Legitimate corporate employers NEVER charge candidates for hiring or interviews.',
  };

  if (checkedCount >= 3) {
    riskTier = {
      level: 'CRITICAL',
      color: '#ef4444',
      bg: '#fef2f2',
      border: '#fecaca',
      title: '🚨 CRITICAL FRAUD ALERT — DO NOT PROCEED',
      message: 'High probability of a fake placement consultancy extortion racket. DO NOT pay any money, DO NOT surrender original marksheets, and do NOT sign blank papers.',
    };
  } else if (checkedCount >= 1) {
    riskTier = {
      level: 'CAUTION',
      color: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a',
      title: '⚠️ Suspicious Red Flags Detected',
      message: 'Significant warning signs identified. Proceed with extreme caution and never hand over cash or original documents.',
    };
  }

  const handleShareWhatsApp = () => {
    const locText = targetLocation ? ` at ${targetLocation}` : '';
    const shareMessage = encodeURIComponent(
      `⚠️ JobShield Student Safety Alert:\n` +
      `I am heading for an interview${locText}.\n` +
      `JobShield Red Flag Score: ${checkedCount}/6 Warning Flags Detected.\n\n` +
      `Important Safety Rules for Students:\n` +
      `1. NEVER pay any registration, file, or laptop security deposit.\n` +
      `2. NEVER hand over original marksheets/certificates.\n\n` +
      `If in trouble, call National Cybercrime Helpline: 1930 or Police: 112.`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareMessage}`, '_blank');
  };

  const handleReset = () => {
    setChecked({});
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        <div className="modal-header" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🛡️</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Student Pre-Walk-In Safety Checklist
              </h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.2rem 0 0' }}>
              Bengaluru Tech Hub & PG Student Protection Guide {targetLocation ? `• 📍 ${targetLocation}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.65rem' }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Risk Level Banner */}
          <div
            style={{
              background: riskTier.bg,
              border: `1px solid ${riskTier.border}`,
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
            }}
          >
            <div style={{ fontSize: '1.6rem' }}>
              {checkedCount >= 3 ? '🚨' : checkedCount >= 1 ? '⚠️' : '✅'}
            </div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: riskTier.color }}>
                  {riskTier.title}
                </h4>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '20px',
                    background: riskTier.color,
                    color: '#ffffff',
                  }}
                >
                  {checkedCount}/6 Red Flags
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#334155', margin: '0.35rem 0 0', lineHeight: 1.5 }}>
                {riskTier.message}
              </p>
            </div>
          </div>

          {/* Interactive Checklist Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Check All That Apply Before Entering The Office:
              </span>
              {checkedCount > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  style={{ fontSize: '0.75rem', color: 'var(--color-brand)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Reset Checklist
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {CHECKLIST_ITEMS.map((item) => {
                const isSelected = !!checked[item.id];
                return (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      border: isSelected ? '1px solid #fecaca' : '1px solid #e2e8f0',
                      background: isSelected ? '#fff5f5' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCheck(item.id)}
                      style={{ marginTop: '0.2rem', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isSelected ? '#b91c1c' : '#0f172a' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem', lineHeight: 1.45 }}>
                        {item.desc}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Golden Rules For Students */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
            <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
              ⚖️ Indian Labor Law & Cyber Police Guidelines:
            </h5>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
              <li><strong>No Legitimate Company Demands Fees:</strong> Genuine IT companies (Infosys, TCS, Wipro, Google, etc.) have strict policies against charging candidates at any stage.</li>
              <li><strong>Retention of Marksheets is Illegal:</strong> Holding original educational certificates to force students to pay or join violates Section 405 of the Indian Penal Code.</li>
              <li><strong>Always Verify Registered GSTIN/CIN:</strong> Check the company name on the Ministry of Corporate Affairs (MCA) portal before visiting.</li>
            </ul>
          </div>

          {/* Quick Helplines */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: '#eef2ff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #c7d2fe', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#4361ee', fontWeight: 700 }}>National Cybercrime Helpline</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1e40af' }}>📞 1930</div>
            </div>
            <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '8px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>Police Emergency (Bengaluru)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#065f46' }}>🚓 112</div>
            </div>
            <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>National Cyber Portal</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#92400e' }}>🌐 cybercrime.gov.in</div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="btn btn-sm"
            style={{
              background: '#25D366',
              color: '#ffffff',
              fontWeight: 700,
              padding: '0.5rem 1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>📲</span>
            <span>Share Safety Alert to WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-navy btn-sm"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
}
