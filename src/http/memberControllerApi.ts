import apiClient from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { RegisterRequest, RsDataRegisterResponse } from '@/types/api'

// register
export const register = (data: RegisterRequest): Promise<{ data: RsDataRegisterResponse }> =>
  apiClient.post(API_ENDPOINTS.MEMBER.REGISTER, data)


