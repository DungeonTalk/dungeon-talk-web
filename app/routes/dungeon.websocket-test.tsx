import { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

export default function WebSocketTestPage() {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('test-room-001');
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const {
    isConnected,
    messages,
    currentRoomId,
    error,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    clearMessages,
  } = useWebSocket();

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await sendMessage(message);
      setMessage('');
    } catch (err) {
      console.error('메시지 전송 실패:', err);
    }
  };

  // 엔터키로 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 채팅방 입장
  const handleJoinRoom = async () => {
    if (!roomId.trim()) return;
    
    try {
      if (!isConnected) {
        await connect();
      }
      await joinRoom(roomId);
    } catch (err) {
      console.error('채팅방 입장 실패:', err);
    }
  };

  // 메시지 목록이 업데이트될 때 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">WebSocket 채팅 테스트</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 연결 제어 패널 */}
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="pt-4">
              <h2 className="text-lg font-semibold text-white mb-3">연결 제어</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-slate-300">연결 상태:</span>
                    <Badge className={isConnected ? 'bg-green-600' : 'bg-red-600'}>
                      {isConnected ? '연결됨' : '연결 안됨'}
                    </Badge>
                  </div>
                  
                  {currentRoomId && (
                    <div className="text-sm text-slate-300">
                      현재 방: <span className="text-white">{currentRoomId}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-1 block">채팅방 ID</label>
                  <Input 
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="채팅방 ID 입력"
                    className="bg-black/20 border-white/10 text-white mb-2"
                  />
                </div>

                <div className="space-y-2">
                  {!isConnected ? (
                    <Button 
                      onClick={connect}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      WebSocket 연결
                    </Button>
                  ) : (
                    <Button 
                      onClick={disconnect}
                      className="w-full bg-gray-600 hover:bg-gray-700"
                    >
                      연결 해제
                    </Button>
                  )}

                  {isConnected && !currentRoomId && (
                    <Button 
                      onClick={handleJoinRoom}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      채팅방 입장
                    </Button>
                  )}

                  {isConnected && currentRoomId && (
                    <Button 
                      onClick={leaveRoom}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      채팅방 퇴장
                    </Button>
                  )}

                  <Button 
                    onClick={clearMessages}
                    className="w-full bg-gray-600 hover:bg-gray-700"
                  >
                    메시지 지우기
                  </Button>
                </div>

                {error && (
                  <div className="text-red-400 text-sm">
                    에러: {error}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-600">
                  <div className="text-xs text-slate-400">
                    <div>사용자: {user?.email || '익명'}</div>
                    <div>ID: {user?.id || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 채팅 영역 */}
          <Card className="bg-slate-700 border-slate-600 lg:col-span-2">
            <CardContent className="pt-4 flex flex-col h-[600px]">
              <h2 className="text-lg font-semibold text-white mb-3">채팅</h2>
              
              {/* 메시지 목록 */}
              <ScrollArea className="flex-1 mb-3" ref={scrollRef}>
                <div className="space-y-2 pr-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      메시지가 없습니다.
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div 
                        key={msg.messageId || index}
                        className={`p-3 rounded-lg ${
                          msg.type === 'ENTER' || msg.type === 'LEAVE' 
                            ? 'bg-yellow-900/30 text-center text-yellow-300 text-sm'
                            : msg.type === 'SYSTEM'
                            ? 'bg-blue-900/30 text-center text-blue-300 text-sm'
                            : msg.memberId === user?.id
                            ? 'bg-blue-600/20 ml-auto max-w-[70%]'
                            : 'bg-purple-600/20 mr-auto max-w-[70%]'
                        }`}
                      >
                        {msg.type === 'TALK' && (
                          <div className="text-xs text-slate-400 mb-1">
                            {msg.nickname || '익명'}
                          </div>
                        )}
                        <div className="text-white">
                          {msg.message}
                        </div>
                        {msg.timestamp && (
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* 메시지 입력 */}
              {isConnected && currentRoomId ? (
                <div className="flex gap-2">
                  <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요..."
                    className="bg-black/20 border-white/10 text-white"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    전송
                  </Button>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-3 bg-black/20 rounded-lg">
                  {!isConnected 
                    ? 'WebSocket에 연결해주세요.'
                    : '채팅방에 입장해주세요.'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 사용 방법 */}
        <Card className="bg-slate-700 border-slate-600 mt-4">
          <CardContent className="pt-4">
            <h3 className="text-lg font-semibold text-white mb-2">사용 방법</h3>
            <ol className="list-decimal list-inside text-slate-300 space-y-1">
              <li>WebSocket 연결 버튼을 클릭하여 서버에 연결합니다.</li>
              <li>채팅방 ID를 입력하고 입장 버튼을 클릭합니다.</li>
              <li>메시지를 입력하고 전송 버튼을 클릭하거나 Enter 키를 누릅니다.</li>
              <li>같은 채팅방에 있는 다른 사용자들과 실시간으로 대화할 수 있습니다.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}