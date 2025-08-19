// 애플리케이션 라우트 경로 상수 정의
export const ROUTES = {
  // 메인 페이지
  HOME: '/',
  
  // 인증 관련
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  
  // 던전 관련
  DUNGEON: '/dungeon',
  DUNGEON_MODE_SELECTION: '/dungeon/mode-selection',
  DUNGEON_PARTY_FINDING: '/dungeon/party-finding',
  DUNGEON_MULTI_PLAY: '/dungeon/multi-play',
  DUNGEON_SINGLE_PLAY: '/dungeon/single-play',
  DUNGEON_CHAT_DEMO: '/dungeon/chat-demo',
} as const

// 타입 정의
export type RouteKeys = keyof typeof ROUTES
export type RouteValues = typeof ROUTES[RouteKeys]

// 상대 경로 헬퍼 (React Router Link 컴포넌트용)
export const RELATIVE_ROUTES = {
  // 인증
  SIGNIN: 'signin',
  SIGNUP: 'signup',
  
  // 던전 내비게이션
  MODE_SELECTION: 'mode-selection',
  PARTY_FINDING: 'party-finding',
  MULTI_PLAY: 'multi-play',
  SINGLE_PLAY: 'single-play',
  CHAT_DEMO: 'chat-demo',
  
  // 뒤로가기
  BACK: '..',
} as const