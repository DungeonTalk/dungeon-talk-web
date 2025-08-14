import apiClient from './client'
import { API_ENDPOINTS } from '@/constants/api'

// saveTestSessionData
export const saveTestSessionData = (): Promise<{ data: string }> =>
  apiClient.get(API_ENDPOINTS.VALKEY.SAVE_TEST)

// getAllSessionKeys
export const getAllSessionKeys = (): Promise<{ data: string[] }> =>
  apiClient.get(API_ENDPOINTS.VALKEY.KEYS)

// getAllSessionData
export const getAllSessionData = (): Promise<{ data: Record<string, string> }> =>
  apiClient.get(API_ENDPOINTS.VALKEY.ALL)


