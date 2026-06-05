export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

function getAuthHeader() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const isFormData = body instanceof FormData;
  
  const fetchHeaders = {
    ...getAuthHeader(),
    ...headers,
  };
  
  if (!isFormData && !fetchHeaders['Content-Type']) {
    fetchHeaders['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: fetchHeaders,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  auth: {
    register: (payload) => request('/api/auth/register', { method: 'POST', body: payload, headers: { Authorization: undefined } }),
    login: (payload) => request('/api/auth/login', { method: 'POST', body: payload, headers: { Authorization: undefined } }),
    forgotPassword: (payload) => request('/api/auth/forgot-password', { method: 'POST', body: payload, headers: { Authorization: undefined } }),
    resetPassword: (token, payload) => request(`/api/auth/reset-password/${token}`, { method: 'PUT', body: payload, headers: { Authorization: undefined } }),
  },
  profile: {
    create: (payload) => request('/api/profile/create', { method: 'POST', body: payload }),
    getMe: () => request('/api/profile/me', { method: 'GET' }),
    update: (payload) => request('/api/profile/update', { method: 'PUT', body: payload }),
    getPublic: (username) => request(`/api/profile/${username}`, { method: 'GET' }),
    checkUsername: (username) => request(`/api/profile/check-username/${username}`, { method: 'GET' }),
    getSEO: (username) => request(`/api/profile/seo/${username}`, { method: 'GET' }),
    updateTheme: (payload) => request('/api/profile/theme', { method: 'PUT', body: payload }),
  },
  upload: {
    profilePhoto: (formData) => request('/api/upload/profile-photo', { method: 'POST', body: formData }),
    resume: (formData) => request('/api/upload/resume', { method: 'POST', body: formData }),
  },
  ai: {
    generateBio: (payload) => request('/api/ai/generate-bio', { method: 'POST', body: payload }),
    reviewPortfolio: () => request('/api/ai/review', { method: 'GET' }),
    ask: (payload) => request('/api/ai/ask', { method: 'POST', body: payload }),
  },
  github: {
    connect: (payload) => request('/api/github/connect', { method: 'POST', body: payload }),
  },
  qr: {
    get: (username) => request(`/api/qr/${username}`, { method: 'GET' }),
  },
  analytics: {
    track: (payload) => request('/api/analytics/track', { method: 'POST', body: payload }),
    getDashboard: () => request('/api/analytics/dashboard', { method: 'GET' }),
  },
  payment: {
    createOrder: (payload) => request('/api/payment/create-order', { method: 'POST', body: payload }),
    verifyPayment: (payload) => request('/api/payment/verify', { method: 'POST', body: payload }),
  },
  contact: {
    sendMessage: (payload) => request('/api/contact', { method: 'POST', body: payload }),
    getMessages: () => request('/api/contact/my', { method: 'GET' }),
  },
  admin: {
    getDashboard: () => request('/api/admin/dashboard', { method: 'GET' }),
  }
};
