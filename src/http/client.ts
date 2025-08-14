export type RequestConfig = { params?: Record<string, unknown>; headers?: Record<string, string> }

import { API_ENDPOINTS } from '@/constants/api'

const ACCESS_TOKEN_KEY = 'dgt_access_token'
const REFRESH_TOKEN_KEY = 'dgt_refresh_token'

function getAccessToken(): string | null {
  try { return typeof localStorage !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null } catch { return null }
}

function getRefreshToken(): string | null {
  try { return typeof localStorage !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null } catch { return null }
}

export function setAuthTokens(tokens: { accessToken?: string | null; refreshToken?: string | null }) {
  try {
    if (typeof localStorage === 'undefined') return
    if (tokens.accessToken != null) localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    if (tokens.refreshToken != null) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  } catch {}
}

export function clearAuthTokens() {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {}
}

async function doFetch<T>(method: string, url: string, body?: unknown, config?: RequestConfig, _retry?: boolean): Promise<{ data: T }> {
  const base = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE) || ''
  const full = url.startsWith('http') ? url : `${base || ''}${url}`
  const u = new URL(full, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
  if (config?.params) {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries(config.params)) {
      if (v == null || v === '') continue
      if (Array.isArray(v)) v.forEach(item => q.append(k, String(item)))
      else q.append(k, String(v))
    }
    const qs = q.toString()
    if (qs) u.search = u.search ? `${u.search}&${qs}` : `?${qs}`
  }
  const token = getAccessToken()
  const res = await fetch(u.toString(), {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(config?.headers || {}) },
    body: body == null || method === 'GET' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    credentials: 'include',
  })
  const text = await res.text()
  let data: any
  try { data = text ? JSON.parse(text) : undefined } catch { data = text }
  if (!res.ok) {
    // 401 처리: refreshToken으로 재발급 후 1회 재시도
    if (res.status === 401 && !_retry) {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        try {
          const refreshRes = await fetch(new URL(((API_ENDPOINTS || {}).AUTH || {}).REFRESH || '/v1/auth/refresh', u).toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
            credentials: 'include',
          })
          const refreshText = await refreshRes.text()
          let refreshData: any
          try { refreshData = refreshText ? JSON.parse(refreshText) : undefined } catch { refreshData = refreshText }
          if (refreshRes.ok && refreshData && refreshData.data) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshData.data as { accessToken?: string; refreshToken?: string }
            if (newAccessToken) setAuthTokens({ accessToken: newAccessToken })
            if (newRefreshToken) setAuthTokens({ refreshToken: newRefreshToken })
            return await doFetch<T>(method, url, body, config, true)
          }
        } catch {}
      }
    }
    throw { status: res.status, statusText: res.statusText, data }
  }
  return { data }
}

const apiClient = {
  get<T>(url: string, config?: RequestConfig) { return doFetch<T>('GET', url, undefined, config) },
  post<T>(url: string, data?: unknown, config?: RequestConfig) { return doFetch<T>('POST', url, data, config) },
  put<T>(url: string, data?: unknown, config?: RequestConfig) { return doFetch<T>('PUT', url, data, config) },
  delete<T>(url: string, data?: unknown, config?: RequestConfig) { return doFetch<T>('DELETE', url, data, config) },
}

export default apiClient


