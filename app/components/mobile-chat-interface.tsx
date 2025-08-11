import { useRef, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Send, X } from 'lucide-react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import Tooltip from "@/components/tooltip";

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
  const [showExitModal, setShowExitModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showPartyMemberModal, setShowPartyMemberModal] = useState(false)
  
  // 파티원 상세 보기용 상태
  interface PartyItem { id: number; name: string; icon: string; effect: string; rarity: 'common'|'rare'|'epic'|'legendary'|'empty' }
  interface PartySkill { id: number; name: string; icon: string; effect: string; cooldown: string; mana: string }
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
    evade: number
    accuracy: number
    criticalRate: number
    diceSuccess: number
    core: { intelligence: number; wisdom: number; agility: number; strength: number; vitality: number; luck: number }
    inventory: PartyItem[]
    skills: PartySkill[]
  }
  const [selectedMember, setSelectedMember] = useState<PartyMember | null>(null)

  // 샘플 파티원 데이터
  const partyMembers: PartyMember[] = [
    {
      id: 'A', name: '파티원A', level: 5, race: '엘프', status: '정상',
      hp: { current: 20, max: 20 }, mp: { current: 12, max: 20 },
      physicalAttack: 8, magicalAttack: 12, evade: 15, accuracy: 18, criticalRate: 7, diceSuccess: 1,
      core: { intelligence: 12, wisdom: 10, agility: 11, strength: 8, vitality: 9, luck: 10 },
      inventory: [
        { id: 1, name: '체력 물약', icon: '❤️', effect: 'HP 50 회복', rarity: 'common' },
        { id: 2, name: '마나 물약', icon: '💙', effect: 'MP 30 회복', rarity: 'common' },
        { id: 3, name: '강화석', icon: '💎', effect: '무기 강화 +1', rarity: 'rare' },
        { id: 4, name: '텔레포트 스크롤', icon: '📜', effect: '즉시 마을로 이동', rarity: 'epic' },
        { id: 5, name: '부활의 반지', icon: '💍', effect: '사망 시 1회 부활', rarity: 'legendary' },
        { id: 6, name: '빈 슬롯', icon: '', effect: '', rarity: 'empty' },
      ],
      skills: [
        { id: 1, name: '파이어볼', icon: '🔥', effect: '마법 공격력 120%', cooldown: '3초', mana: '20' },
        { id: 2, name: '힐', icon: '✨', effect: 'HP 80 회복', cooldown: '5초', mana: '25' },
        { id: 3, name: '쉴드', icon: '🛡️', effect: '방어력 50% 증가', cooldown: '8초', mana: '30' },
        { id: 4, name: '더블 어택', icon: '⚔️', effect: '연속 공격 2회', cooldown: '4초', mana: '15' },
        { id: 5, name: '스텔스', icon: '👻', effect: '3초간 은신', cooldown: '12초', mana: '40' },
        { id: 6, name: '빈 슬롯', icon: '', effect: '', cooldown: '', mana: '' },
      ],
    },
    {
      id: 'B', name: '파티원B', level: 4, race: '휴먼', status: '중독',
      hp: { current: 18, max: 20 }, mp: { current: 10, max: 20 },
      physicalAttack: 10, magicalAttack: 7, evade: 12, accuracy: 17, criticalRate: 5, diceSuccess: 1,
      core: { intelligence: 9, wisdom: 8, agility: 10, strength: 11, vitality: 10, luck: 9 },
      inventory: [
        { id: 1, name: '해독제', icon: '🧪', effect: '중독 해제', rarity: 'rare' },
        { id: 2, name: '체력 물약', icon: '❤️', effect: 'HP 50 회복', rarity: 'common' },
        { id: 3, name: '마나 물약', icon: '💙', effect: 'MP 30 회복', rarity: 'common' },
        { id: 4, name: '강화석', icon: '💎', effect: '무기 강화 +1', rarity: 'rare' },
        { id: 5, name: '빈 슬롯', icon: '', effect: '', rarity: 'empty' },
        { id: 6, name: '빈 슬롯', icon: '', effect: '', rarity: 'empty' },
      ],
      skills: [
        { id: 1, name: '더블 어택', icon: '⚔️', effect: '연속 공격 2회', cooldown: '4초', mana: '15' },
        { id: 2, name: '쉴드', icon: '🛡️', effect: '방어력 50% 증가', cooldown: '8초', mana: '30' },
        { id: 3, name: '파이어볼', icon: '🔥', effect: '마법 공격력 120%', cooldown: '3초', mana: '20' },
        { id: 4, name: '힐', icon: '✨', effect: 'HP 80 회복', cooldown: '5초', mana: '25' },
        { id: 5, name: '스텔스', icon: '👻', effect: '3초간 은신', cooldown: '12초', mana: '40' },
        { id: 6, name: '빈 슬롯', icon: '', effect: '', cooldown: '', mana: '' },
      ],
    },
  ]

  // 인벤토리 아이템 데이터
  const inventoryItems = [
    { id: 1, name: '체력 물약', icon: '❤️', effect: 'HP 50 회복', rarity: 'common', description: '기본적인 체력 회복 물약입니다. 전투 중에도 사용할 수 있어 긴급 상황에서 유용합니다.' },
    { id: 2, name: '마나 물약', icon: '💙', effect: 'MP 30 회복', rarity: 'common', description: '마법사들이 선호하는 마나 회복 물약입니다. 스킬 사용 후 마나가 부족할 때 사용하세요.' },
    { id: 3, name: '강화석', icon: '💎', effect: '무기 강화 +1', rarity: 'rare', description: '무기나 방어구의 강화 레벨을 1단계 올려줍니다. 강화 실패 시 아이템이 파괴될 수 있으니 주의하세요.' },
    { id: 4, name: '텔레포트 스크롤', icon: '📜', effect: '즉시 마을로 이동', rarity: 'epic', description: '위험한 상황에서 즉시 마을로 돌아갈 수 있는 마법 스크롤입니다. 전투 중에는 사용할 수 없습니다.' },
    { id: 5, name: '부활의 반지', icon: '💍', effect: '사망 시 1회 부활', rarity: 'legendary', description: '사망 시 자동으로 부활시켜주는 신비한 반지입니다. 한 번 사용하면 사라지니 신중하게 사용하세요.' },
    { id: 6, name: '빈 슬롯', icon: '', effect: '', rarity: 'empty', description: '아직 아이템이 들어있지 않은 빈 슬롯입니다.' }
  ]

  // 스킬 데이터
  const skills = [
    { id: 1, name: '파이어볼', icon: '🔥', effect: '마법 공격력 120%', cooldown: '3초', mana: '20', description: '강력한 화염 마법입니다. 적에게 큰 피해를 주며, 화상 상태이상을 부여할 수 있습니다.' },
    { id: 2, name: '힐', icon: '✨', effect: 'HP 80 회복', cooldown: '5초', mana: '25', description: '파티원의 체력을 회복시키는 치유 마법입니다. 전투 중에도 사용할 수 있어 파티 생존에 필수적입니다.' },
    { id: 3, name: '쉴드', icon: '🛡️', effect: '방어력 50% 증가', cooldown: '8초', mana: '30', description: '자신과 주변 파티원에게 방어력 버프를 부여합니다. 보스 전투에서 생존률을 크게 높여줍니다.' },
    { id: 4, name: '더블 어택', icon: '⚔️', effect: '연속 공격 2회', cooldown: '4초', mana: '15', description: '빠른 속도로 연속 공격을 가합니다. 높은 DPS를 자랑하며, 크리티컬 확률도 증가시킵니다.' },
    { id: 5, name: '스텔스', icon: '👻', effect: '3초간 은신', cooldown: '12초', mana: '40', description: '3초간 은신 상태가 되어 적의 공격을 피할 수 있습니다. 위험한 상황에서 탈출할 때 유용합니다.' },
    { id: 6, name: '빈 슬롯', icon: '', effect: '', cooldown: '', mana: '', description: '아직 습득하지 못한 스킬 슬롯입니다.' }
  ]

  // 실시간 애니메이션을 위한 motion values
  const x = useMotionValue(0)
  const mainDotOpacity = useTransform(x, [-50, 0], [0.3, 1])
  const partyDotOpacity = useTransform(x, [-50, 0], [1, 0.3])

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: '안녕하세요!', sender: '플레이어1', type: 'main', timestamp: '14:30' },
    { id: 2, text: '같이 던전 가실분?', sender: '플레이어2', type: 'main', timestamp: '14:31' },
    { id: 3, text: '보스 준비됐나요?', sender: '파티원A', type: 'party', timestamp: '14:32' },
    { id: 4, text: '네, 준비 완료!', sender: '파티원B', type: 'party', timestamp: '14:33' },
  ])

  const sendMessage = () => {
    const value = currentMessage.trim()
    if (!value) return
    
    const newMessage = {
      id: Date.now(),
      text: value,
      sender: '나',
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
    
      setCurrentMessage('')
    inputRef.current?.focus()
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
        {/* 상단 X 버튼 */}
        <div className="flex justify-between items-center p-3 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-white font-medium text-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
              멀티플레이
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
                    <div key={message.id} className={`${message.sender === '나' ? 'text-right' : 'text-left'}`}>
                      {message.sender === '나' ? (
                        // 내 메시지 (오른쪽)
                        <div className="flex flex-col items-end">
                          <div className="text-slate-400 text-xs mb-1">{message.timestamp}</div>
                          <div className="bg-blue-600 text-white px-3 py-2 rounded-lg rounded-br-sm max-w-[80%] text-sm">
                            {message.text}
                          </div>
                        </div>
                      ) : (
                        // 다른 사람의 메시지 (왼쪽)
                        <div className="flex items-center mb-1">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                            {message.sender.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{message.sender}</div>
                            <div className="text-slate-400 text-xs">{message.timestamp}</div>
                          </div>
                        </div>
                      )}
                      {message.sender !== '나' && (
                        <div className="text-slate-300 ml-8 text-sm">{message.text}</div>
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
                    <div key={message.id} className={`${message.sender === '나' ? 'text-right' : 'text-left'}`}>
                      {message.sender === '나' ? (
                        // 내 메시지 (오른쪽)
                        <div className="flex flex-col items-end">
                          <div className="text-slate-400 text-xs mb-1">{message.timestamp}</div>
                          <div className="bg-purple-600 text-white px-3 py-2 rounded-lg rounded-br-sm max-w-[80%] text-sm">
                            {message.text}
                          </div>
                        </div>
                      ) : (
                        // 다른 사람의 메시지 (왼쪽)
                        <div className="flex items-center mb-1">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                            {message.sender.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{message.sender}</div>
                            <div className="text-slate-400 text-xs">{message.timestamp}</div>
                          </div>
                        </div>
                      )}
                      {message.sender !== '나' && (
                        <div className="text-slate-300 ml-8 text-sm">{message.text}</div>
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
            <motion.div 
              className="w-2 h-2 rounded-full bg-blue-400" 
              style={{ opacity: mainDotOpacity }}
            />
            <motion.div 
              className="w-2 h-2 rounded-full bg-purple-400" 
              style={{ opacity: partyDotOpacity }}
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
              인벤토리/스킬
            </button>
            <div className="rounded-lg border border-white/5 bg-black/20 p-3 text-center cursor-pointer hover:bg-black/30 transition-colors" onClick={() => { setSelectedMember(partyMembers[0]); setShowPartyMemberModal(true) }}>
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
        <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>게임을 나가시겠습니까?</DialogTitle>
              <DialogDescription>
                진행 중인 게임이 저장되지 않을 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={cancelExit} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                취소
              </Button>
              <Button onClick={confirmExit} className="flex-1 bg-red-600 hover:bg-red-700">
                나가기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 던전 클리어 축하 모달 */}
      {showClearModal && (
        <Dialog open={showClearModal} onOpenChange={setShowClearModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>던전 클리어!</DialogTitle>
              <DialogDescription>
                던전을 클리어하셨습니다! 메인 채팅으로 돌아가시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClearModal(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                취소
              </Button>
              <Button onClick={() => {
                setActiveTab('main');
                setShowClearModal(false);
              }} className="flex-1 bg-blue-600 hover:bg-blue-700">
                메인으로 돌아가기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 인벤토리/스킬 모달 */}
      {showInventoryModal && (
        <Dialog open={showInventoryModal} onOpenChange={setShowInventoryModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>인벤토리 & 스킬</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInventoryModal(false)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            {/* 인벤토리 섹션 */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-white mb-3 text-center">인벤토리</h4>
              <div className="grid grid-cols-3 gap-2">
                {inventoryItems.map((item) => (
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
                {skills.map((skill) => (
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
          </DialogContent>
        </Dialog>
      )}

      {/* 캐릭터 상태 모달 */}
      {showStatusModal && (
        <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
          <DialogContent className="bg-slate-800 border-slate-600 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">내 상태</DialogTitle>
            </DialogHeader>
            
            {/* 메인 스탯 */}
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">닉네임 :</span> 메롱
                                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">레벨 :</span> 1(인게임 레벨)
                              </div>
                            </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">종족 :</span> 엘프
                                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">상태 :</span> 기절
                              </div>
                            </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">HP :</span> 100/100
                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">MP :</span> 100/100
                          </div>
                  </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">물리 공격력 :</span> 10
                        </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">마법 공격력 :</span> 10
                        </div>
                        </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">회피율 :</span> 20%
                        </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">명중률 :</span> 20%
                        </div>
                  </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">크리티컬 확률 :</span> 10%
          </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">주사위 성공 확률 :</span> +1%
              </div>
              </div>
            </div>

            {/* 코어 스탯 */}
            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <h4 className="text-white font-medium mb-3">코어 스탯</h4>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">지능:</span> 10
                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">지혜:</span> 10
                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">외지:</span> 10
                </div>
                        </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">민첩:</span> 10
                    </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">은:</span> 10
                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">힘:</span> 10
          </div>
        </div>
      </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 파티원 상태 + 인벤토리/스킬 모달 */}
      {showPartyMemberModal && selectedMember && (
        <Dialog open={showPartyMemberModal} onOpenChange={setShowPartyMemberModal}>
          <DialogContent className="bg-slate-800 border-slate-600 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedMember.name} 상태</DialogTitle>
            </DialogHeader>

            {/* 상태 정보 */}
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">닉네임 :</span> {selectedMember.name}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">레벨 :</span> {selectedMember.level}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">종족 :</span> {selectedMember.race}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">상태 :</span> {selectedMember.status}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">HP :</span> {selectedMember.hp.current}/{selectedMember.hp.max}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">MP :</span> {selectedMember.mp.current}/{selectedMember.mp.max}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">물리 공격력 :</span> {selectedMember.physicalAttack}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">마법 공격력 :</span> {selectedMember.magicalAttack}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">회피율 :</span> {selectedMember.evade}%</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">명중률 :</span> {selectedMember.accuracy}%</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">크리티컬 확률 :</span> {selectedMember.criticalRate}%</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">주사위 성공 확률 :</span> +{selectedMember.diceSuccess}%</div>
              </div>
            </div>

            {/* 코어 스탯 */}
            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 mb-6">
              <h4 className="text-white font-medium mb-3">코어 스탯</h4>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">지능:</span> {selectedMember.core.intelligence}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">지혜:</span> {selectedMember.core.wisdom}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">민첩:</span> {selectedMember.core.agility}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">힘:</span> {selectedMember.core.strength}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">체력:</span> {selectedMember.core.vitality}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">운:</span> {selectedMember.core.luck}</div>
              </div>
            </div>

            {/* 인벤토리 & 스킬 */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-white mb-3 text-center">인벤토리</h4>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {selectedMember.inventory.map((item) => {
                  const rarityMap: Record<string, string> = { common: '일반', rare: '레어', epic: '에픽', legendary: '레전드리', empty: '빈 슬롯' }
                  const rarity = rarityMap[item.rarity]
                  const html = `
                    <div class=\"font-medium mb-1\">${item.name}</div>
                    ${item.effect ? `<div class=\"text-slate-300\">효과: ${item.effect}</div>` : ''}
                    ${rarity ? `<div class=\"text-slate-400 mt-1\">등급: ${rarity}</div>` : ''}
                  `
                  return (
                    <Tooltip key={item.id} html={html}>
                      <div className="w-16 h-16 rounded-lg border border-slate-600 bg-slate-700 flex flex-col items-center justify-center relative">
                        <span className="text-slate-200 text-base">{item.icon}</span>
                        <span className="text-slate-100 text-xs text-center leading-tight mt-0.5">{item.name}</span>
                      </div>
                    </Tooltip>
                  )
                })}
              </div>

              <h4 className="text-md font-medium text-white mb-3 text-center">스킬</h4>
              <div className="grid grid-cols-3 gap-2">
                {selectedMember.skills.map((skill) => {
                  const html = `
                    <div class=\"font-medium mb-1\">${skill.name}</div>
                    ${skill.effect ? `<div class=\"text-slate-300\">${skill.effect}</div>` : ''}
                    ${skill.cooldown ? `<div class=\"text-slate-400 mt-1\">쿨다운: ${skill.cooldown}</div>` : ''}
                    ${skill.mana ? `<div class=\"text-slate-400\">MP: ${skill.mana}</div>` : ''}
                  `
                  return (
                    <Tooltip key={skill.id} html={html}>
                      <div className="w-16 h-16 rounded-lg border border-slate-600 bg-slate-700 flex flex-col items-center justify-center relative">
                        <div className="text-2xl mb-1">{skill.icon}</div>
                        <div className="text-xs text-white font-medium text-center leading-tight">{skill.name}</div>
                      </div>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}