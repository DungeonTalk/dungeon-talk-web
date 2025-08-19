interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
}

interface UserData {
  id: string;
  email: string;
  [key: string]: any;
}

/**
 * 전역 토큰 관리를 위한 Static Class
 * 로그인 토큰, 사용자 정보를 중앙에서 관리하고 자동 갱신 처리
 */
export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'dgt_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'dgt_refresh_token';
  private static readonly TOKEN_EXPIRES_KEY = 'dgt_token_expires';
  private static readonly USER_INFO_KEY = 'dgt_user_info';
  private static readonly LOGGED_IN_KEY = 'dgt_logged_in';

  private static tokenData: TokenData | null = null;
  private static userData: UserData | null = null;
  private static refreshPromise: Promise<boolean> | null = null;

  /**
   * 토큰 저장
   */
  static setTokens(tokenData: TokenData, userData: UserData): void {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }

      // 메모리에 저장
      this.tokenData = tokenData;
      this.userData = userData;

      // localStorage에 저장
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.accessToken);
      localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userData));
      localStorage.setItem(this.LOGGED_IN_KEY, '1');

      if (tokenData.refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenData.refreshToken);
      }

      if (tokenData.expiresAt) {
        localStorage.setItem(this.TOKEN_EXPIRES_KEY, tokenData.expiresAt.toString());
      }

      console.log('[TokenManager] 토큰 저장 완료');
    } catch (error) {
      console.error('[TokenManager] 토큰 저장 실패:', error);
      throw new Error('토큰 저장에 실패했습니다.');
    }
  }

  /**
   * 현재 액세스 토큰 반환
   */
  static getAccessToken(): string | null {
    try {
      // 메모리에서 먼저 확인
      if (this.tokenData?.accessToken) {
        return this.tokenData.accessToken;
      }

      // localStorage에서 확인
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
      }

      return null;
    } catch (error) {
      console.error('[TokenManager] 액세스 토큰 조회 실패:', error);
      return null;
    }
  }

  /**
   * 리프레시 토큰 반환
   */
  static getRefreshToken(): string | null {
    try {
      if (this.tokenData?.refreshToken) {
        return this.tokenData.refreshToken;
      }

      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
      }

      return null;
    } catch (error) {
      console.error('[TokenManager] 리프레시 토큰 조회 실패:', error);
      return null;
    }
  }

  /**
   * 사용자 정보 반환
   */
  static getUserData(): UserData | null {
    try {
      // 메모리에서 먼저 확인
      if (this.userData) {
        return this.userData;
      }

      // localStorage에서 확인
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const userInfo = localStorage.getItem(this.USER_INFO_KEY);
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          this.userData = parsed;
          return parsed;
        }
      }

      return null;
    } catch (error) {
      console.error('[TokenManager] 사용자 정보 조회 실패:', error);
      return null;
    }
  }

  /**
   * 로그인 상태 확인
   */
  static isAuthenticated(): boolean {
    try {
      // 기존 방식과 호환성 유지 - dgt_logged_in 키 확인
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const loggedIn = localStorage.getItem(this.LOGGED_IN_KEY);
        if (loggedIn === '1') {
          const userData = this.getUserData();
          return !!userData;
        }
      }

      // 새 방식 - 토큰과 사용자 데이터 모두 확인
      const accessToken = this.getAccessToken();
      const userData = this.getUserData();
      
      return !!(accessToken && userData);
    } catch (error) {
      console.error('[TokenManager] 인증 상태 확인 실패:', error);
      return false;
    }
  }

  /**
   * 토큰 만료 여부 확인
   */
  static isTokenExpired(): boolean {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return true;
      }

      const expiresAt = localStorage.getItem(this.TOKEN_EXPIRES_KEY);
      if (!expiresAt) {
        return false; // 만료 시간이 없으면 만료되지 않은 것으로 간주
      }

      const expirationTime = parseInt(expiresAt, 10);
      const currentTime = Date.now();
      const buffer = 60 * 1000; // 1분 여유시간

      return currentTime >= (expirationTime - buffer);
    } catch (error) {
      console.error('[TokenManager] 토큰 만료 확인 실패:', error);
      return true;
    }
  }

  /**
   * Authorization 헤더용 토큰 반환
   */
  static getAuthorizationHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * 토큰 갱신
   */
  static async refreshAccessToken(): Promise<boolean> {
    try {
      // 이미 갱신 중이면 해당 Promise 반환
      if (this.refreshPromise) {
        return await this.refreshPromise;
      }

      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        console.warn('[TokenManager] 리프레시 토큰이 없습니다.');
        return false;
      }

      console.log('[TokenManager] 토큰 갱신 시작');
      
      this.refreshPromise = this.performTokenRefresh(refreshToken);
      const result = await this.refreshPromise;
      
      this.refreshPromise = null;
      return result;
    } catch (error) {
      console.error('[TokenManager] 토큰 갱신 실패:', error);
      this.refreshPromise = null;
      return false;
    }
  }

  /**
   * 실제 토큰 갱신 로직
   */
  private static async performTokenRefresh(refreshToken: string): Promise<boolean> {
    try {
      // TODO: 실제 API 호출로 교체 필요
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('토큰 갱신 API 호출 실패');
      }

      const data = await response.json();
      
      if (data.accessToken) {
        const newTokenData: TokenData = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || refreshToken,
          expiresAt: data.expiresAt,
          tokenType: data.tokenType || 'Bearer'
        };

        const userData = this.getUserData();
        if (userData) {
          this.setTokens(newTokenData, userData);
          console.log('[TokenManager] 토큰 갱신 성공');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('[TokenManager] 토큰 갱신 실패:', error);
      return false;
    }
  }

  /**
   * 로그아웃 - 모든 토큰과 사용자 정보 삭제
   */
  static clearTokens(): void {
    try {
      // 메모리 클리어
      this.tokenData = null;
      this.userData = null;

      // localStorage 클리어
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRES_KEY);
        localStorage.removeItem(this.USER_INFO_KEY);
        localStorage.removeItem(this.LOGGED_IN_KEY);
      }

      console.log('[TokenManager] 토큰 삭제 완료');
    } catch (error) {
      console.error('[TokenManager] 토큰 삭제 실패:', error);
    }
  }

  /**
   * 토큰 유효성 검사 및 필요시 갱신
   */
  static async ensureValidToken(): Promise<string | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      const accessToken = this.getAccessToken();
      
      // 토큰이 만료되지 않았으면 바로 반환
      if (!this.isTokenExpired()) {
        return accessToken;
      }

      // 토큰이 만료되었으면 갱신 시도
      console.log('[TokenManager] 토큰이 만료되어 갱신을 시도합니다.');
      const refreshSuccess = await this.refreshAccessToken();
      
      if (refreshSuccess) {
        return this.getAccessToken();
      } else {
        console.warn('[TokenManager] 토큰 갱신에 실패했습니다. 로그아웃 처리합니다.');
        this.clearTokens();
        return null;
      }
    } catch (error) {
      console.error('[TokenManager] 토큰 유효성 검사 실패:', error);
      return null;
    }
  }

  /**
   * 초기화 - 앱 시작시 localStorage에서 토큰 로드
   */
  static initialize(): void {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }

      // 기존 방식과의 호환성 확인
      const loggedIn = localStorage.getItem(this.LOGGED_IN_KEY);
      const userInfo = localStorage.getItem(this.USER_INFO_KEY);

      if (loggedIn === '1' && userInfo) {
        try {
          this.userData = JSON.parse(userInfo);
          console.log('[TokenManager] 초기화 완료 - 기존 방식 호환 (dgt_logged_in)');
        } catch (parseError) {
          console.error('[TokenManager] 사용자 정보 파싱 실패:', parseError);
          this.clearTokens();
          return;
        }
      }

      // 새로운 토큰 방식도 확인
      const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      const expiresAt = localStorage.getItem(this.TOKEN_EXPIRES_KEY);

      if (accessToken) {
        this.tokenData = {
          accessToken,
          refreshToken: refreshToken || undefined,
          expiresAt: expiresAt ? parseInt(expiresAt, 10) : undefined,
        };
        console.log('[TokenManager] 초기화 완료 - 새로운 토큰 방식');
      }
    } catch (error) {
      console.error('[TokenManager] 초기화 실패:', error);
    }
  }
}