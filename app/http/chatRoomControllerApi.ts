import apiClient from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { ChatRoomCreateRequestDto, ChatRoomDto, ChatMessageSendRequestDto, RsDataChatMessageDto, RsDataPageChatMessageResponse, RsDataString } from '@/types/api'

// getAllRooms
export const getAllRooms = (): Promise<{ data: ChatRoomDto[] }> =>
  apiClient.get(API_ENDPOINTS.CHAT.BASE)

// createRoom_1
export const createRoom_1 = (data: ChatRoomCreateRequestDto): Promise<{ data: ChatRoomDto }> =>
  apiClient.post(API_ENDPOINTS.CHAT.BASE, data)

// sendMessage
export const sendMessage = (roomId: string, data: ChatMessageSendRequestDto): Promise<{ data: RsDataChatMessageDto }> =>
  apiClient.post(API_ENDPOINTS.CHAT.SEND(roomId), data)

// joinRoom_1
export const joinRoom_1 = (roomId: string, memberId: string): Promise<{ data: RsDataString }> =>
  apiClient.post(API_ENDPOINTS.CHAT.JOIN(roomId, memberId))

// leaveRoom_2
export const leaveRoom_2 = (roomId: string, memberId: string): Promise<{ data: RsDataString }> =>
  apiClient.delete(API_ENDPOINTS.CHAT.LEAVE(roomId, memberId))

// getRoom_1
export const getRoom_1 = (roomId: string): Promise<{ data: ChatRoomDto }> =>
  apiClient.get(API_ENDPOINTS.CHAT.BY_ID(roomId))

// getMessages
export const getMessages = (roomId: string, params?: { page?: number; size?: number; sort?: string | string[] }): Promise<{ data: RsDataPageChatMessageResponse }> =>
  apiClient.get(API_ENDPOINTS.CHAT.MESSAGES(roomId), { params })


