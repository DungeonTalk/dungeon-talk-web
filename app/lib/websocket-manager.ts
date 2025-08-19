import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { TokenManager } from './token-manager';

interface ChatMessage {
  messageId?: string;
  roomId: string;
  memberId: string;
  message: string;
  nickname?: string;
  type?: 'TALK' | 'ENTER' | 'LEAVE' | 'SYSTEM';
  timestamp?: number;
}

interface WebSocketConfig {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onMessage?: (message: ChatMessage) => void;
}

export class WebSocketManager {
  private client: Client | null = null;
  private subscription: StompSubscription | null = null;
  private roomId: string | null = null;
  private config: WebSocketConfig = {};
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 3000;

  constructor(config?: WebSocketConfig) {
    if (config) {
      this.config = config;
    }
  }

  /**
   * WebSocket 연결 초기화
   */
  async connect(): Promise<void> {
    if (this.client?.connected) {
      console.log('[WebSocket] 이미 연결되어 있습니다.');
      return;
    }

    try {
      // 토큰 확인
      const token = await TokenManager.ensureValidToken();
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
      }

      // STOMP 클라이언트 생성
      this.client = new Client({
        // WebSocket Factory - SockJS 사용
        webSocketFactory: () => {
          return new SockJS('http://localhost:8080/ws-chat') as any;
        },

        // 연결 헤더
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },

        // 디버그 로그
        debug: (str) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[STOMP Debug]', str);
          }
        },

        // 재연결 설정
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        // 연결 성공 콜백
        onConnect: () => {
          console.log('[WebSocket] 연결 성공');
          this.reconnectAttempts = 0;
          this.config.onConnect?.();
        },

        // 연결 해제 콜백
        onDisconnect: () => {
          console.log('[WebSocket] 연결 해제');
          this.config.onDisconnect?.();
        },

        // 에러 콜백
        onStompError: (frame) => {
          console.error('[WebSocket] STOMP 에러:', frame.headers['message']);
          console.error('[WebSocket] 에러 내용:', frame.body);
          this.config.onError?.(frame);
        },

        // WebSocket 에러
        onWebSocketError: (error) => {
          console.error('[WebSocket] WebSocket 에러:', error);
          this.config.onError?.(error);
        },
      });

      // 연결 시작
      this.client.activate();
    } catch (error) {
      console.error('[WebSocket] 연결 실패:', error);
      throw error;
    }
  }

  /**
   * 채팅방 구독
   */
  async subscribeToRoom(roomId: string): Promise<void> {
    if (!this.client?.connected) {
      throw new Error('WebSocket이 연결되어 있지 않습니다.');
    }

    // 기존 구독 해제
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    this.roomId = roomId;

    // 새 구독 시작
    this.subscription = this.client.subscribe(
      `/sub/chat/room/${roomId}`,
      (message: IMessage) => {
        try {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          console.log('[WebSocket] 메시지 수신:', chatMessage);
          this.config.onMessage?.(chatMessage);
        } catch (error) {
          console.error('[WebSocket] 메시지 파싱 에러:', error);
        }
      },
      {
        // 구독 헤더
        Authorization: `Bearer ${await TokenManager.ensureValidToken()}`,
      }
    );

    console.log(`[WebSocket] 채팅방 ${roomId} 구독 시작`);
  }

  /**
   * 메시지 전송
   */
  async sendMessage(message: string, type: 'TALK' | 'ENTER' | 'LEAVE' = 'TALK'): Promise<void> {
    if (!this.client?.connected) {
      throw new Error('WebSocket이 연결되어 있지 않습니다.');
    }

    if (!this.roomId) {
      throw new Error('채팅방에 입장하지 않았습니다.');
    }

    const token = await TokenManager.ensureValidToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const userData = TokenManager.getUserData();
    if (!userData) {
      throw new Error('사용자 정보가 없습니다.');
    }

    const chatMessage: ChatMessage = {
      roomId: this.roomId,
      memberId: userData.id,
      message: message,
      nickname: userData.nickname || userData.email || '익명',
      type: type,
      timestamp: Date.now(),
    };

    // STOMP 메시지 발송
    this.client.publish({
      destination: '/pub/chat/send',
      body: JSON.stringify(chatMessage),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('[WebSocket] 메시지 전송:', chatMessage);
  }

  /**
   * 채팅방 입장 메시지
   */
  async sendEnterMessage(nickname?: string): Promise<void> {
    const userData = TokenManager.getUserData();
    const enterMessage = `${nickname || userData?.nickname || '익명'}님이 입장했습니다.`;
    await this.sendMessage(enterMessage, 'ENTER');
  }

  /**
   * 채팅방 퇴장 메시지
   */
  async sendLeaveMessage(nickname?: string): Promise<void> {
    const userData = TokenManager.getUserData();
    const leaveMessage = `${nickname || userData?.nickname || '익명'}님이 퇴장했습니다.`;
    await this.sendMessage(leaveMessage, 'LEAVE');
  }

  /**
   * 연결 해제
   */
  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.roomId = null;
    console.log('[WebSocket] 연결 해제 완료');
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  /**
   * 현재 채팅방 ID
   */
  getCurrentRoomId(): string | null {
    return this.roomId;
  }

  /**
   * 설정 업데이트
   */
  updateConfig(config: Partial<WebSocketConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// 싱글톤 인스턴스
export const websocketManager = new WebSocketManager();