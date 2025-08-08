import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button } from '../components/ui/button'

export default function SinglePlayPage() {
  const [searchParams] = useSearchParams()
  const selectedWorld = searchParams.get('world') || ''
  const [isChatActive, setIsChatActive] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{id: number, text: string, sender: string}>>([
    { id: 1, text: "던전에 입장했습니다.", sender: "시스템" },
    { id: 2, text: "앞에 보물상자가 보입니다.", sender: "내레이터" }
  ])
  const [currentMessage, setCurrentMessage] = useState('')

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        text: currentMessage,
        sender: "플레이어"
      }])
      setCurrentMessage('')
    }
  }

  return (
    <div className="flex flex-col h-full">
        {/* 채팅 탭 */}
        <div className="bg-slate-800 px-4 pb-4 flex-shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-lg bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              메인 채팅
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-lg border-slate-600 text-slate-400 hover:bg-slate-700"
            >
              파티 채팅
            </Button>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 - 채팅 */}
        <div className="flex-1 px-4 pb-4 overflow-hidden">
          <div className="bg-slate-800 rounded-lg h-full p-4 flex flex-col relative">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-cyan-400 font-semibold text-sm mb-1">플레이어1</div>
                  <div className="text-white text-sm">안녕하세요</div>
                </div>
                <div className="text-slate-500 text-xs">14:30</div>
              </div>
            
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-cyan-400 font-semibold text-sm mb-1">플레이어2</div>
                  <div className="text-white text-sm">같이 던전 가실분?</div>
                </div>
                <div className="text-slate-500 text-xs">14:31</div>
              </div>

              {chatMessages.map((message) => (
                <div key={message.id} className="flex justify-between items-start">
                  <div>
                    <div className="text-cyan-400 font-semibold text-sm mb-1">{message.sender}</div>
                    <div className="text-white text-sm">{message.text}</div>
                  </div>
                  <div className="text-slate-500 text-xs">
                    {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          
            {/* 오른쪽 하트 버튼 */}
            <div className="absolute right-4 top-4 space-y-2">
              <Button
                size="sm"
                className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 p-0"
              >
                <span className="text-white">♥</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-10 h-10 rounded-full border-slate-600 bg-slate-700 hover:bg-slate-600 p-0"
              >
                <span className="text-slate-400">♥</span>
              </Button>
            </div>
          
            {/* 채팅 입력 */}
            {isChatActive && (
              <div className="flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400"
                  autoFocus
                />
                <Button onClick={handleSendMessage} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                  전송
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 하단 인터페이스 */}
        <div className="bg-slate-800 p-4 flex justify-between items-center flex-shrink-0">
          <Button
            variant={isChatActive ? "default" : "outline"}
            className={`w-16 h-16 rounded-full flex flex-col items-center justify-center ${
              isChatActive 
                ? "bg-slate-700 text-white" 
                : "border-slate-600 bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
            onClick={() => setIsChatActive(!isChatActive)}
          >
            <div className="text-lg mb-1">💬</div>
            <div className="text-xs">채팅</div>
          </Button>
        
          {/* 체력/상태 바 */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">♥</span>
              <span className="text-white text-sm font-semibold">85/100</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">🛡</span>
              <span className="text-white text-sm font-semibold">42/50</span>
            </div>
          </div>
        
          <Button
            variant="outline"
            className="w-16 h-16 rounded-full flex flex-col items-center justify-center border-slate-600 bg-slate-800 text-slate-400 hover:bg-slate-700"
            onClick={() => {/* 가방 기능 */}}
          >
            <div className="text-lg mb-1">🎒</div>
            <div className="text-xs">가방</div>
          </Button>
        </div>
    </div>
  )
}