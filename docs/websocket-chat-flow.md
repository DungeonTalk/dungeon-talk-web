# WebSocket 채팅 연결 및 메시지 플로우

## 개요
DungeonTalk 프로젝트의 WebSocket 기반 실시간 채팅 시스템의 연결 및 메시지 전송 플로우를 설명합니다.

## 기술 스택
- **프론트엔드**: React (Remix), @stomp/stompjs, sockjs-client
- **백엔드**: Spring Boot, Spring WebSocket, STOMP
- **인증**: JWT (JSON Web Token)
- **메시지 브로커**: Redis Pub/Sub

## 1. WebSocket 연결 플로우

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as 프론트엔드
    participant TokenMgr as TokenManager
    participant WebSocket as WebSocketManager
    participant Backend as 백엔드
    participant Redis as Redis

    User->>Frontend: 로그인 요청
    Frontend->>Backend: POST /v1/auth/signin
    Backend-->>Frontend: JWT accessToken 반환
    Frontend->>TokenMgr: 토큰 저장 (localStorage)
    
    User->>Frontend: 채팅방 입장 클릭
    Frontend->>TokenMgr: ensureValidToken()
    TokenMgr-->>Frontend: 유효한 토큰 반환
    
    Frontend->>WebSocket: connect(roomId)
    WebSocket->>Backend: SockJS 연결<br/>URL: /ws-chat?token={JWT}&roomId={roomId}
    
    Backend->>Backend: JWT 토큰 검증
    Backend->>Backend: WebSocket 세션에<br/>memberId 저장
    Backend-->>WebSocket: 연결 성공 (CONNECTED)
    
    WebSocket->>Backend: STOMP CONNECT
    Backend-->>WebSocket: CONNECTED Frame
    
    WebSocket->>Frontend: onConnect() 콜백
    Frontend->>User: 연결 상태 표시
```

## 2. 채팅방 구독 플로우

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as 프론트엔드
    participant WebSocket as WebSocketManager
    participant Backend as 백엔드
    participant Redis as Redis

    User->>Frontend: 채팅방 입장
    Frontend->>WebSocket: subscribeToRoom(roomId)
    
    WebSocket->>Backend: STOMP SUBSCRIBE<br/>/sub/chat/room/{roomId}
    
    Backend->>Redis: 채널 구독 등록
    Redis-->>Backend: 구독 확인
    
    Backend-->>WebSocket: 구독 성공
    WebSocket-->>Frontend: 구독 완료
    
    Frontend->>WebSocket: sendEnterMessage()
    WebSocket->>Backend: STOMP SEND<br/>/pub/chat/send<br/>type: JOIN
    
    Backend->>Backend: 세션에서 memberId 추출
    Backend->>Backend: 입장 처리 (ChatRoomService)
    Backend->>Redis: 입장 메시지 발행
    
    Redis-->>Backend: 구독자들에게 전달
    Backend-->>WebSocket: 입장 메시지 브로드캐스트
    WebSocket->>Frontend: onMessage() 콜백
    Frontend->>User: "OOO님이 입장했습니다" 표시
```

## 3. 메시지 전송 플로우

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as 프론트엔드
    participant WebSocket as WebSocketManager
    participant Backend as 백엔드 (ChatStompController)
    participant Service as ChatMessageService
    participant DB as MongoDB
    participant Redis as Redis

    User->>Frontend: 메시지 입력 및 전송
    Frontend->>WebSocket: sendMessage(content)
    
    Note over WebSocket: 메시지 객체 생성<br/>{roomId, content, type: TALK}<br/>senderId는 빈 문자열
    
    WebSocket->>Backend: STOMP SEND<br/>/pub/chat/send
    
    Backend->>Backend: 세션에서 memberId 추출
    Backend->>Backend: dto.setSenderId(memberId)
    
    Backend->>Service: processMessage(dto)
    Service->>Service: 메시지 검증 및 필터링
    Service->>DB: 메시지 저장
    
    Service->>Service: ChatMessageDto 생성<br/>(닉네임 포함)
    Service->>Redis: 메시지 발행<br/>roomId 채널
    
    Redis-->>Backend: 구독자들에게 전달
    Backend-->>WebSocket: 메시지 브로드캐스트<br/>/sub/chat/room/{roomId}
    
    WebSocket->>Frontend: onMessage() 콜백
    Frontend->>Frontend: 닉네임으로 본인 메시지 판별
    Frontend->>User: 메시지 표시 (본인/타인 구분)
