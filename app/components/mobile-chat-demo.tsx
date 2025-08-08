'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from 'lucide-react'

interface ChatMessage {
  id: number
  user: string
  message: string
  type: 'main' | 'party'
  timestamp: string
}

interface InventoryItem {
  id: number
  name: string
  icon: string
  quantity: number
}

interface PartyMember {
  id: string
  name: string
  level: number
  race: string
  status: string
  hp: { current: number; max: number }
  mp: { current: number; max: number }
  physicalAttack: number
  magicalAttack: number
  criticalRate: number
  successRate: number
  stats: {
    intelligence: number
    wisdom: number
    vitality: number
    mana: number
    luck: number
    strength: number
  }
  inventory: InventoryItem[]
}

export default function MobileChatDemo() {
  const [activeTab, setActiveTab] = useState<'main' | 'party'>('main')
  const [currentView, setCurrentView] = useState<'default' | 'chat' | 'inventory' | 'status' | 'party-status'>('default')
  const [selectedPartyMember, setSelectedPartyMember] = useState<string>('party1')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, user: '플레이어1', message: '안녕하세요!', type: 'main', timestamp: '14:30' },
    { id: 2, user: '플레이어2', message: '같이 던전 가실분?', type: 'main', timestamp: '14:31' },
    { id: 3, user: '파티원A', message: '보스 준비됐나요?', type: 'party', timestamp: '14:32' },
    { id: 4, user: '파티원B', message: '네, 준비 완료!', type: 'party', timestamp: '14:33' },
  ])

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: '체력 포션', icon: '🧪', quantity: 3 },
    { id: 2, name: '마나 포션', icon: '💙', quantity: 2 },
    { id: 3, name: '검', icon: '⚔️', quantity: 1 },
  ])

  const [partyMembers] = useState<Record<string, PartyMember>>({
    party1: {
      id: 'party1',
      name: '파티원A',
      level: 1,
      race: '인간',
      status: '양호',
      hp: { current: 20, max: 20 },
      mp: { current: 15, max: 15 },
      physicalAttack: 12,
      magicalAttack: 8,
      criticalRate: 15,
      successRate: 2,
      stats: {
        intelligence: 8,
        wisdom: 12,
        vitality: 15,
        mana: 10,
        luck: 7,
        strength: 14
      },
      inventory: [
        { id: 1, name: '단검', icon: '🗡️', quantity: 1 },
        { id: 2, name: '가죽 갑옷', icon: '🛡️', quantity: 1 },
      ]
    },
    party2: {
      id: 'party2',
      name: '파티원B',
      level: 2,
      race: '엘프',
      status: '기절',
      hp: { current: 5, max: 18 },
      mp: { current: 20, max: 25 },
      physicalAttack: 8,
      magicalAttack: 18,
      criticalRate: 12,
      successRate: 3,
      stats: {
        intelligence: 16,
        wisdom: 14,
        vitality: 10,
        mana: 18,
        luck: 11,
        strength: 8
      },
      inventory: [
        { id: 1, name: '마법 지팡이', icon: '🪄', quantity: 1 },
        { id: 2, name: '로브', icon: '👘', quantity: 1 },
        { id: 3, name: '마나 크리스탈', icon: '💎', quantity: 2 },
      ]
    }
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const filteredMessages = messages.filter(msg => msg.type === activeTab)

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: messages.length + 1,
        user: '나',
        message: message.trim(),
        type: activeTab,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.click()
    }
  }

  useEffect(() => {
    if (currentView === 'chat') {
      focusInput()
    }
  }, [currentView])

  return (
    <div className="flex h-full flex-col bg-slate-800">
      {/* 상단 탭 */}
      <div className="p-3 border-b border-white/10">
        <div className="grid grid-cols-2 bg-black/10 rounded-lg p-1">
          <button
            className={`py-2 text-sm rounded-md ${
              activeTab === 'main' ? 'bg-white/10 text-white' : 'text-slate-300/70 hover:text-white'
            }`}
            onClick={() => setActiveTab('main')}
          >
            메인 채팅
          </button>
          <button
            className={`py-2 text-sm rounded-md ${
              activeTab === 'party' ? 'bg-white/10 text-white' : 'text-slate-300/70 hover:text-white'
            }`}
            onClick={() => setActiveTab('party')}
          >
            파티 채팅
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-3 py-4">
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="rounded-lg border border-white/5 bg-black/20 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-400">{msg.user}</span>
                  <span className="text-xs text-slate-400">{msg.timestamp}</span>
                </div>
                <p className="text-sm text-white">{msg.message}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 하단 패널 + 입력창 */}
      <div className="p-3 border-t border-white/10 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/5 text-center">
            <div className="text-xs text-slate-300">HP: <span className="text-green-400">85/100</span></div>
            <div className="text-xs text-slate-300">MP: <span className="text-blue-400">42/50</span></div>
          </div>
          <button className="bg-black/20 rounded-lg border border-white/5 px-3 py-3 text-white text-sm">
            인벤토리/스킬
          </button>
          <div className="bg-black/20 rounded-lg p-3 border border-white/5 text-center">
            <div className="text-xs text-slate-300">파티원A: <span className="text-white">20/20</span></div>
            <div className="text-xs text-slate-300">파티원B: <span className="text-white">18/20</span></div>
          </div>
        </div>

        <div className="flex gap-2" onClick={focusInput}>
          <Input
            ref={inputRef}
            placeholder="채팅을 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="flex-1 bg-black/20 border-white/10 text-white placeholder:text-slate-400"
            inputMode="text"
          />
          <Button onClick={sendMessage} size="icon" className="h-10 w-10 bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4" />
            <span className="sr-only">전송</span>
          </Button>
        </div>
      </div>
    </div>
  )
}