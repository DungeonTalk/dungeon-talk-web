import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import { TokenManager } from './token-manager';

// 동적 import로 SSR 문제 해결
let SockJS: any = null;

interface ChatMessage {
  messageId?: string;
  id?: string;  // 서버에서 id로 올 수도 있음
  roomId: string;
  senderId?: string;  // 서버에서만 설정, 클라이언트는 보내지 않음
  content: string;   // 백엔드는 content를 기대함 (message 대신)
  message?: string;  // 서버에서 message로 올 수도 있음
  senderNickname?: string;  // 백엔드 필드명
  senderNickName?: string;  // 대소문자 차이로 올 수도 있음
  type?: 'TALK' | 'JOIN' | 'LEAVE' | 'CONNECTED_COUNT' | 'PRESENCE';
  messageType?: string;  // 서버에서 messageType으로 올 수도 있음
  createdAt?: string;  // ISO 8601 형식
  connectedCount?: number;  // PRESENCE 타입일 때
  members?: any[];  // PRESENCE 타입일 때
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
   * @param initialRoomId - 연결 시 초기 룸 ID (선택적)
   */
  async connect(initialRoomId?: string): Promise<void> {
    if (this.client?.connected) {
      console.log('[WebSocket] 이미 연결되어 있습니다.');
      return;
    }

    // SSR 환경에서는 실행하지 않음
    if (typeof window === 'undefined') {
      console.log('[WebSocket] SSR 환경에서는 WebSocket을 사용할 수 없습니다.');
      return;
    }

    // 클라이언트 사이드에서 SockJS 동적 import
    if (!SockJS) {
      const SockJSModule = await import('sockjs-client');
      SockJS = SockJSModule.default || SockJSModule;
    }

    try {
      // 토큰 확인
      const token = await TokenManager.ensureValidToken();
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
      }

      // roomId 설정 (초기값 또는 테스트용 기본값)
      const roomId = initialRoomId || 'test-room';
      this.roomId = roomId;

      // STOMP 클라이언트 생성
      this.client = new Client({
        // WebSocket Factory - SockJS 사용
        webSocketFactory: () => {
          // 백엔드에서 요구하는 쿼리 파라미터 추가
          const params = new URLSearchParams({
            token: token,
            roomId: roomId
          });
          const sockJsUrl = `http://localhost:8080/ws-chat?${params.toString()}`;
          console.log('[WebSocket] Connecting via SockJS to:', sockJsUrl);
          return new SockJS(sockJsUrl);
        },

       /* // 연결 헤더
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },*/

        // 디버그 로그
        debug: (str) => {
          // 개발 환경에서만 디버그 로그 출력
          console.log('[STOMP Debug]', str);
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

    // 새 구독 시작 (연결 시 이미 인증되었으므로 토큰 불필요)
    this.subscription = this.client.subscribe(
      `/sub/chat/room/${roomId}`,
      (message: IMessage) => {
        try {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          console.log('[WebSocket] 메시지 수신:', chatMessage);
          console.log('[WebSocket] 원본 메시지:', message.body);
          this.config.onMessage?.(chatMessage);
        } catch (error) {
          console.error('[WebSocket] 메시지 파싱 에러:', error);
          console.error('[WebSocket] 원본 메시지:', message.body);
        }
      }
    );

    console.log(`[WebSocket] 채팅방 ${roomId} 구독 시작`);
  }

  /**
   * 메시지 전송
   */
  async sendMessage(message: string, type: 'TALK' | 'JOIN' | 'LEAVE' = 'TALK'): Promise<void> {
    if (!this.client?.connected) {
      throw new Error('WebSocket이 연결되어 있지 않습니다.');
    }

    if (!this.roomId) {
      throw new Error('채팅방에 입장하지 않았습니다.');
    }

    const userData = TokenManager.getUserData();
    
    // 백엔드가 WebSocket 세션에서 memberId를 자동으로 설정하므로 senderId를 보내지 않음
    const chatMessage: ChatMessage = {
      roomId: this.roomId,
      senderId: '',  // 백엔드에서 자동 설정
      content: message,  // message → content로 변경
      senderNickname: userData?.nickname || userData?.email || '익명',  // nickname → senderNickname
      type: type,
      createdAt: new Date().toISOString(),  // ISO 8601 형식
    };

    // STOMP 메시지 발송 (연결 시 이미 인증되었으므로 토큰 불필요)
    this.client.publish({
      destination: '/pub/chat/send',
      body: JSON.stringify(chatMessage),
    });

    console.log('[WebSocket] 메시지 전송:', chatMessage);
  }

  /**
   * 채팅방 입장 메시지
   */
  async sendEnterMessage(nickname?: string): Promise<void> {
    const userData = TokenManager.getUserData();
    const enterMessage = `${nickname || userData?.nickname || '익명'}님이 입장했습니다.`;
    await this.sendMessage(enterMessage, 'JOIN');  // ENTER → JOIN으로 변경
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