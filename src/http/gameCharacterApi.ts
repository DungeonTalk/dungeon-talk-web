import apiClient from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { RsData } from '@/types/api'

export interface GameCharacterDetailResponse {
  id?: string
  memberId?: string  
  raceTypeId?: string
  raceName?: string
  playerLevel?: number
  totalExp?: number
  unspentPoints?: number
  str?: number
  wil?: number
  int_?: number
  wis?: number
  dex?: number
  luk?: number
  hp?: number
  mp?: number
  physicalAttack?: number
  magicAttack?: number
  evasionRate?: number
  accuracy?: number
  diceOdds?: number
  createdAt?: string
  updatedAt?: string
}

export const getCharacterByMember = (memberId: string): Promise<{ data: RsData<GameCharacterDetailResponse> }> =>
  apiClient.get(API_ENDPOINTS.CHAR.BY_MEMBER(memberId))

export const getCharacterDetail = (id: string): Promise<{ data: RsData<GameCharacterDetailResponse> }> =>
  apiClient.get(API_ENDPOINTS.CHAR.BY_ID(id))

export const getCharacterRaces = (): Promise<{ data: RsData<string[]> }> =>
  apiClient.get(API_ENDPOINTS.CHAR.RACES)

export interface CreateCharacterRequest {
  memberId: string
  name: string
  raceTypeId: string
}

export const createCharacter = (request: CreateCharacterRequest): Promise<{ data: RsData<GameCharacterDetailResponse> }> =>
  apiClient.post(API_ENDPOINTS.CHAR.BASE, request)

// (추가) 상세 캐릭터 정보 조회 (멤버 ID 기준)
export const getDetailedCharacterByMember = (memberId: string): Promise<{ data: RsData<GameCharacterDetailResponse> }> =>
  apiClient.get(API_ENDPOINTS.CHAR.DETAIL_BY_MEMBER(memberId))



