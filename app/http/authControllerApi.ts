import apiClient, { setAuthTokens, clearAuthTokens } from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { AuthLoginRequest, RsDataAuthLoginResponse, RsDataJwtTokenResponse, RsDataString } from '@/types/api'

// login
export const login = async (data: AuthLoginRequest): Promise<{ data: RsDataAuthLoginResponse }> => {
  const res = await apiClient.post<RsDataAuthLoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data)
  const payload = res.data?.data as any
  if (payload) {
    const accessToken = payload.accessToken as string | undefined
    const refreshToken = payload.refreshToken as string | undefined
    if (accessToken || refreshToken) setAuthTokens({ accessToken: accessToken || null, refreshToken: refreshToken || null })
  }
  return res
}

// logout
export const logout = async (): Promise<{ data: RsDataString }> => {
  try { await apiClient.post<RsDataString>(API_ENDPOINTS.AUTH.LOGOUT) } finally { clearAuthTokens() }
  return { data: { resultCode: 'S-200', statusCode: 200, msg: 'LOGOUT', data: 'OK' } as unknown as RsDataString }
}

// refreshToken
export const refreshToken = (data: { refreshToken: string }): Promise<{ data: RsDataJwtTokenResponse }> =>
  apiClient.post(API_ENDPOINTS.AUTH.REFRESH, data)


