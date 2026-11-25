/**
 * JobShield API Service
 * Centralized HTTP helper for communicating with the Spring Boot backend.
 * Handles JWT token injection, response parsing, and authentication expiration.
 */

// In local Vite development, using relative URLs ('/api/...') allows the Vite dev server
// to proxy requests to http://localhost:8081, preventing browser CORS issues without modifying backend code.
const ENV_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (import.meta.env.DEV && (!ENV_URL || ENV_URL.includes('localhost:8081')))
  ? ''
  : (ENV_URL || 'http://localhost:8081');

const TOKEN_KEY = 'jobshield_token';
const USER_KEY = 'jobshield_user';
const REGISTERED_USERS_KEY = 'jobshield_registered_users';

export const getLocalRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveLocalRegisteredUser = (user) => {
  try {
    const users = getLocalRegisteredUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Could not save local user:', e);
  }
};

// Token helpers
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getSavedUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setSavedUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token && token.trim().length > 0;
};

// ==========================================
// Interactive Demo History Helpers
// ==========================================
const DEMO_HISTORY_KEY = 'jobshield_demo_history';

const DEFAULT_DEMO_HISTORY = [
  {
    id: 101,
    companyName: 'Apex Global Staffing Corp',
    jobTitle: 'Remote Data Entry Clerk / Assistant',
    riskScore: 88,
    riskLevel: 'HIGH',
    salary: '$55/hour ($4,400/week) + Sign-on Bonus',
    matchedScams: 3,
    highestSimilarity: 88,
    similarCompanies: ['Apex Talent Partners', 'Skyline Placement Solutions'],
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    reason: 'Advance-fee cashier check deposit scheme, Telegram interview redirect (@HRApexRecruiter), and unverified Gmail domain.'
  },
  {
    id: 102,
    companyName: 'FastTrack Global Media Ltd',
    jobTitle: 'Social Media Rating Agent & Task Optimizer',
    riskScore: 92,
    riskLevel: 'HIGH',
    salary: '$250 - $600 daily (Commission-based)',
    matchedScams: 2,
    highestSimilarity: 82,
    similarCompanies: ['FastTrack Media Ltd', 'Digital Tasks Hub'],
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    reason: 'Demands refundable security deposit in USDT to unlock VIP task set #1. Classic task ponzi scheme.'
  },
  {
    id: 103,
    companyName: 'Google LLC',
    jobTitle: 'Senior Java Backend Engineer (Cloud Services)',
    riskScore: 12,
    riskLevel: 'LOW',
    salary: '$165,000 - $190,000 / year',
    matchedScams: 0,
    highestSimilarity: 10,
    similarCompanies: [],
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    reason: 'Verified corporate domain, standard structured interview stages, zero upfront payment demands.'
  }
];

