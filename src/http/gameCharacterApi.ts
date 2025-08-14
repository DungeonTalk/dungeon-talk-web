import apiClient from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { RsData } from '@/types/api'

export interface GameCharacterResponse {
  id?: string
  memberId?: string
  name?: string
  race?: string
  level?: number
  hp?: number
  mp?: number
  createdAt?: string
}

export const getCharacterByMember = (memberId: string): Promise<{ data: RsData<GameCharacterResponse> }> =>
  apiClient.get(API_ENDPOINTS.CHAR.BY_MEMBER(memberId))

export const getCharacterDetail = (id: string): Promise<{ data: RsData<any> }> =>
  apiClient.get(API_ENDPOINTS.CHAR.BY_ID(id))


