import { useCallback, useEffect } from 'react';

/**
 * 로그인/인증 관련 로그를 추적하는 Hook
 */
export const useAuthLog = () => {
  const logAuthAction = useCallback((action: string, details?: any) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[AUTH] ${timestamp} - ${action}`, details || '');
    }
  }, []);

  const logLogin = useCallback((method: 'email' | 'social', success: boolean, error?: any) => {
    if (success) {
      logAuthAction(`로그인 성공 (${method})`);
    } else {
      logAuthAction(`로그인 실패 (${method})`, { error });
    }
  }, [logAuthAction]);

  const logLogout = useCallback((reason?: 'user' | 'session_expired' | 'error') => {
    logAuthAction('로그아웃', { reason: reason || 'user' });
  }, [logAuthAction]);

  const logSignup = useCallback((method: 'email' | 'social', success: boolean, error?: any) => {
    if (success) {
      logAuthAction(`회원가입 성공 (${method})`);
    } else {
      logAuthAction(`회원가입 실패 (${method})`, { error });
    }
  }, [logAuthAction]);

  const logTokenRefresh = useCallback((success: boolean, error?: any) => {
    if (success) {
      logAuthAction('토큰 갱신 성공');
    } else {
      logAuthAction('토큰 갱신 실패', { error });
    }
  }, [logAuthAction]);

  const logAuthCheck = useCallback((isAuthenticated: boolean, userInfo?: any) => {
    logAuthAction('인증 상태 확인', { isAuthenticated, userInfo });
  }, [logAuthAction]);

  const logSessionExpiry = useCallback((reason: string) => {
    logAuthAction('세션 만료', { reason });
  }, [logAuthAction]);

  return {
    logAuthAction,
    logLogin,
    logLogout,
    logSignup,
    logTokenRefresh,
    logAuthCheck,
    logSessionExpiry
  };
};

/**
 * 현재 로그인 상태를 추적하고 로그를 남기는 Hook
 * 
 * @param user - 현재 로그인된 사용자 정보
 * @param isLoading - 인증 상태 로딩 중 여부
 * @param error - 인증 관련 에러
 */
export const useAuthStatusLog = (
  user: any,
  isLoading: boolean,
  error?: any
) => {
  const { logAuthCheck, logSessionExpiry } = useAuthLog();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        logAuthCheck(true, {
          id: user.id,
          email: user.email,
          loginTime: new Date().toISOString()
        });
      } else {
        logAuthCheck(false);
      }
    }
  }, [user, isLoading, logAuthCheck]);

  useEffect(() => {
    if (error) {
      logSessionExpiry(error.message || '알 수 없는 인증 오류');
    }
  }, [error, logSessionExpiry]);

  // 페이지 새로고침 시 로그인 상태 확인
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const handleBeforeUnload = () => {
        if (user) {
          console.log('[AUTH] 페이지 새로고침 - 로그인 상태 유지됨', {
            userId: user.id,
            timestamp: new Date().toISOString()
          });
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [user]);
};