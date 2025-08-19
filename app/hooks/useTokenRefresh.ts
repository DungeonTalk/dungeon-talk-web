import { useEffect, useRef, useCallback } from 'react';
import { TokenManager } from '@/lib/token-manager';

interface UseTokenRefreshOptions {
  /** 토큰 갱신 확인 간격 (밀리초, 기본: 60초) */
  refreshInterval?: number;
  /** 토큰 만료 전 갱신 시작 시간 (밀리초, 기본: 5분) */
  refreshBeforeExpiry?: number;
  /** 자동 갱신 활성화 여부 (기본: true) */
  autoRefresh?: boolean;
  /** 갱신 성공 시 콜백 */
  onRefreshSuccess?: () => void;
  /** 갱신 실패 시 콜백 */
  onRefreshFailure?: (error: Error) => void;
  /** 토큰 만료 시 콜백 */
  onTokenExpired?: () => void;
}

/**
 * 토큰 자동 갱신을 처리하는 Hook
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const {
    refreshInterval = 60 * 1000, // 1분
    refreshBeforeExpiry = 5 * 60 * 1000, // 5분
    autoRefresh = true,
    onRefreshSuccess,
    onRefreshFailure,
    onTokenExpired
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  const checkAndRefreshToken = useCallback(async () => {
    if (isRefreshingRef.current) {
      return; // 이미 갱신 중이면 중복 실행 방지
    }

    try {
      if (!TokenManager.isAuthenticated()) {
        return; // 인증되지 않은 상태면 확인하지 않음
      }

      // 토큰이 곧 만료되는지 확인
      if (TokenManager.isTokenExpired()) {
        console.log('[TokenRefresh] 토큰이 만료되었습니다. 갱신을 시도합니다.');
        isRefreshingRef.current = true;

        const success = await TokenManager.refreshAccessToken();
        
        if (success) {
          console.log('[TokenRefresh] 토큰 갱신 성공');
          onRefreshSuccess?.();
        } else {
          console.error('[TokenRefresh] 토큰 갱신 실패');
          const error = new Error('토큰 갱신에 실패했습니다.');
          onRefreshFailure?.(error);
          
          // 갱신 실패 시 토큰 만료 콜백 호출
          onTokenExpired?.();
        }

        isRefreshingRef.current = false;
      }
    } catch (error) {
      console.error('[TokenRefresh] 토큰 확인 중 오류:', error);
      isRefreshingRef.current = false;
      onRefreshFailure?.(error as Error);
    }
  }, [onRefreshSuccess, onRefreshFailure, onTokenExpired]);

  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current || !autoRefresh) {
      return;
    }

    console.log('[TokenRefresh] 자동 갱신 시작');
    intervalRef.current = setInterval(checkAndRefreshToken, refreshInterval);
  }, [checkAndRefreshToken, refreshInterval, autoRefresh]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      console.log('[TokenRefresh] 자동 갱신 중지');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const manualRefresh = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      console.log('[TokenRefresh] 이미 갱신 중입니다.');
      return false;
    }

    try {
      console.log('[TokenRefresh] 수동 갱신 시작');
      isRefreshingRef.current = true;
      
      const success = await TokenManager.refreshAccessToken();
      
      if (success) {
        console.log('[TokenRefresh] 수동 갱신 성공');
        onRefreshSuccess?.();
      } else {
        console.error('[TokenRefresh] 수동 갱신 실패');
        const error = new Error('수동 토큰 갱신에 실패했습니다.');
        onRefreshFailure?.(error);
      }

      isRefreshingRef.current = false;
      return success;
    } catch (error) {
      console.error('[TokenRefresh] 수동 갱신 중 오류:', error);
      isRefreshingRef.current = false;
      onRefreshFailure?.(error as Error);
      return false;
    }
  }, [onRefreshSuccess, onRefreshFailure]);

  // 컴포넌트 마운트 시 자동 갱신 시작
  useEffect(() => {
    if (autoRefresh) {
      startAutoRefresh();
    }

    return () => {
      stopAutoRefresh();
    };
  }, [autoRefresh, startAutoRefresh, stopAutoRefresh]);

  // 브라우저 탭 활성화 시 토큰 상태 확인
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      if (!document.hidden && autoRefresh) {
        // 탭이 활성화되었을 때 즉시 토큰 상태 확인
        checkAndRefreshToken();
      }
    };

    const handleFocus = () => {
      if (autoRefresh) {
        checkAndRefreshToken();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAndRefreshToken, autoRefresh]);

  return {
    /** 자동 갱신 시작 */
    startAutoRefresh,
    /** 자동 갱신 중지 */
    stopAutoRefresh,
    /** 수동 토큰 갱신 */
    manualRefresh,
    /** 현재 갱신 중 여부 */
    isRefreshing: isRefreshingRef.current
  };
};