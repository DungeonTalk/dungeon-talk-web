import apiClient from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { AiGameRoomCreateRequest, RsDataAiGameRoomResponse, AiGameRoomJoinRequest, RsDataListAiGameMessageResponse, RsDataGameStatusResponse, RsDataPageAiGameRoomResponse, RsDataString } from '@/types/api'

// createRoom_2
export const createRoom_2 = (data: AiGameRoomCreateRequest): Promise<{ data: RsDataAiGameRoomResponse }> =>
  apiClient.post(API_ENDPOINTS.AICHAT.BASE, data)

// startGameSession
export const startGameSession = (roomId: string): Promise<{ data: RsDataAiGameRoomResponse }> =>
  apiClient.post(API_ENDPOINTS.AICHAT.START(roomId))

// resumeGame
export const resumeGame = (roomId: string): Promise<{ data: RsDataString }> =>
  apiClient.post(API_ENDPOINTS.AICHAT.RESUME(roomId))

// pauseGame
export const pauseGame = (roomId: string, params?: { reason?: string }): Promise<{ data: RsDataString }> =>
  apiClient.post(API_ENDPOINTS.AICHAT.PAUSE(roomId), undefined, { params })

// leaveRoom_1
export const leaveRoom_1 = (roomId: string, params: { participantId: string }): Promise<{ data: RsDataString }> =>
  apiClient.post(API_ENDPOINTS.AICHAT.LEAVE(roomId), undefined, { params })

// endGame
export const endGame = (roomId: string): Promise<{ data: RsDataString }> =>
  apiClient.post(API_ENDPOINTS.AICHAT.END(roomId))

// joinRoom_2
export const joinRoom_2 = (data: AiGameRoomJoinRequest): Promise<{ data: RsDataAiGameRoomResponse }> =>
  apiClient.post(API_ENDPOINTS.AICHAT.JOIN, data)

// getRoom_2
export const getRoom_2 = (roomId: string): Promise<{ data: RsDataAiGameRoomResponse }> =>
  apiClient.get(API_ENDPOINTS.AICHAT.BY_ID(roomId))

// getTurnMessages
export const getTurnMessages = (roomId: string, turnNumber: number): Promise<{ data: RsDataListAiGameMessageResponse }> =>
  apiClient.get(API_ENDPOINTS.AICHAT.TURN_MESSAGES(roomId, turnNumber))

// getGameStatus
export const getGameStatus = (roomId: string): Promise<{ data: RsDataGameStatusResponse }> =>
  apiClient.get(API_ENDPOINTS.AICHAT.STATUS(roomId))

// getMessageHistory
export const getMessageHistory = (roomId: string, params: { pageable: unknown; page?: number; size?: number; sort?: string | string[] }): Promise<{ data: RsDataListAiGameMessageResponse }> =>
  apiClient.get(API_ENDPOINTS.AICHAT.MESSAGES(roomId), { params })

// getMyRooms
export const getMyRooms = (params: { participantId: string; pageable: unknown; page?: number; size?: number; sort?: string | string[] }): Promise<{ data: RsDataPageAiGameRoomResponse }> =>
  apiClient.get(API_ENDPOINTS.AICHAT.MY_ROOMS, { params })

// getRoomByGameId
export const getRoomByGameId = (gameId: string): Promise<{ data: RsDataAiGameRoomResponse }> =>
  apiClient.get(API_ENDPOINTS.AICHAT.BY_GAME(gameId))

// getAvailableRooms_1
export const getAvailableRooms_1 = (params: { pageable: unknown; page?: number; size?: number; sort?: string | string[] }): Promise<{ data: RsDataPageAiGameRoomResponse }> =>
  apiClient.get(API_ENDPOINTS.AICHAT.AVAILABLE, { params })


