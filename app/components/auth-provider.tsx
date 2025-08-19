import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, useTokenRefresh } from '~/hooks';
import { ROUTES } from '@/constants/routes';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  error: Error | null;
  login: (userInfo: any, tokens: any) => void;
  logout: () => void;
  checkAuth: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 전역 인증 상태를 제공하는 Provider
 * TokenManager와 자동 토큰 갱신을 포함
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const auth = useAuth();

  // 토큰 자동 갱신 설정
  const tokenRefresh = useTokenRefresh({
    refreshInterval: 60 * 1000, // 1분마다 확인
    refreshBeforeExpiry: 5 * 60 * 1000, // 5분 전에 갱신
    autoRefresh: true,
    onRefreshSuccess: () => {
      console.log('[AuthProvider] 토큰 갱신 성공');
      // 갱신 성공 시 인증 상태 재확인
      auth.checkAuth();
    },
    onRefreshFailure: (error) => {
      console.error('[AuthProvider] 토큰 갱신 실패:', error);
      // 갱신 실패 시 로그아웃 처리
      auth.logout();
    },
    onTokenExpired: () => {
      console.log('[AuthProvider] 토큰 만료, 로그인 페이지로 이동');
      // 토큰 만료 시 로그인 페이지로 리디렉션
      navigate(ROUTES.SIGNIN);
    }
  });

  // 로그아웃 시 자동 갱신 중지
  useEffect(() => {
    if (!auth.isAuthenticated) {
      tokenRefresh.stopAutoRefresh();
    } else {
      tokenRefresh.startAutoRefresh();
    }
  }, [auth.isAuthenticated, tokenRefresh]);

  const contextValue: AuthContextType = {
    ...auth,
    refreshToken: tokenRefresh.manualRefresh
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * AuthContext를 사용하는 Hook
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};