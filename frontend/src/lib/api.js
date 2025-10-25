/* eslint-disable no-empty */
// Resolve API base URL with sensible fallback for dev
const RAW_BASE = import.meta.env.VITE_API_BASE_URL
const isProd = import.meta.env.PROD
const DEFAULT_DEV_BASE = 'http://localhost:8000/api'
// Use same-origin in production to avoid CORS and ensure cookies work
const BASE_URL = (isProd
  ? `${window.location.origin}/api`
  : (RAW_BASE && RAW_BASE.trim() ? RAW_BASE.trim() : DEFAULT_DEV_BASE)
).replace(/\/$/, '')
const LARAVEL_BASE_URL = BASE_URL

// Utility function to construct full image URLs
export const getImageUrl = (photoUrl) => {
  if (!photoUrl) return null
  if (photoUrl.startsWith('http')) return photoUrl
  // Prefer same-origin for relative paths to avoid mixed content when served via HTTPS
  if (photoUrl.startsWith('/')) {
    return `${window.location.origin}${photoUrl}`
  }
  // Fallback: ensure we don't double up /api for storage paths
  const normalized = LARAVEL_BASE_URL.replace(/\/api$/, '')
  return `${normalized}/${photoUrl.replace(/^\/+/, '')}`
}

// CSRF management
let CSRF_TOKEN = null

async function ensureCsrf() {
  if (CSRF_TOKEN) return CSRF_TOKEN
  const res = await fetch(`${LARAVEL_BASE_URL.replace(/\/api$/, '')}/api/csrf`, {
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
    mode: 'cors'
  })
  const data = await res.json()
  CSRF_TOKEN = data?.csrfToken || null
  return CSRF_TOKEN
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`

  // NEW LOGIC: Explicitly identify pre-OTP entry_255081 requests
  const isPreOtpentry_255081 = method === 'POST' && 
                        /\/admin\/entry_255081$/.test(path) && 
                        body && 
                        !body.otp_code &&    // NO OTP present
                        !body.otp && 
                        !body.otpCode

  // Skip CSRF ONLY for pre-OTP entry_255081 requests
  if (method !== 'GET' && !isPreOtpentry_255081) {
    await ensureCsrf()
    if (CSRF_TOKEN) headers['X-CSRF-TOKEN'] = CSRF_TOKEN
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
    })

    if (!res.ok) {
      // Handle auth-related failures centrally
      if (res.status === 401) {
        // Avoid infinite redirects if already on entry_255081
        if (!location.pathname.includes('/admin/entry_255081')) {
          location.href = '/admin/entry_255081'
        }
        const err = new Error('Unauthorized')
        err.status = 401
        throw err
      }
      let data
      try { data = await res.json() } catch { data = null }
      if (res.status === 403) {
        const err = new Error(data?.message || 'Forbidden')
        err.status = 403
        if (data) err.data = data
        throw err
      }
      const msg = data?.message || 'Request failed'
      const err = new Error(msg)
      err.status = res.status
      if (data) err.data = data
      throw err
    }

    return res.json()
  } catch (err) {
    // Network/CORS errors
    const message = (err && err.message === 'Failed to fetch')
      ? 'Network or CORS error'
      : (err?.message || 'Request error')
    // Preserve status/data if present
    const error = new Error(message)
    if (err && typeof err === 'object') {
      if ('status' in err) error.status = err.status
      if ('data' in err) error.data = err.data
    }
    throw error
  }
}

export const api = {
  // Public endpoints
  categories: () => request('/categories'),
  publicCategories: () => request('/categories'),

  positionsByCategory: (categoryId) => request(`/categories/${categoryId}/positions`),
  candidatesByPosition: (positionId) => request(`/positions/${positionId}/candidates`),
  initializeVote: (payload) => request('/vote/initialize', { method: 'POST', body: payload }),
  verifyVote: (reference) => request('/vote/verify', { method: 'POST', body: { reference } }),
  publicResults: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const path = `/public/results${queryString ? `?${queryString}` : ''}`
    return request(path)
  },

  // Admin Auth endpoints (cookie + CSRF)
  adminentry_255081: (email, password, otp = null) => {
    const body = { email, password }
    if (otp) body.otp_code = otp
    return request('/admin/entry_255081', { method: 'POST', body })
  },
  adminLogout: async () => {
    try {
      // Try server logout first
      await request('/admin/logout', { method: 'POST' })
    } catch (error) {
      // Log error but continue cleanup
      console.error('Server logout failed:', error)
    } finally {
      // ALWAYS cleanup, even if server fails
      CSRF_TOKEN = null
      api.clearClientAuth()
    }
  },
  adminProfile: () => request('/admin/profile'),
  updateAdminProfile: (payload) => request('/admin/profile', { method: 'PUT', body: payload }),
  forgotPassword: (payload) => request('/admin/fg-pw_255081', { method: 'POST', body: payload }),
  resetPassword: (payload) => request('/admin/set-pw_255081', { method: 'POST', body: payload }),

  // Admin Dashboard & Results
  adminDashboard: () => request('/admin/dashboard'),
  adminResults: () => request('/admin/results'),
  adminTransactions: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const path = `/admin/transactions${queryString ? `?${queryString}` : ''}`
    return request(path)
  },

  // Admin Candidates Management
  adminCandidates: () => request('/admin/candidates'),
  createCandidate: (payload) => request('/admin/candidates', { method: 'POST', body: payload }),
  updateCandidate: (id, payload) => request(`/admin/candidates/${id}`, { method: 'PUT', body: payload }),
  deleteCandidate: (id) => request(`/admin/candidates/${id}`, { method: 'DELETE' }),

  // Admin Positions Management
  adminPositions: () => request('/admin/positions'),
  createPosition: (payload) => request('/admin/positions', { method: 'POST', body: payload }),
  updatePosition: (id, payload) => request(`/admin/positions/${id}`, { method: 'PUT', body: payload }),
  deletePosition: (id) => request(`/admin/positions/${id}`, { method: 'DELETE' }),

  // Admin Users Management (Super Admin only)
  adminUsers: () => request('/admin/users'),
  createUser: (payload) => request('/admin/users', { method: 'POST', body: payload }),
  updateUser: (id, payload) => request(`/admin/users/${id}`, { method: 'PUT', body: payload }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),

  // Admin Settings (Super Admin only)
  getPublicResultsSettings: () => request('/admin/settings/public-results'),
  updatePublicResultsSettings: (payload) => request('/admin/settings/public-results', { method: 'PUT', body: payload }),

  // Voting Status and Lock Management
  getVotingStatus: () => request('/voting/status'),
  updateVotingLockMessages: (payload) => request('/admin/voting/lock-messages', { method: 'PUT', body: payload }),
  toggleVoting: (payload) => request('/admin/voting/toggle', { method: 'POST', body: payload }),

  // Admin Export
  exportResults: () => request('/admin/export/results'),

  // Generic helpers
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
  
  // CSRF initialization
  ensureCsrf: () => ensureCsrf(),

  // Enhanced cookie cleanup for complete logout
  clearClientAuth: () => {
    try {
      // Clear cookies (best effort; path/domain defaults)
      document.cookie.split(';').forEach((c) => {
        const cookieName = c.trim().split('=')[0]
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      })
    } catch {}
    // Clear local/session storage
    try { localStorage.clear() } catch {}
    try { sessionStorage.clear() } catch {}
  }
}

export default api
