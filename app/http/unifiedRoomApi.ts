import apiClient from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { UnifiedRoomRequest, RoomMemberRequest, RsDataUnifiedRoomResponse, RsDataMapStringListUnifiedRoomResponse, AiGenerateRequest, RsDataString } from '@/types/api'

// createRoom
export const createRoom = (data: UnifiedRoomRequest): Promise<{ data: RsDataUnifiedRoomResponse }> =>
  apiClient.post(API_ENDPOINTS.ROOMS.BASE, data)

// leaveRoom
export const leaveRoom = (roomType: string, roomId: string, data: RoomMemberRequest): Promise<{ data: RsDataUnifiedRoomResponse }> =>
  apiClient.post(API_ENDPOINTS.ROOMS.LEAVE(roomType, roomId), data)

// joinRoom
export const joinRoom = (roomType: string, roomId: string, data: RoomMemberRequest): Promise<{ data: RsDataUnifiedRoomResponse }> =>
  apiClient.post(API_ENDPOINTS.ROOMS.JOIN(roomType, roomId), data)

// startAiGameSession
export const startAiGameSession = (roomId: string): Promise<{ data: RsDataUnifiedRoomResponse }> =>
  apiClient.post(API_ENDPOINTS.ROOMS.AI_START(roomId))

// generateAiResponse
export const generateAiResponse = (roomId: string, data: AiGenerateRequest): Promise<{ data: RsDataString }> =>
  apiClient.post(API_ENDPOINTS.ROOMS.AI_GENERATE(roomId), data)

// getRoom
export const getRoom = (roomType: string, roomId: string): Promise<{ data: RsDataUnifiedRoomResponse }> =>
  apiClient.get(API_ENDPOINTS.ROOMS.BY_TYPE_ID(roomType, roomId))

// deleteRoom
export const deleteRoom = (roomType: string, roomId: string): Promise<{ data: RsDataString }> =>
  apiClient.delete(API_ENDPOINTS.ROOMS.BY_TYPE_ID(roomType, roomId))

// getUserRooms
export const getUserRooms = (memberId: string): Promise<{ data: RsDataMapStringListUnifiedRoomResponse }> =>
  apiClient.get(API_ENDPOINTS.ROOMS.USER_ROOMS(memberId))

// getFactoryStatus
export const getFactoryStatus = (): Promise<{ data: RsDataString }> =>
  apiClient.get(API_ENDPOINTS.ROOMS.FACTORY_STATUS)

// getAvailableRooms
export const getAvailableRooms = (): Promise<{ data: RsDataMapStringListUnifiedRoomResponse }> =>
  apiClient.get(API_ENDPOINTS.ROOMS.AVAILABLE)


