'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X } from 'lucide-react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import Tooltip from "@/components/tooltip";

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
  const [message, setMessage] = useState('')
  const [showExitModal, setShowExitModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  
  // URL에서 world 값 파싱
  const getWorldFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('world') || '던전 게임'
  }
  
  const world = getWorldFromURL()

  // 인벤토리 아이템 데이터
  const inventoryItems = [
    { id: 1, name: '체력 물약', icon: '❤️', effect: 'HP 50 회복', rarity: 'common' },
    { id: 2, name: '마나 물약', icon: '💙', effect: 'MP 30 회복', rarity: 'common' },
    { id: 3, name: '강화석', icon: '💎', effect: '무기 강화 +1', rarity: 'rare' },
    { id: 4, name: '텔레포트 스크롤', icon: '📜', effect: '즉시 마을로 이동', rarity: 'epic' },
    { id: 5, name: '부활의 반지', icon: '💍', effect: '사망 시 1회 부활', rarity: 'legendary' },
    { id: 6, name: '빈 슬롯', icon: '', effect: '', rarity: 'empty' }
  ]

  // 스킬 데이터
  const skills = [
    { id: 1, name: '파이어볼', icon: '🔥', effect: '마법 공격력 120%', cooldown: '3초', mana: '20' },
    { id: 2, name: '힐', icon: '✨', effect: 'HP 80 회복', cooldown: '5초', mana: '25' },
    { id: 3, name: '쉴드', icon: '🛡️', effect: '방어력 50% 증가', cooldown: '8초', mana: '30' },
    { id: 4, name: '더블 어택', icon: '⚔️', effect: '연속 공격 2회', cooldown: '4초', mana: '15' },
    { id: 5, name: '스텔스', icon: '👻', effect: '3초간 은신', cooldown: '12초', mana: '40' },
    { id: 6, name: '빈 슬롯', icon: '', effect: '', cooldown: '', mana: '' }
  ]

  // 실시간 애니메이션을 위한 motion values
  const x = useMotionValue(0)
  const mainDotOpacity = useTransform(x, [-50, 0], [0.3, 1])
  const partyDotOpacity = useTransform(x, [-50, 0], [1, 0.3])

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, user: '시스템', message: '메인 채팅방에 입장했습니다.', type: 'main', timestamp: '14:30' },
    { id: 2, user: '플레이어1', message: '안녕하세요!', type: 'main', timestamp: '14:31' },
    { id: 3, user: '플레이어2', message: '같이 던전 가실분?', type: 'main', timestamp: '14:32' },
    { id: 4, user: '파티원A', message: '보스 준비됐나요?', type: 'party', timestamp: '14:33' },
    { id: 5, user: '파티원B', message: '네, 준비 완료!', type: 'party', timestamp: '14:34' },
  ])

  const sendMessage = () => {
    const value = message.trim()
    if (!value) return
    
    const newMessage = {
      id: Date.now(),
      user: '나',
      message: value,
      type: activeTab,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => {
      const newMessages = prev.concat(newMessage)
      
      // 10개 메시지 달성 시 던전 클리어 체크
      if (newMessages.length >= 10) {
        setTimeout(() => {
          setShowClearModal(true)
        }, 500)
      }
      
      return newMessages
    })
    
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x < -threshold && activeTab === 'main') {
      setActiveTab('party')
    } else if (info.offset.x > threshold && activeTab === 'party') {
      setActiveTab('main')
    }
    
    // 드래그 후 위치 리셋
    x.set(0)
  }

  const handleExit = () => {
    setShowExitModal(true)
  }

  const confirmExit = () => {
    window.location.href = '/dungeon'
  }

  const cancelExit = () => {
    setShowExitModal(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 p-2">
      <div className="mx-auto flex max-w-sm flex-col overflow-hidden rounded-2xl bg-slate-800 shadow-lg min-h-[600px] h-full">
        {/* 상단 제목과 X 버튼 */}
        <div className="flex justify-between items-center p-3 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-white font-medium text-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
              {world}
            </div>
            <div className="text-slate-400 text-sm mt-1">
              {activeTab === 'main' ? '메인 채팅' : '파티 채팅'}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700 ml-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-hidden relative min-h-0">
          <motion.div
            className="absolute inset-0 flex cursor-grab active:cursor-grabbing select-none"
            animate={{ x: activeTab === 'main' ? '0%' : '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragElastic={0.1}
            dragConstraints={{ left: -50, right: 0 }}
            dragTransition={{ bounceStiffness: 800, bounceDamping: 30 }}
            onDragEnd={handleDragEnd}
            style={{ width: '200%', touchAction: 'none' }}
            whileDrag={{ scale: 0.98 }}
          >
            {/* 메인 채팅 */}
            <div className="w-1/2 flex-shrink-0 p-3 relative bg-slate-800">
              {/* 오른쪽 스와이프 힌트 */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-slate-400/60 rounded-l-full transition-all duration-300 hover:w-3 active:w-4 z-10" />
              
              <div className="text-white text-xs mb-2">메인 채팅 ({messages.filter(msg => msg.type === 'main').length}개 메시지)</div>
              <div className="h-full overflow-y-auto">
                <div className="space-y-3">
                  {messages.filter(msg => msg.type === 'main').map(message => (
                    <div key={message.id} className={`${message.user === '나' ? 'text-right' : 'text-left'}`}>
                      {message.user === '나' ? (
                        // 내 메시지 (오른쪽)
                        <div className="flex flex-col items-end">
                          <div className="text-slate-400 text-xs mb-1">{message.timestamp}</div>
                          <div className="bg-blue-600 text-white px-3 py-2 rounded-lg rounded-br-sm max-w-[80%] text-sm">
                            {message.message}
                          </div>
                        </div>
                      ) : (
                        // 다른 사람의 메시지 (왼쪽)
                        <div className="flex items-center mb-1">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                            {message.user.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{message.user}</div>
                            <div className="text-slate-400 text-xs">{message.timestamp}</div>
                          </div>
                        </div>
                      )}
                      {message.user !== '나' && (
                        <div className="text-slate-300 ml-8 text-sm">{message.message}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 파티 채팅 */}
            <div className="w-1/2 flex-shrink-0 p-3 relative bg-slate-800">
              {/* 왼쪽 스와이프 힌트 */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-400/60 rounded-r-full transition-all duration-300 hover:w-3 active:w-4 z-10" />
              
              <div className="text-white text-xs mb-2">파티 채팅 ({messages.filter(msg => msg.type === 'party').length}개 메시지)</div>
              <div className="h-full overflow-y-auto">
                <div className="space-y-3">
                  {messages.filter(msg => msg.type === 'party').map(message => (
                    <div key={message.id} className={`${message.user === '나' ? 'text-right' : 'text-left'}`}>
                      {message.user === '나' ? (
                        // 내 메시지 (오른쪽)
                        <div className="flex flex-col items-end">
                          <div className="text-slate-400 text-xs mb-1">{message.timestamp}</div>
                          <div className="bg-purple-600 text-white px-3 py-2 rounded-lg rounded-br-sm max-w-[80%] text-sm">
                            {message.message}
                          </div>
                        </div>
                      ) : (
                        // 다른 사람의 메시지 (왼쪽)
                        <div className="flex items-center mb-1">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                            {message.user.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{message.user}</div>
                            <div className="text-slate-400 text-xs">{message.timestamp}</div>
                          </div>
                        </div>
                      )}
                      {message.user !== '나' && (
                        <div className="text-slate-300 ml-8 text-sm">{message.message}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 스와이프 인디케이터 */}
        <div className="flex justify-center py-1">
          <div className="flex space-x-2">
            <div 
              className={`w-2 h-2 rounded-full transition-opacity duration-300 ${
                activeTab === 'main' ? 'bg-blue-400' : 'bg-slate-400'
              }`}
            />
            <div 
              className={`w-2 h-2 rounded-full transition-opacity duration-300 ${
                activeTab === 'party' ? 'bg-purple-400' : 'bg-slate-400'
              }`}
            />
          </div>
        </div>

        {/* 하단 패널 + 입력 */}
        <div className="flex-shrink-0 space-y-3 border-t border-slate-700 p-3">
          <div className="grid grid-cols-3 gap-3">
            <div 
              className="rounded-lg border border-white/5 bg-black/20 p-3 text-center cursor-pointer hover:bg-black/30 transition-colors"
              onClick={() => setShowStatusModal(true)}
            >
              <div className="text-xs text-slate-300">HP: <span className="text-green-400">85/100</span></div>
              <div className="text-xs text-slate-300">MP: <span className="text-blue-400">42/50</span></div>
            </div>
            <button 
              className="rounded-lg border border-white/5 bg-black/20 px-3 py-3 text-sm text-white"
              onClick={() => setShowInventoryModal(true)}
            >
              인벤토리/
              <br />
              스킬
            </button>
            <div className="rounded-lg border border-white/5 bg-black/20 p-3 text-center">
              <div className="text-xs text-slate-300">파티원A: <span className="text-white">20/20</span></div>
              <div className="text-xs text-slate-300">파티원B: <span className="text-white">18/20</span></div>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              id="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${activeTab === 'main' ? '메인' : '파티'} 채팅을 입력하세요...`}
              className="flex-1 border-white/10 bg-black/20 text-white placeholder:text-slate-400 text-sm h-9"
            />
            <Button onClick={sendMessage} size="icon" className="h-9 w-9 bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
              <span className="sr-only">전송</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 나가기 확인 모달 */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">게임을 나가시겠습니까?</h3>
            <p className="text-slate-300 mb-6">진행 중인 게임이 저장되지 않을 수 있습니다.</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={cancelExit}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                취소
              </Button>
              <Button
                onClick={confirmExit}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                나가기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 던전 클리어 축하 모달 */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">던전을 클리어했습니다!</h3>
            <p className="text-slate-300 mb-6">축하합니다! 메인으로 돌아가시겠습니까?</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowClearModal(false)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                취소
              </Button>
              <Button
                onClick={() => {
                  setShowClearModal(false)
                  window.location.href = '/dungeon'
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                메인으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 인벤토리/스킬 모달 */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">인벤토리 & 스킬</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInventoryModal(false)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* 인벤토리 섹션 */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-white mb-3 text-center">인벤토리</h4>
              <div className="grid grid-cols-3 gap-2">
                {inventoryItems.map((item, index) => (
                  (() => {
                    const rarityMap: Record<string, string> = { common: '일반', rare: '레어', epic: '에픽', legendary: '레전드리', empty: '빈 슬롯' }
                    const rarity = (item as any).rarity ? rarityMap[(item as any).rarity] : ''
                    const effectText = (item as any).effect || (item as any).description || ''
                    const html = `
                      <div class=\"font-medium mb-1\">${item.name}</div>
                      ${effectText ? `<div class=\"text-slate-300\">효과: ${effectText}</div>` : ''}
                      ${rarity ? `<div class=\"text-slate-400 mt-1\">등급: ${rarity}</div>` : ''}
                    `
                    return (
                      <Tooltip key={item.id} html={html}>
                        <div className="w-16 h-16 rounded-lg border border-slate-600 bg-slate-700 flex flex-col items-center justify-center relative cursor-pointer hover:bg-slate-600 transition-colors">
                          <span className="text-slate-200 text-base">{item.icon}</span>
                          <span className="text-slate-100 text-xs text-center leading-tight mt-0.5">{item.name}</span>
                        </div>
                      </Tooltip>
                    )
                  })()
                ))}
              </div>
            </div>

            {/* 스킬 섹션 */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-white mb-3 text-center">스킬</h4>
              <div className="grid grid-cols-3 gap-2">
                {skills.map((skill, index) => (
                  (() => {
                    const effectText = (skill as any).effect || (skill as any).description || ''
                    const html = `
                      <div class=\"font-medium mb-1\">${skill.name}</div>
                      ${effectText ? `<div class=\"text-slate-300\">${effectText}</div>` : ''}
                      ${(skill as any).cooldown ? `<div class=\"text-slate-400 mt-1\">쿨다운: ${(skill as any).cooldown}</div>` : ''}
                      ${(skill as any).mana ? `<div class=\"text-slate-400\">MP: ${(skill as any).mana}</div>` : ''}
                    `
                    return (
                      <Tooltip key={skill.id} html={html}>
                        <div className="w-16 h-16 rounded-lg border border-slate-600 bg-slate-700 flex flex-col items-center justify-center relative cursor-pointer hover:bg-slate-600 transition-colors">
                          <div className="text-2xl mb-1">{skill.icon}</div>
                          <div className="text-xs text-white font-medium text-center leading-tight">{skill.name}</div>
                        </div>
                      </Tooltip>
                    )
                  })()
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 캐릭터 상태 모달 */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-black">내 상태</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStatusModal(false)}
                className="h-8 w-8 p-0 text-gray-600 hover:text-black hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* 메인 스탯 */}
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-black">
                  <span className="font-medium">닉네임 :</span> 메롱
                </div>
                <div className="text-sm text-black">
                  <span className="font-medium">레벨 :</span> 1(인게임 레벨)
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-black">
                  <span className="font-medium">종족 :</span> 엘프
                </div>
                <div className="text-sm text-black">
                  <span className="font-medium">상태 :</span> 기절
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-black">
                  <span className="font-medium">HP :</span> 100/100
                </div>
                <div className="text-sm text-black">
                  <span className="font-medium">MP :</span> 100/100
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-black">
                  <span className="font-medium">물리 공격력 :</span> 10
                </div>
                <div className="text-sm text-black">
                  <span className="font-medium">마법 공격력 :</span> 10
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-black">
                  <span className="font-medium">회피율 :</span> 20%
                </div>
                <div className="text-sm text-black">
                  <span className="font-medium">명중률 :</span> 20%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-black">
                  <span className="font-medium">크리티컬 확률 :</span> 10%
                </div>
                <div className="text-sm text-black">
                  <span className="font-medium">주사위 성공 확률 :</span> +1%
                </div>
              </div>
            </div>

            {/* 코어 스탯 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-sm text-black">
                  <span className="font-medium">지능:</span> 10
                </div>
                <div className="text-sm text-black">
                  <span className="font-medium">지혜 :</span> 10
                </div>
                <div className="text-sm text-black">
                  <span className="font-medium">외지 :</span> 10
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-black">
                  <span className="font-medium">민첩:</span> 10
                </div>
                <div className="text-sm text-black">
                  <span className="font-medium">은:</span> 10
                </div>
                <div className="text-sm text-black">
                  <span className="font-medium">힘:</span> 10
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}