```

## 4. WebSocket 연결 해제 플로우

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as 프론트엔드
    participant WebSocket as WebSocketManager
    participant Backend as 백엔드
    participant Redis as Redis

    User->>Frontend: 채팅방 나가기 또는<br/>페이지 이탈
    
    Frontend->>WebSocket: sendLeaveMessage()
    WebSocket->>Backend: STOMP SEND<br/>type: LEAVE
    
    Backend->>Backend: 세션에서 memberId 추출
    Backend->>Backend: 퇴장 처리 (ChatRoomService)
    Backend->>Redis: 퇴장 메시지 발행
    
    Frontend->>WebSocket: disconnect()
    WebSocket->>WebSocket: subscription.unsubscribe()
    WebSocket->>Backend: STOMP DISCONNECT
    
    Backend->>Redis: 구독 해제
    Backend->>Backend: WebSocket 세션 정리
    Backend-->>WebSocket: 연결 종료
    
    WebSocket->>Frontend: onDisconnect() 콜백
    Frontend->>User: 연결 해제 상태 표시
```

## 5. 주요 구성 요소

### 프론트엔드 컴포넌트

```mermaid
graph TB
    subgraph Frontend ["프론트엔드"]
        TokenManager["TokenManager<br/>- JWT 토큰 관리<br/>- 토큰 유효성 검증<br/>- 사용자 정보 추출"]
        
        WebSocketManager["WebSocketManager<br/>- WebSocket 연결 관리<br/>- STOMP 프로토콜 처리<br/>- 메시지 송수신"]
        
        useWebSocket["useWebSocket Hook<br/>- React Hook<br/>- 상태 관리<br/>- UI 연동"]
        
        ChatUI["Chat UI Component<br/>- 메시지 표시<br/>- 입력 처리<br/>- 사용자 인터페이스"]
    end
    
    ChatUI --> useWebSocket
    useWebSocket --> WebSocketManager
    WebSocketManager --> TokenManager
```

### 백엔드 컴포넌트

```mermaid
graph TB
    subgraph Backend ["백엔드"]
        WebSocketConfig["WebSocketConfig<br/>- STOMP 엔드포인트 설정<br/>- 메시지 브로커 구성<br/>- 인터셉터 설정"]
        
        ChatStompController["ChatStompController<br/>- 메시지 매핑<br/>- 세션 관리<br/>- senderId 자동 설정"]
        
        ChatMessageService["ChatMessageService<br/>- 메시지 처리 로직<br/>- 필터링 및 검증<br/>- DB 저장"]
        
        ChatRoomService["ChatRoomService<br/>- 채팅방 관리<br/>- 입장/퇴장 처리<br/>- 참여자 관리"]
        
        RedisPublisher["RedisPublisher<br/>- Redis Pub/Sub<br/>- 메시지 브로드캐스팅"]
    end
    
    WebSocketConfig --> ChatStompController
    ChatStompController --> ChatMessageService
    ChatStompController --> ChatRoomService
    ChatMessageService --> RedisPublisher
    ChatRoomService --> RedisPublisher
```

## 6. 메시지 구조

### 클라이언트 → 서버 (전송)
```typescript
interface ChatMessageSend {
  roomId: string;        // 채팅방 ID
  senderId: '';         // 빈 문자열 (서버에서 자동 설정)
  content: string;      // 메시지 내용
  type: 'TALK' | 'JOIN' | 'LEAVE';
  senderNickname?: string;  // 닉네임 (표시용)
  createdAt: string;    // ISO 8601 형식
}
```

