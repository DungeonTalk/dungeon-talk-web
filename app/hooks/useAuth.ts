import { useState, useEffect, useCallback } from 'react';
import { TokenManager } from '@/lib/token-manager';

interface User {
  id: string;
  memberId?: string;  // 백엔드에서 받는 실제 회원 ID
  email: string;
  nickname?: string;
  [key: string]: any;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (userInfo: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

/**
 * TokenManager를 사용하는 로그인 인증 상태 관리 Hook
 */
export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkAuth = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useAuth] checkAuth 시작');

      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.log('[useAuth] window/localStorage 없음');
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const loggedIn = localStorage.getItem('dgt_logged_in');
      const userInfo = localStorage.getItem('dgt_user_info');

      console.log('[useAuth] localStorage 값:', { loggedIn, userInfo });

      if (loggedIn === '1' && userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          console.log('[useAuth] 사용자 파싱 성공:', parsedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (parseError) {
          console.error('[useAuth] 사용자 정보 파싱 실패:', parseError);
          // 사용자 정보 파싱 실패 시 로그아웃 처리
          localStorage.removeItem('dgt_logged_in');
          localStorage.removeItem('dgt_user_info');
          setUser(null);
          setIsAuthenticated(false);
          setError(new Error('사용자 정보 파싱 오류'));
        }
      } else {
        console.log('[useAuth] 로그인 안됨');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (authError) {
      console.error('[useAuth] checkAuth 에러:', authError);
      setUser(null);
      setIsAuthenticated(false);
      setError(authError as Error);
    } finally {
      setIsLoading(false);
      console.log('[useAuth] checkAuth 완료');
    }
  }, []);

  const login = useCallback((userInfo: User) => {
    try {
      localStorage.setItem('dgt_logged_in', '1');
      localStorage.setItem('dgt_user_info', JSON.stringify(userInfo));
      setUser(userInfo);
      setIsAuthenticated(true);
      setError(null);
      console.log('[useAuth] 로그인 성공:', userInfo);
    } catch (loginError) {
      console.error('[useAuth] 로그인 실패:', loginError);
      setError(new Error('로그인 처리 중 오류가 발생했습니다.'));
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('dgt_logged_in');
      localStorage.removeItem('dgt_user_info');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      console.log('[useAuth] 로그아웃 완료');
    } catch (logoutError) {
      console.error('[useAuth] 로그아웃 실패:', logoutError);
      setError(new Error('로그아웃 처리 중 오류가 발생했습니다.'));
    }
  }, []);

  // 초기 인증 상태 확인
  useEffect(() => {
    console.log('[useAuth] useEffect 실행, checkAuth 호출');
    checkAuth();
  }, [checkAuth]);

  // localStorage 변경 감지 (다른 탭에서의 로그인/로그아웃)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      // TokenManager가 관리하는 키들 감지
      if (
        e.key === 'dgt_access_token' || 
        e.key === 'dgt_user_info' ||
        e.key === 'dgt_logged_in'
      ) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    checkAuth
  };
};