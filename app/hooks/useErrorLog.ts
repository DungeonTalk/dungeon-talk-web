import { useEffect, useCallback } from 'react';

/**
 * 에러 로그를 추적하고 관리하는 Hook
 */
export const useErrorLog = () => {
  const logError = useCallback((error: Error, errorInfo?: any) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.group(`[ERROR] ${error.name}`);
      console.error('메시지:', error.message);
      console.error('스택 트레이스:', error.stack);
      if (errorInfo) {
        console.error('추가 정보:', errorInfo);
      }
      console.groupEnd();
    }
  }, []);

  const logWarning = useCallback((message: string, data?: any) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn(`[WARNING] ${message}`, data);
    }
  }, []);

  const logInfo = useCallback((message: string, data?: any) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.info(`[INFO] ${message}`, data);
    }
  }, []);

  // 전역 에러 핸들러 등록
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const handleError = (event: ErrorEvent) => {
        logError(new Error(event.message), {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        logError(new Error('Unhandled Promise Rejection'), {
          reason: event.reason
        });
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, [logError]);

  return {
    logError,
    logWarning,
    logInfo
  };
};

/**
 * 특정 컴포넌트의 에러 경계를 추적하는 Hook
 * 
 * @param componentName - 컴포넌트 이름
 */
export const useErrorBoundaryLog = (componentName: string) => {
  const logComponentError = useCallback((error: Error, errorInfo: any) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.group(`[ERROR BOUNDARY] ${componentName}`);
      console.error('컴포넌트 에러:', error);
      console.error('컴포넌트 스택:', errorInfo.componentStack);
      console.groupEnd();
    }
  }, [componentName]);

  return { logComponentError };
};