### 서버 → 클라이언트 (수신)
```typescript
interface ChatMessageReceive {
  messageId: string;    // 메시지 고유 ID
  roomId: string;       // 채팅방 ID
  senderId: string;     // 발신자 ID (서버 설정)
  senderNickname: string; // 발신자 닉네임
  content: string;      // 메시지 내용
  type: 'TALK' | 'JOIN' | 'LEAVE' | 'PRESENCE';
  createdAt: string;    // 생성 시간
  connectedCount?: number; // 접속자 수 (PRESENCE)
}
```

## 7. 보안 및 인증

### JWT 토큰 기반 인증
1. **연결 시점**: WebSocket 연결 시 쿼리 파라미터로 JWT 토큰 전달
   - URL: `/ws-chat?token={JWT}&roomId={roomId}`
2. **세션 관리**: 백엔드에서 WebSocket 세션에 memberId 저장
3. **메시지 전송**: 각 메시지마다 토큰 불필요 (세션 유지)

### 보안 특징
- **senderId 자동 설정**: 클라이언트가 senderId를 조작할 수 없음
- **세션 기반 인증**: 연결 시 한 번만 인증, 이후 세션으로 관리
- **데이터베이스 ID 미노출**: 프론트엔드에서 memberId 직접 사용 안 함

## 8. 에러 처리

```mermaid
graph TD
    Start[메시지 전송 시작] --> CheckConn{연결 확인}
    CheckConn -->|연결됨| CheckRoom{채팅방 확인}
    CheckConn -->|연결 안됨| ConnError[연결 에러 표시]
    
    CheckRoom -->|입장함| ValidateMsg{메시지 검증}
    CheckRoom -->|미입장| RoomError[채팅방 에러 표시]
    
    ValidateMsg -->|유효함| SendMsg[메시지 전송]
    ValidateMsg -->|무효함| ValidationError[검증 에러 표시]
    
    SendMsg --> CheckResponse{응답 확인}
    CheckResponse -->|성공| Success[메시지 표시]
    CheckResponse -->|실패| SendError[전송 에러 표시]
    
    ConnError --> Retry[재연결 시도]
    RoomError --> RejoinRoom[채팅방 재입장]
    ValidationError --> End[종료]
    SendError --> Retry
    Success --> End
```

## 9. 성능 최적화

### 프론트엔드
- **동적 Import**: SSR 환경에서 sockjs-client 동적 로딩
- **메시지 중복 방지**: messageId로 중복 체크
- **연결 재사용**: 싱글톤 WebSocketManager 인스턴스

### 백엔드
- **Redis Pub/Sub**: 효율적인 메시지 브로드캐스팅
- **세션 캐싱**: WebSocket 세션에 사용자 정보 캐싱
- **비동기 처리**: 메시지 처리 및 브로드캐스팅 비동기화

## 10. 트러블슈팅

### 일반적인 문제와 해결책

| 문제 | 원인 | 해결책 |
|------|------|--------|
| 메시지가 보이지 않음 | 구독 경로 불일치 | `/sub/chat/room/{roomId}` 경로 확인 |
| 본인 메시지 구분 안 됨 | senderId 불일치 | 닉네임으로 비교하도록 변경 |
| WebSocket 연결 실패 | 토큰 없음/만료 | TokenManager.ensureValidToken() 사용 |
| SSR 에러 | Node.js 모듈 import | 동적 import 사용 |
| 메시지 검증 실패 | senderId 필수 검증 | 백엔드에서 자동 설정으로 변경 |

## 11. 향후 개선 사항

- [ ] WebSocket 재연결 로직 강화
- [ ] 메시지 암호화
- [ ] 읽음 확인 기능
- [ ] 타이핑 인디케이터
- [ ] 파일 전송 지원
- [ ] 오프라인 메시지 큐잉
- [ ] 메시지 히스토리 페이징 최적화