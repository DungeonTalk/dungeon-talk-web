export type RsData<T> = { resultCode?: string; statusCode?: number; msg?: string; data: T }
export type RsDataString = RsData<string>
export type RsDataObject = RsData<Record<string, unknown>>

// Auth
export interface AuthLoginRequest { name?: string; password?: string }
export interface AuthLoginResponse { memberId?: string; accessToken?: string; refreshToken?: string }
export type RsDataAuthLoginResponse = RsData<AuthLoginResponse>
export interface RefreshTokenRequest { refreshToken?: string }
export interface JwtTokenResponse { accessToken?: string; refreshToken?: string }
export type RsDataJwtTokenResponse = RsData<JwtTokenResponse>

// Member
export interface RegisterRequest { name: string; nickName?: string; password: string }
export interface RegisterResponse { id?: string; name?: string; nickName?: string }
export type RsDataRegisterResponse = RsData<RegisterResponse>

// Unified Rooms
export type RoomType = 'AI_GAME' | 'PLAYER_CHAT'
export type ChatMode = 'SINGLE' | 'MULTI'
export interface UnifiedRoomRequest {
  roomType: RoomType
  roomName: string
  description?: string
  maxParticipants?: number
  creatorId: string
  participantIds?: string[]
  gameId?: string
  gameSettings?: string
  chatMode?: ChatMode
  maxCapacity?: number
  aiGameRoom?: boolean
  playerChatRoom?: boolean
}
export type UnifiedRoomStatus = 'CREATED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ERROR' | 'AI_PROCESSING' | 'WAITING_PLAYER_INPUT' | 'GAME_ENDED' | 'CHAT_AVAILABLE' | 'FULL' | 'INACTIVE'
export interface UnifiedRoomResponse {
  roomId?: string
  roomType?: RoomType
  roomName?: string
  description?: string
  status?: UnifiedRoomStatus
  currentParticipants?: number
  maxParticipants?: number
  participantIds?: string[]
  createdAt?: string
  updatedAt?: string
  gameId?: string
  currentTurn?: number
  gameSettings?: string
  lastActivity?: string
  maxCapacity?: number
  onlineUserCount?: number
  aiGameRoom?: boolean
  playerChatRoom?: boolean
  joinable?: boolean
}
export type RsDataUnifiedRoomResponse = RsData<UnifiedRoomResponse>
export type RsDataMapStringListUnifiedRoomResponse = RsData<Record<string, UnifiedRoomResponse[]>>
export interface RoomMemberRequest { memberId: string; nickname?: string; message?: string }
export interface AiGenerateRequest { gameId?: string; currentUser?: string; currentMessage?: string; turnNumber?: number }

// AI Game Room
export type AiGameStatus = 'CREATED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ERROR'
export type AiGamePhase = 'WAITING' | 'TURN_INPUT' | 'AI_RESPONSE' | 'GAME_END'
export interface AiGameRoomCreateRequest { gameId: string; roomName: string; maxParticipants?: number; gameSettings?: string; creatorId: string }
export interface AiGameRoomResponse {
  id?: string
  roomId?: string
  gameId?: string
  roomName?: string
  status?: AiGameStatus
  currentPhase?: AiGamePhase
  currentTurn?: number
  maxParticipants?: number
  currentParticipantCount?: number
  participants?: string[]
  createdAt?: string
  active?: boolean
}
export type RsDataAiGameRoomResponse = RsData<AiGameRoomResponse>
export interface AiGameRoomJoinRequest { aiGameRoomId: string; participantId: string; participantNickname: string }
export interface AiGameMessageResponse { messageId?: string; aiGameRoomId?: string; senderId?: string; senderNickname?: string; content?: string; messageType?: 'USER'|'AI'|'SYSTEM'|'TURN_START'|'TURN_END'; turnNumber?: number; messageOrder?: number; createdAt?: string; aiMessage?: boolean; systemMessage?: boolean }
export type RsDataListAiGameMessageResponse = RsData<AiGameMessageResponse[]>
export interface GameStatusResponse { roomId?: string; sessionValid?: boolean; aiProcessing?: boolean }
export type RsDataGameStatusResponse = RsData<GameStatusResponse>

// Chat
export type ChatMode2 = 'SINGLE' | 'MULTI'
export interface ChatRoomCreateRequestDto { roomName: string; mode: ChatMode2; participantIds?: string[]; maxCapacity?: number }
export interface ChatRoomDto { id?: string; roomName?: string; mode?: ChatMode2; maxCapacity?: number; createdAt?: string; updatedAt?: string }
export type RsDataChatRoomDto = RsData<ChatRoomDto>
export type ChatMessageType = 'JOIN'|'TALK'|'LEAVE'|'CONNECTED_COUNT'|'PRESENCE'
export interface ChatMessageSendRequestDto { messageId?: string; roomId: string; senderId: string; senderNickname?: string; receiverId?: string; content?: string; type: ChatMessageType }
export interface ChatMessageDto { messageId?: string; roomId?: string; senderId?: string; receiverId?: string; content?: string; type?: ChatMessageType; createdAt?: string; senderNickname?: string }
export type RsDataChatMessageDto = RsData<ChatMessageDto>
export interface MemberPresenceDto { memberId?: string; nickname?: string; status?: 'ONLINE'|'OFFLINE' }
export interface ChatMessageResponse { id?: string; roomId?: string; senderId?: string; senderNickname?: string; content?: string; createdAt?: string }
export interface PageChatMessageResponse { totalElements?: number; totalPages?: number; size?: number; content?: ChatMessageResponse[]; number?: number; first?: boolean; last?: boolean; numberOfElements?: number; empty?: boolean }
export type RsDataPageChatMessageResponse = RsData<PageChatMessageResponse>

// Matching
export type WorldType = 'FANTASY'|'SF'|'MODERN'
export interface MatchingJoinRequest { memberId: string; worldType: WorldType }
export interface MatchingStatusResponse { memberId?: string; worldType?: WorldType; status?: 'WAITING'|'MATCHED'|'COMPLETED'|'CANCELLED'|'EXPIRED'|'ERROR'; currentPosition?: number; totalInQueue?: number; waitingTimeSeconds?: number; estimatedWaitTime?: string; joinedAt?: string }
export type RsDataMatchingStatusResponse = RsData<MatchingStatusResponse>
export interface MatchingCancelRequest { memberId: string }
export interface QueueStatsResponse { queueInfo?: Record<string, WorldQueueInfo>; totalWaiting?: number; lastUpdated?: string }
export interface WorldQueueInfo { worldType?: WorldType; displayName?: string; currentWaiting?: number; averageWaitTimeSeconds?: number; estimatedWaitMessage?: string }
export type RsDataQueueStatsResponse = RsData<QueueStatsResponse>

// Page - AiGameRoom
export interface PageAiGameRoomResponse {
  totalElements?: number
  totalPages?: number
  size?: number
  content?: AiGameRoomResponse[]
  number?: number
  first?: boolean
  last?: boolean
  numberOfElements?: number
  empty?: boolean
}
export type RsDataPageAiGameRoomResponse = RsData<PageAiGameRoomResponse>


