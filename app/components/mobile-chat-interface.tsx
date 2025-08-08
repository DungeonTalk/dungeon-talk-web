import { useRef, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Send } from 'lucide-react'

interface ChatMessage {
  id: number
  text: string
  sender: string
  type: 'main' | 'party'
  timestamp: string
}

export default function MobileChatInterface() {
  const [activeTab, setActiveTab] = useState<'main' | 'party'>('main')
  const [currentMessage, setCurrentMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: '안녕하세요!', sender: '플레이어1', type: 'main', timestamp: '14:30' },
    { id: 2, text: '같이 던전 가실분?', sender: '플레이어2', type: 'main', timestamp: '14:31' },
    { id: 3, text: '보스 준비됐나요?', sender: '파티원A', type: 'party', timestamp: '14:32' },
    { id: 4, text: '네, 준비 완료!', sender: '파티원B', type: 'party', timestamp: '14:33' },
  ])

  const filtered = messages.filter(m => m.type === activeTab)

  const sendMessage = () => {
    const value = currentMessage.trim()
    if (!value) return
    setMessages(prev => prev.concat({
      id: Date.now(),
      text: value,
      sender: '나',
      type: activeTab,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }))
    setCurrentMessage('')
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="mx-auto flex max-w-md flex-col overflow-hidden rounded-3xl bg-slate-800 shadow-lg" style={{ height: 'calc(100vh - 2rem)' }}>
        {/* 상단 탭 */}
        <div className="flex-shrink-0 border-b border-slate-700 p-3">
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-800">
            <button
              className={`rounded-md py-2 text-sm ${activeTab === 'main' ? 'bg-white/10 text-white' : 'text-slate-300/70 hover:text-white'}`}
              onClick={() => setActiveTab('main')}
            >
              메인 채팅
            </button>
            <button
              className={`rounded-md py-2 text-sm ${activeTab === 'party' ? 'bg-white/10 text-white' : 'text-slate-300/70 hover:text-white'}`}
              onClick={() => setActiveTab('party')}
            >
              파티 채팅
            </button>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-4">
            <div className="space-y-3">
              {filtered.map(msg => (
                <div key={msg.id} className="rounded-lg border border-white/5 bg-black/20 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-400">{msg.sender}</span>
                    <span className="text-xs text-slate-400">{msg.timestamp}</span>
                  </div>
                  <div className="text-sm text-white">{msg.text}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 하단 패널 + 입력 */}
        <div className="flex-shrink-0 space-y-3 border-t border-slate-700 p-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-white/5 bg-black/20 p-3 text-center">
              <div className="text-xs text-slate-300">HP: <span className="text-green-400">85/100</span></div>
              <div className="text-xs text-slate-300">MP: <span className="text-blue-400">42/50</span></div>
            </div>
            <button className="rounded-lg border border-white/5 bg-black/20 px-3 py-3 text-sm text-white">
              인벤토리/스킬
            </button>
            <div className="rounded-lg border border-white/5 bg-black/20 p-3 text-center">
              <div className="text-xs text-slate-300">파티원A: <span className="text-white">20/20</span></div>
              <div className="text-xs text-slate-300">파티원B: <span className="text-white">18/20</span></div>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="채팅을 입력하세요..."
              className="flex-1 border-white/10 bg-black/20 text-white placeholder:text-slate-400"
            />
            <Button onClick={sendMessage} size="icon" className="h-10 w-10 bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
              <span className="sr-only">전송</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}