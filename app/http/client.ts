export type RequestConfig = { params?: Record<string, unknown>; headers?: Record<string, string> }

import { API_ENDPOINTS } from '@/constants/api'
import { TokenManager } from '@/lib/token-manager'

export function getMemberIdFromToken(): string | null {
  try {
    const token = TokenManager.getAccessToken()
    if (!token) return null
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedJson = typeof atob !== 'undefined' ? atob(base64) : ''
    if (!decodedJson) return null
    const decoded = JSON.parse(decodedJson)
    return decoded?.id || null
  } catch { return null }
}

// TokenManager로 위임하는 호환성 함수들
export function setAuthTokens(tokens: { accessToken?: string | null; refreshToken?: string | null }) {
  try {
    if (tokens.accessToken) {
      const userData = TokenManager.getUserData() || { id: 'unknown', email: 'unknown' }
      TokenManager.setTokens(
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken || undefined
        },
        userData
      )
    }
  } catch (error) {
    console.error('setAuthTokens 실패:', error)
  }
}

export function clearAuthTokens() {
  TokenManager.clearTokens()
}

async function doFetch<T>(method: string, url: string, body?: unknown, config?: RequestConfig, _retry?: boolean): Promise<{ data: T }> {
  const base = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE) || ''
  const full = url.startsWith('http') ? url : `${base || ''}${url}`
  const u = new URL(full, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
  
  // URL 파라미터 설정
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

  const isAuthEndpoint = u.pathname.startsWith('/v1/auth/login') || u.pathname.startsWith('/v1/auth/refresh')
  
  // TokenManager를 통한 유효한 토큰 확보
  let authHeader: string | null = null
  if (!isAuthEndpoint) {
    const validToken = await TokenManager.ensureValidToken()
    if (validToken) {
      authHeader = `Bearer ${validToken}`
    }
  }

  const res = await fetch(u.toString(), {
    method,
    headers: { 
      'Content-Type': 'application/json', 
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(config?.headers || {}) 
    },
    body: body == null || method === 'GET' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    credentials: 'include',
  })

  const text = await res.text()
  let data: any
  try { 
    data = text ? JSON.parse(text) : undefined 
  } catch { 
    data = text 
  }

  if (!res.ok) {
    // 401 처리: TokenManager의 자동 갱신이 실패했을 경우에만 여기 도달
    if (res.status === 401 && !_retry && !isAuthEndpoint) {
      // TokenManager로 한번 더 갱신 시도
      const refreshSuccess = await TokenManager.refreshAccessToken()
      if (refreshSuccess) {
        console.log('[HTTP Client] 토큰 갱신 후 요청 재시도')
        return await doFetch<T>(method, url, body, config, true)
      } else {
        console.log('[HTTP Client] 토큰 갱신 실패, 로그아웃 처리')
        TokenManager.clearTokens()
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


