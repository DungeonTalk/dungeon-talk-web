import { useEffect, useState, useCallback, useRef } from 'react';
import { websocketManager } from '@/lib/websocket-manager';

export interface ChatMessage {
  messageId?: string;
  roomId: string;
  memberId: string;
  message: string;
  nickname?: string;
  type?: 'TALK' | 'ENTER' | 'LEAVE' | 'SYSTEM';
  timestamp?: number;
  createdAt?: string;
}

interface UseWebSocketOptions {
  autoConnect?: boolean;
  roomId?: string;
}

export const useWebSocket = (options?: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  // 메시지 추가 함수
  const addMessage = useCallback((message: ChatMessage) => {
    // 중복 메시지 체크
    const isDuplicate = messagesRef.current.some(
      msg => msg.messageId === message.messageId && message.messageId !== undefined
    );
    
    if (!isDuplicate) {
      messagesRef.current = [...messagesRef.current, message];
      setMessages(messagesRef.current);
    }
  }, []);

  // WebSocket 연결
  const connect = useCallback(async () => {
    try {
      setError(null);
      
      // WebSocket 설정 업데이트
      websocketManager.updateConfig({
        onConnect: () => {
          console.log('[useWebSocket] 연결 성공');
          setIsConnected(true);
          setError(null);
        },
        onDisconnect: () => {
          console.log('[useWebSocket] 연결 해제');
          setIsConnected(false);
        },
        onError: (err) => {
          console.error('[useWebSocket] 에러:', err);
          setError('WebSocket 연결 에러가 발생했습니다.');
        },
        onMessage: (message) => {
          console.log('[useWebSocket] 메시지 수신:', message);
          addMessage(message);
        },
      });

      await websocketManager.connect();
    } catch (err) {
      console.error('[useWebSocket] 연결 실패:', err);
      setError(err instanceof Error ? err.message : '연결 실패');
      setIsConnected(false);
    }
  }, [addMessage]);

  // 채팅방 입장
  const joinRoom = useCallback(async (roomId: string) => {
    try {
      setError(null);
      
      if (!websocketManager.isConnected()) {
        await connect();
      }

      await websocketManager.subscribeToRoom(roomId);
      setCurrentRoomId(roomId);
      
      // 입장 메시지 전송
      await websocketManager.sendEnterMessage();
      
      console.log(`[useWebSocket] 채팅방 ${roomId} 입장 완료`);
    } catch (err) {
      console.error('[useWebSocket] 채팅방 입장 실패:', err);
      setError(err instanceof Error ? err.message : '채팅방 입장 실패');
    }
  }, [connect]);

  // 채팅방 퇴장
  const leaveRoom = useCallback(async () => {
    try {
      if (currentRoomId && websocketManager.isConnected()) {
        // 퇴장 메시지 전송
        await websocketManager.sendLeaveMessage();
      }
      
      setCurrentRoomId(null);
      messagesRef.current = [];
      setMessages([]);
      
      console.log('[useWebSocket] 채팅방 퇴장 완료');
    } catch (err) {
      console.error('[useWebSocket] 채팅방 퇴장 실패:', err);
    }
  }, [currentRoomId]);

  // 메시지 전송
  const sendMessage = useCallback(async (message: string) => {
    try {
      setError(null);
      
      if (!websocketManager.isConnected()) {
        throw new Error('WebSocket이 연결되어 있지 않습니다.');
      }
      
      if (!currentRoomId) {
        throw new Error('채팅방에 입장하지 않았습니다.');
      }

      await websocketManager.sendMessage(message);
      console.log('[useWebSocket] 메시지 전송 완료:', message);
    } catch (err) {
      console.error('[useWebSocket] 메시지 전송 실패:', err);
      setError(err instanceof Error ? err.message : '메시지 전송 실패');
      throw err;
    }
  }, [currentRoomId]);

  // 연결 해제
  const disconnect = useCallback(() => {
    websocketManager.disconnect();
    setIsConnected(false);
    setCurrentRoomId(null);
    messagesRef.current = [];
    setMessages([]);
    setError(null);
    console.log('[useWebSocket] 연결 해제 완료');
  }, []);

  // 메시지 목록 초기화
  const clearMessages = useCallback(() => {
    messagesRef.current = [];
    setMessages([]);
  }, []);

  // 컴포넌트 마운트 시 자동 연결
  useEffect(() => {
    if (options?.autoConnect) {
      connect();
    }

    // 클린업
    return () => {
      if (websocketManager.isConnected()) {
        disconnect();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // roomId 옵션이 제공된 경우 자동 입장
  useEffect(() => {
    if (options?.roomId && isConnected && options.roomId !== currentRoomId) {
      joinRoom(options.roomId);
    }
  }, [options?.roomId, isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // 상태
    isConnected,
    messages,
    currentRoomId,
    error,
    
    // 액션
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    clearMessages,
  };
};