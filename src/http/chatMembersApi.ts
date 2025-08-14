import apiClient from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { MemberPresenceDto, RsDataString } from '@/types/api'

// leave
export const leave = (roomId: string, memberId: string): Promise<{ data: RsDataString }> =>
  apiClient.post(API_ENDPOINTS.CHAT.MEMBERS_LEAVE(roomId, memberId))

// join
export const join = (roomId: string, memberId: string): Promise<{ data: RsDataString }> =>
  apiClient.post(API_ENDPOINTS.CHAT.MEMBERS_JOIN(roomId, memberId))

// getOnlineMembers
export const getOnlineMembers = (roomId: string): Promise<{ data: MemberPresenceDto[] }> =>
  apiClient.get(API_ENDPOINTS.CHAT.MEMBERS_ONLINE(roomId))