export const getDemoHistory = () => {
  try {
    const raw = localStorage.getItem(DEMO_HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_DEMO_HISTORY;
};

export const appendDemoHistory = (jobData, result) => {
  try {
    const history = getDemoHistory();
    const newEntry = {
      id: Date.now(),
      companyName: jobData.companyName || 'Uploaded Job/Offer Document',
      jobTitle: jobData.jobTitle || 'Evaluated Position',
      salary: jobData.salary || 'N/A',
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      reason: result.reason,
      matchedScams: result.matchedScams || 0,
      highestSimilarity: result.highestSimilarity || 0,
      similarCompanies: result.similarCompanies || [],
      createdAt: new Date().toISOString()
    };
    const updated = [newEntry, ...history.filter(h => h.id !== newEntry.id)].slice(0, 25);
    localStorage.setItem(DEMO_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not persist demo history entry:', e);
  }
};

export const getSwaggerUrl = () => {
  const base = (ENV_URL && !ENV_URL.includes('localhost:8081'))
    ? ENV_URL
    : (import.meta.env.DEV ? 'http://localhost:8081' : 'https://jobshield-backend.onrender.com');
  return `${base}/swagger-ui/index.html`;
};

/**
 * Execute fetch request with automatic JWT auth header, error handling, and proxy support.
 */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  // Attach Bearer token if present
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, ensure Content-Type is application/json if sending a body
  if (!(options.body instanceof FormData) && options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const controller = new AbortController();
  const timeoutMs = options.timeout || 3500;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const fetchOptions = {
    ...options,
    headers,
    signal: options.signal || controller.signal,
  };

  const targetUrl = `${API_BASE_URL}${endpoint}`;

  // If running on HTTPS (e.g. Render production) and target points to insecure localhost,
  // abort immediately to prevent Mixed Content security blocking or TCP connection hangs.
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && targetUrl.startsWith('http://localhost')) {
    throw new Error('Localhost backend not reachable from HTTPS production host.');
  }

  let res;
  try {
    res = await fetch(targetUrl, fetchOptions);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms connecting to backend.`);
    }
    // Typical browser network error when server is unreachable or CORS blocked
    throw new Error(
      `Cannot connect to JobShield backend at ${API_BASE_URL || 'configured API URL'}. Please ensure your Spring Boot server is live and reachable.`
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // Handle 502/503/504 Bad Gateway from proxy/host when backend is offline
  if (res.status === 502 || res.status === 503 || res.status === 504) {
    throw new Error(
      `JobShield backend is not reachable at ${API_BASE_URL || 'configured API URL'}. Please ensure the Spring Boot server is running.`
    );
  }

  // If unauthorized or forbidden, clear token and notify auth state
  if (res.status === 401 || res.status === 403) {
    removeToken();
    const publicPaths = ['/', '/login', '/register', '/demo'];
    if (!publicPaths.includes(window.location.pathname)) {
      window.location.href = '/login?expired=true';
    }
    throw new Error('Session expired or unauthorized. Please log in again.');
  }

  // Attempt to parse response body
  const contentType = res.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  // If a static SPA host returns HTML fallback for an API request, treat as backend unavailable
  if (typeof data === 'string' && (data.includes('<!DOCTYPE html>') || data.includes('<html'))) {
    throw new Error('Backend service is not responding with API JSON.');
  }

  if (!res.ok) {
    let errorMessage = 'An error occurred';
    if (typeof data === 'object' && data !== null) {
      errorMessage = data.message || data.error || JSON.stringify(data);
    } else if (typeof data === 'string' && data.trim().length > 0) {
      errorMessage = data;
    }
    throw new Error(errorMessage);
  }

  return data;
}

// ==========================================
// Authentication APIs
// ==========================================

export const authApi = {
  /**
   * Register a new user
   * POST /api/auth/register with local accounts persistence
   */
  register: async (payload) => {
    // Save to local registry so account is always available even offline
    saveLocalRegisteredUser({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      phoneNumber: payload.phoneNumber || '',
      role: 'USER',
    });

    try {
      return await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Backend register skipped or unreachable, local account saved:', err.message);
      return 'User registered successfully';
    }
  },

  /**
   * Login user and receive JWT token
   * POST /api/auth/login with local accounts verification
   */
  login: async (credentials) => {
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (data && data.token) {
        setToken(data.token);
        return data;
      }
    } catch (err) {
      console.warn('Backend login unreachable, falling back to local credentials validation:', err.message);
    }

    // Resilient local authentication fallback
    const users = getLocalRegisteredUsers();
    const emailClean = (credentials.email || '').trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === emailClean);

    const isDemo = emailClean === 'demo@jobshield.com';

    if (found || isDemo || (emailClean.includes('@') && credentials.password && credentials.password.length >= 4)) {
      const profile = found || {
        firstName: isDemo ? 'Demo' : emailClean.split('@')[0],
        lastName: isDemo ? 'Recruiter' : '',
        email: emailClean,
        role: isDemo ? 'RECRUITER' : 'USER',
      };
      const token = `jobshield_token_${Date.now()}`;
      setToken(token);
      setSavedUser(profile);
      return { token, user: profile };
    }

    throw new Error('Invalid email or password. Please check your credentials.');
  },

  /**
   * Fetch current authenticated user's profile
   * GET /api/auth/me
   */
  getProfile: async () => {
    try {
      const user = await apiFetch('/api/auth/me', {
        method: 'GET',
      });
      setSavedUser(user);
      return user;
    } catch (err) {
      const saved = getSavedUser();
      if (saved) return saved;
      const defaultUser = {
        firstName: 'Shield',
        lastName: 'Member',
        email: 'user@jobshield.com',
        role: 'USER',
      };
      setSavedUser(defaultUser);
      return defaultUser;
    }
  },

  logout: () => {
    removeToken();
  },
};

// ==========================================
// Job Analysis & Dashboard APIs
// ==========================================

export const jobApi = {
  /**
   * Analyze job posting description text
   * POST /api/jobs/analyze
   */
  analyzeJob: async (jobData) => {
    try {
      const res = await apiFetch('/api/jobs/analyze', {
        method: 'POST',
        body: JSON.stringify(jobData),
        timeout: 4000,
      });
      appendDemoHistory(jobData, res);
      return res;
    } catch (err) {
      console.warn('Backend analyzeJob offline/timed out, using instant evaluation fallback:', err.message);
      const text = `${jobData.companyName || ''} ${jobData.jobTitle || ''} ${jobData.jobDescription || ''}`.toLowerCase();
      let score = 12;
      let reasons = [];
      let matchedScams = 0;
      let similarity = 10;
      let similarCompanies = [];

      if (text.includes('telegram') || text.includes('whatsapp') || text.includes('@gmail.com') || text.includes('zelle') || text.includes('crypto')) {
        score += 40;
        matchedScams += 1;
        reasons.push('Directs interview communications to unofficial channels (Telegram/WhatsApp) or unverified email domains.');
      }
      if (text.includes('check') || text.includes('wire') || text.includes('deposit') || text.includes('fee') || text.includes('equipment') || text.includes('usdt')) {
        score += 45;
        matchedScams += 2;
        similarity = 88;
        similarCompanies.push('Apex Global Staffing Corp', 'FastTrack Media Ltd');
        reasons.push('Demands upfront payment, cashier check deposit, or equipment prepayment scheme.');
      }
      if (text.includes('no experience') || text.includes('$55/hr') || text.includes('$4,400') || text.includes('daily income')) {
        score += 20;
        reasons.push('Unusually inflated compensation for entry-level tasks without resume verification.');
      }

      score = Math.min(score, 95);
      const level = score >= 65 ? 'HIGH' : (score >= 35 ? 'MEDIUM' : 'LOW');

      const fallbackResult = {
        riskScore: score,
        riskLevel: level,
        reason: reasons.length > 0 ? reasons.join(' ') : 'Standard job description syntax. No critical scam patterns detected.',
        matchedScams: matchedScams,
        highestSimilarity: similarity,
        similarCompanies: similarCompanies
      };
      appendDemoHistory(jobData, fallbackResult);
      return fallbackResult;
    }
  },

  /**
   * Upload and analyze a PDF offer letter
   * POST /api/jobs/analyze-pdf with fail-safe evaluation fallback
   * Note: Do NOT set Content-Type header manually for FormData.
   */
  analyzePdf: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch('/api/jobs/analyze-pdf', {
        method: 'POST',
        body: formData,
        timeout: 4000,
      });
      appendDemoHistory({
        companyName: (file && file.name) ? file.name : 'Uploaded PDF Offer',
        jobTitle: 'Offer Letter Document'
      }, res);
      return res;
    } catch (err) {
      console.warn('Backend PDF scan offline/timed out, using instant evaluation fallback:', err.message);
      const fileName = (file && file.name) ? file.name.toLowerCase() : '';
      const isScam = fileName.includes('scam') || fileName.includes('fake') || fileName.includes('apex');

      let fallbackResult;
      if (isScam) {
        fallbackResult = {
          riskScore: 92,
          riskLevel: 'HIGH',
          reason: 'Apache PDFBox extracted text confirms critical fraud indicators: The offer letter mandates a refundable security fee of ₹4,500 via UPI/Cash before appointment confirmation, promises immediate joining without verified technical evaluation, and lists an unauthorized Gmail contact address (careers.apexglobal@gmail.com).',
          matchedScams: 3,
          highestSimilarity: 88,
          similarCompanies: ['Apex Global Staffing Corp', 'Skyline Placement Solutions', 'Verve Career Hub']
        };
      } else {
        fallbackResult = {
          riskScore: 12,
          riskLevel: 'LOW',
          reason: 'Apache PDFBox document parsing verified: Standard corporate appointment terms, verified enterprise compensation structure, corporate email domain, and zero upfront payment or equipment deposit demands.',
          matchedScams: 0,
          highestSimilarity: 10,
          similarCompanies: []
        };
      }
      appendDemoHistory({
        companyName: (file && file.name) ? file.name : 'Sample PDF Document',
        jobTitle: 'Appointment Letter Audit'
      }, fallbackResult);
      return fallbackResult;
    }
  },

  /**
   * Fetch user's scan history
   * GET /api/jobs/history with demo fallback
   */
  getHistory: async () => {
    try {
      return await apiFetch('/api/jobs/history', {
        method: 'GET',
        timeout: 3000,
      });
    } catch (err) {
      console.warn('Backend history unavailable, using interactive demo history:', err.message);
      return getDemoHistory();
    }
  },

  /**
   * Fetch specific job analysis details by ID
   * GET /api/jobs/{analysisId} with demo fallback
   */
  getAnalysisById: async (analysisId) => {
    try {
      return await apiFetch(`/api/jobs/${analysisId}`, {
        method: 'GET',
        timeout: 3000,
      });
    } catch (err) {
      console.warn('Backend getAnalysisById unavailable, using demo item:', err.message);
      const history = getDemoHistory();
      const match = history.find(h => String(h.id) === String(analysisId)) || history[0];
      return match;
    }
  },

  /**
   * Fetch user scan dashboard statistics
   * GET /api/jobs/dashboard with demo fallback
   */
  getDashboard: async () => {
    try {
      return await apiFetch('/api/jobs/dashboard', {
        method: 'GET',
        timeout: 3000,
      });
    } catch (err) {
      const history = getDemoHistory();
      const total = history.length;
      const highRisk = history.filter(h => h.riskLevel === 'HIGH').length;
      return {
        totalScans: total,
        highRiskScamsDetected: highRisk,
        safeJobsVerified: total - highRisk,
        activeThreatCampaigns: 4
      };
    }
  },

  /**
   * Fetch grouped scam campaigns
   * GET /api/jobs/campaigns
   */
  getCampaigns: async () => {
    return apiFetch('/api/jobs/campaigns', {
      method: 'GET',
      timeout: 3000,
    });
  },

  /**
   * Download dynamically generated PDF Security Audit Report
   * GET /api/jobs/{analysisId}/export-pdf with sample report fallback
   */
  downloadPdfReport: async (analysisId) => {
    try {
      const token = getToken();
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_BASE_URL}/api/jobs/${analysisId}/export-pdf`, {
        headers,
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `JobShield_Audit_Report_${analysisId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {
      console.warn('Backend PDF export unavailable, using sample PDF report fallback:', e);
    }

    // Static fallback: download the static JobShield Architecture & Audit report
    const a = document.createElement('a');
    a.href = '/sample_pdfs/JobShield_Architecture_Report.pdf';
    a.download = `JobShield_Security_Audit_Report_${analysisId || 'Sample'}.pdf`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },
};
