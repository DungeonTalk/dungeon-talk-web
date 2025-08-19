import { useEffect, useRef } from 'react';

/**
 * API 요청/응답 로그를 추적하는 Hook
 * 
 * @param apiName - API 이름
 * @param isLoading - 로딩 상태
 * @param data - 응답 데이터
 * @param error - 에러 데이터
 */
export const useApiLog = (
  apiName: string,
  isLoading: boolean,
  data?: any,
  error?: any
) => {
  const hasLoggedRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // 로딩 시작 로그
      if (isLoading && !hasLoggedRef.current[`${apiName}-loading`]) {
        console.log(`[API] ${apiName} 요청 시작`);
        hasLoggedRef.current[`${apiName}-loading`] = true;
      }
      
      // 로딩 완료 후 초기화
      if (!isLoading) {
        hasLoggedRef.current[`${apiName}-loading`] = false;
      }
    }
  }, [apiName, isLoading]);

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      if (data && !isLoading) {
        console.log(`[API] ${apiName} 성공 응답:`, data);
      }
    }
  }, [apiName, data, isLoading]);

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      if (error) {
        console.error(`[API] ${apiName} 에러:`, error);
      }
    }
  }, [apiName, error]);
};

/**
 * WebSocket 연결 상태를 로그로 추적하는 Hook
 * 
 * @param socketName - WebSocket 이름
 * @param connectionState - 연결 상태
 * @param lastMessage - 마지막 메시지
 */
export const useWebSocketLog = (
  socketName: string,
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error',
  lastMessage?: any
) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`[WEBSOCKET] ${socketName} 상태 변경:`, connectionState);
    }
  }, [socketName, connectionState]);

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      if (lastMessage) {
        console.log(`[WEBSOCKET] ${socketName} 메시지 수신:`, lastMessage);
      }
    }
  }, [socketName, lastMessage]);
};

/**
 * 네트워크 요청 성능을 측정하고 로그하는 Hook
 * 
 * @param apiName - API 이름
 * @param isLoading - 로딩 상태
 */
export const useApiPerformanceLog = (apiName: string, isLoading: boolean) => {
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      if (isLoading && !startTimeRef.current) {
        startTimeRef.current = performance.now();
        console.log(`[PERFORMANCE] ${apiName} 요청 시작 - ${new Date().toISOString()}`);
      }
      
      if (!isLoading && startTimeRef.current) {
        const endTime = performance.now();
        const duration = endTime - startTimeRef.current;
        console.log(`[PERFORMANCE] ${apiName} 완료 - 소요시간: ${duration.toFixed(2)}ms`);
        startTimeRef.current = null;
      }
    }
  }, [apiName, isLoading]);
};