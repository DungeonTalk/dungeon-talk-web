'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, MessageCircle, Package } from 'lucide-react'

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

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('touch-scroll')) {
        target.classList.add('scrolling');
        clearTimeout(target.dataset.scrollTimeout as any);
        target.dataset.scrollTimeout = setTimeout(() => {
          target.classList.remove('scrolling');
        }, 1000) as any;
      }
    };

    document.addEventListener('scroll', handleScroll, true);
    return () => document.removeEventListener('scroll', handleScroll, true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '양호': return 'text-green-400'
      case '기절': return 'text-red-400'
      case '중독': return 'text-purple-400'
      case '마비': return 'text-yellow-400'
      default: return 'text-white'
    }
  }

  return (
    <div className="relative flex flex-col h-full bg-slate-800 overflow-x-hidden">
      {/* 파티 체력 상태 표시기 - 오른쪽 */}
      {currentView !== 'party-status' && (
        <div className="absolute top-1/2 -translate-y-1/2 right-3 z-10 space-y-3">
          <button
            className="w-10 h-10 rounded-full border border-white/10 bg-black/10 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
            onClick={() => {
              setSelectedPartyMember('party1')
              setCurrentView('party-status')
            }}
          >
            <div className="relative">
              {/* Background heart */}
              <div className="text-lg text-slate-600">♥</div>
              {/* Filled heart based on HP percentage */}
              <div 
                className={`absolute inset-0 text-lg overflow-hidden ${
                  partyMembers.party1.hp.current / partyMembers.party1.hp.max > 0.7 
                    ? 'text-green-400' 
                    : partyMembers.party1.hp.current / partyMembers.party1.hp.max > 0.3 
                    ? 'text-yellow-400' 
                    : 'text-red-400'
                }`}
                style={{
                  clipPath: `inset(${100 - (partyMembers.party1.hp.current / partyMembers.party1.hp.max * 100)}% 0 0 0)`
                }}
              >
                ♥
              </div>
            </div>
          </button>
          <button
            className="w-10 h-10 rounded-full border border-white/10 bg-black/10 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
            onClick={() => {
              setSelectedPartyMember('party2')
              setCurrentView('party-status')
            }}
          >
            <div className="relative">
              {/* Background heart */}
              <div className="text-lg text-slate-600">♥</div>
              {/* Filled heart based on HP percentage */}
              <div 
                className={`absolute inset-0 text-lg overflow-hidden ${
                  partyMembers.party2.hp.current / partyMembers.party2.hp.max > 0.7 
                    ? 'text-green-400' 
                    : partyMembers.party2.hp.current / partyMembers.party2.hp.max > 0.3 
                    ? 'text-yellow-400' 
                    : 'text-red-400'
                }`}
                style={{
                  clipPath: `inset(${100 - (partyMembers.party2.hp.current / partyMembers.party2.hp.max * 100)}% 0 0 0)`
                }}
              >
                ♥
              </div>
            </div>
          </button>
        </div>
      )}
      {/* 메인 콘텐츠 영역 - 전체 화면 */}
      <div className="flex-1 relative">
        {currentView === 'chat' || currentView === 'default' ? (
          <>
            {/* 채팅 메시지 영역 - 내부 스크롤이 있는 전체 화면 */}
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-3 mobile-scroll">
                  <div className="space-y-3 mt-16 pb-4">
                    {filteredMessages.map((msg) => (
                      <div key={msg.id} className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-blue-400">{msg.user}</span>
                          <span className="text-xs text-slate-400">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm text-white">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* 채팅 입력 - 채팅 뷰에서만 표시 */}
              {currentView === 'chat' && (
                <div className="p-3 bg-black/20 backdrop-blur-sm border-t border-white/5" onClick={focusInput}>
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      placeholder="채팅을 입력하세요..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onTouchStart={focusInput}
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
              )}
            </div>
          </>
        ) : currentView === 'inventory' ? (
          /* Inventory View */
          <div className="h-full bg-slate-800 p-6 pb-24">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentView('default')}
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
              <h2 className="text-lg font-semibold text-white">인벤토리</h2>
              <div className="w-8 h-8"></div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }, (_, index) => {
                const item = inventory[index]
                return (
                  <div
                    key={index}
                    className="aspect-square border-2 border-slate-600 rounded-lg flex flex-col items-center justify-center bg-slate-700 relative"
                  >
                    {item ? (
                      <>
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-xs text-center px-1 leading-tight text-white">{item.name}</div>
                        {item.quantity > 1 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-slate-500 text-xs">빈 칸</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : currentView === 'status' ? (
  /* 상태 상세 뷰 */
  <div className="absolute inset-0 bg-slate-700 flex flex-col">
    <div className="p-6 flex-1 flex flex-col">
      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <button
            onClick={() => setCurrentView('default')}
            className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <h2 className="text-lg font-semibold text-white bg-slate-600 rounded px-3 py-1">내 상태</h2>
          <div className="w-8 h-8"></div>
        </div>
        
        <div className="flex-1 overflow-x-hidden overflow-y-auto touch-scroll scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 scrollbar-thumb-rounded-full">
          {/* Character Info */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">레벨:</span>
              <span className="text-white">1(신계정 리뷰)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">종족:</span>
              <span className="text-white">엘프</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">상태:</span>
              <span className={getStatusColor('양호')}>양호</span>
            </div>
          </div>

          {/* HP/MP */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-sm">
              <span className="text-slate-300">HP:</span>
              <span className="text-green-400 ml-1">85/100</span>
            </div>
            <div className="text-sm">
              <span className="text-slate-300">MP:</span>
              <span className="text-blue-400 ml-1">42/50</span>
            </div>
          </div>

          {/* Combat Stats */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">물리 공격력:</span>
              <span className="text-white">15</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">마법 공격력:</span>
              <span className="text-white">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">크리티컬 확률:</span>
              <span className="text-white">10%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">주사위 성공 확률:</span>
              <span className="text-white">+1%</span>
            </div>
          </div>

          {/* Stat Buttons */}
          <div className="grid grid-cols-3 gap-2 pb-4">
            {[
              { name: '지능', value: 10 },
              { name: '지혜', value: 10 },
              { name: '체력', value: 10 },
              { name: '마력', value: 10 },
              { name: '운', value: 10 },
              { name: '힘', value: 10 }
            ].map((stat) => (
              <button
                key={stat.name}
                className="bg-slate-600 hover:bg-slate-500 rounded px-3 py-2 text-xs text-white border border-slate-500 transition-colors"
              >
                {stat.name}: {stat.value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)
         : currentView === 'party-status' ? (
          /* 파티 상태 뷰 */
          <div className="absolute inset-0 bg-slate-700 flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 flex-1 flex flex-col overflow-hidden">
                {/* 파티원 탭 */}
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <button
                    onClick={() => setCurrentView('default')}
                    className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  <h2 className="text-lg font-semibold text-white">파티 체력 상태</h2>
                  <div className="w-8 h-8"></div>
                </div>
                <div className="flex mb-4 bg-slate-600 rounded p-1 flex-shrink-0">
                  <button
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-all ${
                      selectedPartyMember === 'party1'
                        ? 'bg-slate-500 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    onClick={() => setSelectedPartyMember('party1')}
                  >
                    파티원 1
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-all ${
                      selectedPartyMember === 'party2'
                        ? 'bg-slate-500 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    onClick={() => setSelectedPartyMember('party2')}
                  >
                    파티원 2
                  </button>
                </div>

                {/* 선택된 파티원 정보 - 스크롤 가능 */}
                {partyMembers[selectedPartyMember] && (
                  <div className="flex-1 overflow-x-hidden overflow-y-auto touch-scroll scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 scrollbar-thumb-rounded-full">
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-center text-white bg-slate-600 rounded px-3 py-1">
                        {partyMembers[selectedPartyMember].name}
                      </h2>
                      
                      {/* Character Info */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">레벨:</span>
                          <span className="text-white">{partyMembers[selectedPartyMember].level}(신계정 리뷰)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">종족:</span>
                          <span className="text-white">{partyMembers[selectedPartyMember].race}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">상태:</span>
                          <span className={getStatusColor(partyMembers[selectedPartyMember].status)}>
                            {partyMembers[selectedPartyMember].status}
                          </span>
                        </div>
                      </div>

                      {/* HP/MP */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-sm">
                          <span className="text-slate-300">HP:</span>
                          <span className="text-green-400 ml-1">
                            {partyMembers[selectedPartyMember].hp.current}/{partyMembers[selectedPartyMember].hp.max}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-300">MP:</span>
                          <span className="text-blue-400 ml-1">
                            {partyMembers[selectedPartyMember].mp.current}/{partyMembers[selectedPartyMember].mp.max}
                          </span>
                        </div>
                      </div>

                      {/* Combat Stats */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">물리 공격력:</span>
                          <span className="text-white">{partyMembers[selectedPartyMember].physicalAttack}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">마법 공격력:</span>
                          <span className="text-white">{partyMembers[selectedPartyMember].magicalAttack}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">크리티컬 확률:</span>
                          <span className="text-white">{partyMembers[selectedPartyMember].criticalRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">주사위 성공 확률:</span>
                          <span className="text-white">+{partyMembers[selectedPartyMember].successRate}%</span>
                        </div>
                      </div>

                      {/* Stat Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(partyMembers[selectedPartyMember].stats).map(([key, value]) => {
                          const statNames: Record<string, string> = {
                            intelligence: '지능',
                            wisdom: '지혜',
                            vitality: '체력',
                            mana: '마력',
                            luck: '운',
                            strength: '힘'
                          }
                          return (
                            <button
                              key={key}
                              className="bg-slate-600 hover:bg-slate-500 rounded px-3 py-2 text-xs text-white border border-slate-500 transition-colors"
                            >
                              {statNames[key]}: {value}
                            </button>
                          )
                        })}
                      </div>

                      {/* Inventory Section */}
                      <div className="border-t border-slate-600 pt-4">
                        <h3 className="text-center text-white font-medium mb-3 bg-slate-600 rounded px-3 py-1">인벤토리</h3>
                        <div className="grid grid-cols-3 gap-2 pb-4">
                          {Array.from({ length: 6 }, (_, index) => {
                            const item = partyMembers[selectedPartyMember].inventory[index]
                            return (
                              <div
                                key={index}
                                className="aspect-square border-2 border-slate-600 rounded-lg flex flex-col items-center justify-center bg-slate-600 relative"
                              >
                                {item ? (
                                  <>
                                    <div className="text-lg mb-1">{item.icon}</div>
                                    <div className="text-xs text-center px-1 leading-tight text-white">{item.name}</div>
                                    {item.quantity > 1 && (
                                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {item.quantity}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="text-slate-500 text-xs">빈 칸</div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* 기본 뷰 - 빈 배경 */
          <div className="h-full bg-slate-800"></div>
        )}
      </div>

      {/* 채팅 타입 탭 - 기본 및 채팅 뷰에서 표시 */}
      {(currentView === 'chat' || currentView === 'default') && (
        <div className="absolute top-3 left-3 right-3 z-20">
          <div className="flex bg-black/10 backdrop-blur-sm rounded-lg p-1 border border-white/5">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === 'main'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-300/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('main')}
            >
              메인 채팅
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === 'party'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-300/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('party')}
            >
              파티 채팅
            </button>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 - 뷰에 따라 위치 변경, 가장자리로 퍼짐 */}
      <div className={`absolute left-3 right-3 z-10 transition-all duration-300 ${
        currentView === 'chat' ? 'bottom-20' : 'bottom-6'
      }`}>
        <div className="flex justify-between items-center">
          <button
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all backdrop-blur-sm ${
              currentView === 'chat'
                ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                : 'border-white/20 bg-black/10 text-slate-300/70 hover:border-white/30'
            }`}
            onClick={() => setCurrentView(currentView === 'chat' ? 'default' : 'chat')}
          >
            <div className="flex flex-col items-center">
              <MessageCircle className="h-4 w-4 mb-1" />
              <span className="text-xs">채팅</span>
            </div>
          </button>
          
          {/* My Status - HP/MP Icons in two rows */}
          <button
            className={`flex flex-col items-center justify-center transition-all backdrop-blur-sm ${
              currentView === 'status'
                ? 'text-green-300'
                : 'text-slate-300/70 hover:text-white'
            }`}
            onClick={() => setCurrentView(currentView === 'status' ? 'default' : 'status')}
          >
            <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10 space-y-1">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-red-400">❤️</span>
                <span className="text-green-400">85/100</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-blue-400">💙</span>
                <span className="text-blue-400">42/50</span>
              </div>
            </div>
          </button>
          
          <button
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all backdrop-blur-sm ${
              currentView === 'inventory'
                ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                : 'border-white/20 bg-black/10 text-slate-300/70 hover:border-white/30'
            }`}
            onClick={() => setCurrentView(currentView === 'inventory' ? 'default' : 'inventory')}
          >
            <div className="flex flex-col items-center">
              <Package className="h-4 w-4 mb-1" />
              <span className="text-xs">가방</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}