// WebSocket 연결 테스트 스크립트
const SockJS = require('sockjs-client');
const { Client } = require('@stomp/stompjs');

// 테스트용 토큰 (실제 토큰으로 교체 필요)
const token = 'YOUR_ACCESS_TOKEN_HERE';

console.log('WebSocket 연결 테스트 시작...');

const client = new Client({
  webSocketFactory: () => {
    const sockJsUrl = 'http://localhost:8080/ws-chat';
    console.log('SockJS 연결 시도:', sockJsUrl);
    return new SockJS(sockJsUrl);
  },
  
  connectHeaders: {
    Authorization: `Bearer ${token}`,
  },
  
  debug: (str) => {
    console.log('[STOMP Debug]', str);
  },
  
  onConnect: () => {
    console.log('✅ WebSocket 연결 성공!');
    
    // 테스트 구독
    client.subscribe('/sub/chat/room/test-room', (message) => {
      console.log('메시지 수신:', JSON.parse(message.body));
    });
    
    // 테스트 메시지 전송
    setTimeout(() => {
      const testMessage = {
        roomId: 'test-room',
        memberId: 'test-user',
        message: 'Hello WebSocket!',
        nickname: 'Tester',
        type: 'TALK',
        timestamp: Date.now(),
      };
      
      client.publish({
        destination: '/pub/chat/send',
        body: JSON.stringify(testMessage),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('테스트 메시지 전송:', testMessage);
    }, 1000);
    
    // 5초 후 연결 종료
    setTimeout(() => {
      client.deactivate();
      console.log('연결 종료');
      process.exit(0);
    }, 5000);
  },
  
  onDisconnect: () => {
    console.log('WebSocket 연결 해제');
  },
  
  onStompError: (frame) => {
    console.error('❌ STOMP 에러:', frame.headers['message']);
    console.error('에러 내용:', frame.body);
  },
  
  onWebSocketError: (error) => {
    console.error('❌ WebSocket 에러:', error);
  },
});

// 연결 시작
client.activate();

// 프로세스 종료 처리
process.on('SIGINT', () => {
  console.log('\n종료 중...');
  client.deactivate();
  process.exit(0);
});