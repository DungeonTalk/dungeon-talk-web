import { useEffect } from 'react';

/**
 * 개발 환경에서 콘솔 로그를 출력하는 Hook
 * 
 * @param message - 출력할 메시지
 * @param data - 함께 출력할 데이터 (선택사항)
 * @param type - 로그 타입 ('log' | 'warn' | 'error' | 'info')
 */
export const useConsoleLog = (
  message: string,
  data?: any,
  type: 'log' | 'warn' | 'error' | 'info' = 'log'
) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const logMethod = console[type];
      
      if (data !== undefined) {
        logMethod(`[${type.toUpperCase()}] ${message}:`, data);
      } else {
        logMethod(`[${type.toUpperCase()}] ${message}`);
      }
    }
  }, [message, data, type]);
};

/**
 * 렌더링 로그를 추적하는 Hook
 * 
 * @param componentName - 컴포넌트 이름
 * @param props - 컴포넌트 props (선택사항)
 */
export const useRenderLog = (componentName: string, props?: any) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      if (props) {
        console.log(`[RENDER] ${componentName} rendered with props:`, props);
      } else {
        console.log(`[RENDER] ${componentName} rendered`);
      }
    }
  });
};

/**
 * 마운트/언마운트 로그를 추적하는 Hook
 * 
 * @param componentName - 컴포넌트 이름
 */
export const useLifecycleLog = (componentName: string) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`[LIFECYCLE] ${componentName} mounted`);
      
      return () => {
        console.log(`[LIFECYCLE] ${componentName} unmounted`);
      };
    }
  }, [componentName]);
};

/**
 * 상태 변경 로그를 추적하는 Hook
 * 
 * @param stateName - 상태 이름
 * @param stateValue - 상태 값
 */
export const useStateLog = (stateName: string, stateValue: any) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`[STATE] ${stateName} changed to:`, stateValue);
    }
  }, [stateName, stateValue]);
};