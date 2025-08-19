import { useCallback } from 'react';

/**
 * 사용자 액션을 로그로 추적하는 Hook
 */
export const useUserActionLog = () => {
  const logUserAction = useCallback((action: string, details?: any) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[USER ACTION] ${timestamp} - ${action}`, details || '');
    }
  }, []);

  const logButtonClick = useCallback((buttonName: string, additionalData?: any) => {
    logUserAction(`버튼 클릭: ${buttonName}`, additionalData);
  }, [logUserAction]);

  const logFormSubmit = useCallback((formName: string, formData?: any) => {
    logUserAction(`폼 제출: ${formName}`, formData);
  }, [logUserAction]);

  const logNavigation = useCallback((from: string, to: string) => {
    logUserAction(`페이지 이동`, { from, to });
  }, [logUserAction]);

  const logInputChange = useCallback((inputName: string, value: any) => {
    logUserAction(`입력 변경: ${inputName}`, { value });
  }, [logUserAction]);

  const logModalAction = useCallback((modalName: string, action: 'open' | 'close') => {
    logUserAction(`모달 ${action === 'open' ? '열기' : '닫기'}: ${modalName}`);
  }, [logUserAction]);

  return {
    logUserAction,
    logButtonClick,
    logFormSubmit,
    logNavigation,
    logInputChange,
    logModalAction
  };
};

/**
 * 게임 관련 사용자 액션을 로그로 추적하는 Hook
 */
export const useGameActionLog = () => {
  const logGameAction = useCallback((action: string, gameData?: any) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[GAME ACTION] ${timestamp} - ${action}`, gameData || '');
    }
  }, []);

  const logChatMessage = useCallback((message: string, messageType: 'user' | 'ai' | 'system') => {
    logGameAction(`채팅 메시지 전송 (${messageType})`, { message });
  }, [logGameAction]);

  const logGameRoomJoin = useCallback((roomId: string, roomType: 'single' | 'multi') => {
    logGameAction(`게임방 입장 (${roomType})`, { roomId });
  }, [logGameAction]);

  const logGameRoomLeave = useCallback((roomId: string) => {
    logGameAction('게임방 퇴장', { roomId });
  }, [logGameAction]);

  const logCharacterAction = useCallback((action: string, characterData?: any) => {
    logGameAction(`캐릭터 액션: ${action}`, characterData);
  }, [logGameAction]);

  const logGamePhaseChange = useCallback((from: string, to: string, roomId: string) => {
    logGameAction('게임 페이즈 변경', { from, to, roomId });
  }, [logGameAction]);

  return {
    logGameAction,
    logChatMessage,
    logGameRoomJoin,
    logGameRoomLeave,
    logCharacterAction,
    logGamePhaseChange
  };
};