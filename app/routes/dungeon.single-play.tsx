import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { ScrollArea } from '../components/ui/scroll-area'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PanInfo } from 'framer-motion'

interface ChatMessage {
  id: number
  text: string
  sender: string
  type: 'main' | 'party'
  timestamp: string
}

export default function SinglePlayPage() {
  const [searchParams] = useSearchParams()
  const selectedWorld = searchParams.get('world') || ''
  const [activeTab, setActiveTab] = useState<'main' | 'party'>('main')
  const [currentMessage, setCurrentMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: '던전에 입장했습니다.', sender: '시스템', type: 'main', timestamp: '14:30' },
    { id: 2, text: '앞에 보물상자가 보입니다.', sender: '내레이터', type: 'main', timestamp: '14:31' },
    { id: 3, text: '보물상자를 열어보시겠습니까?', sender: '시스템', type: 'party', timestamp: '14:32' },
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

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold && activeTab === 'main') {
      setActiveTab('party')
    } else if (info.offset.x < -threshold && activeTab === 'party') {
      setActiveTab('main')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="mx-auto flex max-w-md flex-col overflow-hidden rounded-3xl bg-slate-800 shadow-lg" style={{ height: 'calc(100vh - 2rem)' }}>
        {/* 메시지 영역 */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 flex"
            animate={{ x: activeTab === 'party' ? '-100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ width: '200%' }}
          >
            {/* 메인 채팅 */}
            <div className="w-1/2 flex-shrink-0">
              <ScrollArea className="h-full px-4 py-4">
                <div className="space-y-3">
                  {messages.filter(m => m.type === 'main').map(msg => (
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

            {/* 파티 채팅 */}
            <div className="w-1/2 flex-shrink-0">
              <ScrollArea className="h-full px-4 py-4">
                <div className="space-y-3">
                  {messages.filter(m => m.type === 'party').map(msg => (
                    <div key={msg.id} className="rounded-lg border border-white/5 bg-black/20 p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-400">{msg.sender}</span>
                        <span className="text-xs text-slate-400">{msg.timestamp}</span>
                      </div>
                      <div className="text-sm text-white">{msg.text}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>

          {/* 스와이프 인디케이터 */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className={`w-2 h-2 rounded-full ${activeTab === 'main' ? 'bg-blue-400' : 'bg-slate-600'}`} />
            <div className={`w-2 h-2 rounded-full ${activeTab === 'party' ? 'bg-purple-400' : 'bg-slate-600'}`} />
          </div>
        </div>

        {/* 하단 패널 + 입력 */}
        <div className="flex-shrink-0 space-y-3 border-t border-slate-700 p-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/5 bg-black/20 p-3 text-center">
              <div className="text-xs text-slate-300">HP: <span className="text-green-400">85/100</span></div>
              <div className="text-xs text-slate-300">MP: <span className="text-blue-400">42/50</span></div>
            </div>
            <button className="rounded-lg border border-white/5 bg-black/20 px-3 py-3 text-sm text-white">
              인벤토리/스킬
            </button>
          </div>

          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`${activeTab === 'main' ? '메인' : '파티'} 채팅을 입력하세요...`}
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