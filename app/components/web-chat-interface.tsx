import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, ChevronDown, ChevronRight, ArrowLeft, Wand2, Backpack } from 'lucide-react'
import Tooltip from '@/components/tooltip'

interface ChatMessage {
  id: number
  user: string
  message: string
  type: 'main' | 'party'
  timestamp: string
}

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

export default function WebChatInterface() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const worldTitle = searchParams.get('world') || 'Dungeon Talk'
  const myNickname = '메롱'
  const [utilityView, setUtilityView] = useState<'status' | 'party'>('status')
  const [isCoreOpen, setIsCoreOpen] = useState(false)
  const [isInvOpen, setIsInvOpen] = useState(false)
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, user: '시스템', message: '게임이 시작되었습니다.', type: 'main', timestamp: '14:30' },
    { id: 2, user: '플레이어1', message: '안녕하세요!', type: 'main', timestamp: '14:31' },
    { id: 3, user: '시스템', message: '게임이 시작되었습니다.', type: 'party', timestamp: '14:31' },
    { id: 4, user: '파티원A', message: '보스 준비됐나요?', type: 'party', timestamp: '14:32' },
    { id: 5, user: '파티원B', message: '네, 준비 완료!', type: 'party', timestamp: '14:33' },
  ])
  const [mainInput, setMainInput] = useState('')
  const [partyInput, setPartyInput] = useState('')
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)
  const [selectedInventoryIdx, setSelectedInventoryIdx] = useState(0)
  const [selectedSkillIdx, setSelectedSkillIdx] = useState(0)
  const [mainEnded, setMainEnded] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const END_MAIN_COUNT = 10

  useEffect(() => {
    if (showInventoryModal) setSelectedInventoryIdx(0)
  }, [showInventoryModal])

  useEffect(() => {
    if (showSkillsModal) setSelectedSkillIdx(0)
  }, [showSkillsModal])

  // 채팅 스크롤: 최신 메시지가 보이도록 자동 스크롤
  const mainChatRef = useRef<HTMLDivElement>(null)
  const partyChatRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = (el: HTMLDivElement | null) => {
    if (!el) return
    el.scrollTop = el.scrollHeight
  }
  useEffect(() => {
    scrollToBottom(mainChatRef.current)
    scrollToBottom(partyChatRef.current)
  }, [messages])

  // 턴 제한: 마지막 입력 후 60초 내 미입력 시 자동 턴 종료 로그
  const TURN_LIMIT_MS = 60_000
  const turnTimeoutRef = useRef<number | null>(null)
  const clearTurnTimer = () => {
    if (turnTimeoutRef.current != null) {
      clearTimeout(turnTimeoutRef.current)
      turnTimeoutRef.current = null
    }
  }
  const scheduleTurnTimeout = () => {
    clearTurnTimer()
    turnTimeoutRef.current = window.setTimeout(() => {
      const ts = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => prev.concat(
        { id: Date.now(), user: '시스템', message: `${myNickname}의 입력 시간 초과로 턴이 종료되었습니다.`, type: 'main', timestamp: ts }
      ))
      turnTimeoutRef.current = null
    }, TURN_LIMIT_MS)
  }
  useEffect(() => () => clearTurnTimer(), [])
  const [showMember, setShowMember] = useState<PartyMember | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const myCombat = { physicalAttack: 9, magicalAttack: 11, evade: 12, accuracy: 18, criticalRate: 6, diceSuccess: 1 }

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
      ],
      skills: [
        { id: 1, name: '파이어볼', icon: '🔥', effect: '마법 공격력 120%', cooldown: '3초', mana: '20' },
        { id: 2, name: '힐', icon: '✨', effect: 'HP 80 회복', cooldown: '5초', mana: '25' },
      ],
    },
    {
      id: 'B', name: '파티원B', level: 4, race: '휴먼', status: '중독',
      hp: { current: 18, max: 20 }, mp: { current: 10, max: 20 },
      physicalAttack: 10, magicalAttack: 7, evade: 12, accuracy: 17, criticalRate: 5, diceSuccess: 1,
      core: { intelligence: 9, wisdom: 8, agility: 10, strength: 11, vitality: 10, luck: 9 },
      inventory: [
        { id: 4, name: '해독제', icon: '🧪', effect: '중독 해제', rarity: 'rare' },
      ],
      skills: [
        { id: 3, name: '쉴드', icon: '🛡️', effect: '방어력 50% 증가', cooldown: '8초', mana: '30' },
      ],
    },
  ]

  // 고정 슬롯(5개)로 패딩된 배열 반환
  const getInventorySlots = (items: PartyItem[]) => {
    const filled = items.slice(0, 5)
    while (filled.length < 5) {
      filled.push({ id: 1000 + filled.length, name: '빈 슬롯', icon: '', effect: '', rarity: 'empty' })
    }
    return filled
  }
  const getSkillSlots = (skills: PartySkill[]) => {
    const filled = skills.slice(0, 5)
    while (filled.length < 5) {
      filled.push({ id: 2000 + filled.length, name: '빈 슬롯', icon: '', effect: '', cooldown: '', mana: '' })
    }
    return filled
  }

  const send = (target: 'main' | 'party') => {
    if (target === 'main' && mainEnded) return
    const text = target === 'main' ? mainInput.trim() : partyInput.trim()
    if (!text) return
    const msg: ChatMessage = {
      id: Date.now(),
      user: myNickname,
      message: text,
      type: target,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }
    if (target === 'main') {
      const myMainCount = messages.reduce((n, m) => n + (m.user === myNickname && m.type === 'main' ? 1 : 0), 0)
      const nextCount = myMainCount + 1
      if (nextCount >= END_MAIN_COUNT) {
        const ts = msg.timestamp
        const sys: ChatMessage = { id: msg.id + 1, user: '시스템', message: `메인 채팅 ${END_MAIN_COUNT}회 도달로 게임이 종료되었습니다.`, type: 'main', timestamp: ts }
        setMessages(prev => prev.concat(msg, sys))
        setMainEnded(true)
        setShowGameOver(true)
        clearTurnTimer()
      } else {
        setMessages(prev => prev.concat(msg))
      }
    } else {
      setMessages(prev => prev.concat(msg))
    }
    target === 'main' ? setMainInput('') : setPartyInput('')
    // 즉시 스크롤 반영
    requestAnimationFrame(() => {
      if (target === 'main') scrollToBottom(mainChatRef.current)
      else scrollToBottom(partyChatRef.current)
    })
    // 다음 입력까지 타이머 재시작(메인 채팅에만 적용)
    if (target === 'main' && !mainEnded) scheduleTurnTimeout()
  }

  // 동일 사용자/동일 시각(분 단위)의 연속 메시지를 하나로 묶는다
  const buildGroupedMessages = (target: 'main' | 'party') => {
    const list = messages.filter(m => m.type === target)
    type Group = { user: string; timestamp: string; items: ChatMessage[] }
    const groups: Group[] = []
    for (const msg of list) {
      const last = groups[groups.length - 1]
      if (last && last.user === msg.user && last.timestamp === msg.timestamp) {
        last.items.push(msg)
      } else {
        groups.push({ user: msg.user, timestamp: msg.timestamp, items: [msg] })
      }
    }
    return groups
  }

  return (
    <div className="h-full min-h-screen bg-slate-900">
      <header className="h-12 bg-slate-800 border-b border-slate-700 flex items-center">
        <div className="mx-auto w-full max-w-[1400px] px-4 flex items-center justify-between">
          <div className="text-white text-lg font-bold truncate">{worldTitle}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExitConfirm(true)}
            className="h-8 px-2 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">나가기</span>
          </Button>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[1400px] grid grid-cols-[4fr_1.2fr] gap-4 p-4 h-[calc(100vh-48px)] min-h-0">
        {/* 메인 채팅 */}
        <div className="rounded-2xl bg-slate-800 border border-slate-700 flex flex-col h-full min-h-0 overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-700 text-white font-semibold">메인 채팅</div>
          <div ref={mainChatRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {buildGroupedMessages('main').map(group => {
              const isMine = group.user === myNickname
              return (
                <div key={`${group.user}-${group.timestamp}-${group.items[0].id}`} className={`${isMine ? 'text-right' : 'text-left'}`}>
                  {group.user === '시스템' ? (
                    <div className="flex justify-center my-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700">
                        <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">시스템</span>
                        <span className="text-slate-300">{group.items[0].message}</span>
                        <span className="text-slate-500">{group.timestamp}</span>
                      </div>
                    </div>
                  ) : isMine ? (
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-xs text-slate-300 mb-0.5"><span className="text-white font-medium">{myNickname}</span><span className="text-slate-400 ml-2">{group.timestamp}</span></div>
                      {group.items.map(item => (
                        <div key={item.id} className="bg-blue-600 text-white px-3 py-2 rounded-lg inline-block max-w-[80%] text-sm">
                          {item.message}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                        {group.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm mb-0.5"><span className="text-white font-medium">{group.user}</span><span className="text-slate-400 text-xs ml-2">{group.timestamp}</span></div>
                        <div className="flex flex-col gap-1">
                          {group.items.map(item => (
                            <div key={item.id} className="text-slate-300 text-sm">{item.message}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="px-4 py-3 border-t border-slate-700 flex gap-3">
            <Input disabled={mainEnded} value={mainInput} onChange={e => setMainInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send('main')} placeholder="메인 채팅을 입력하세요..." className="flex-1 border-white/10 bg-black/20 text-white placeholder:text-slate-400 text-sm h-9 disabled:opacity-50" />
            <Button disabled={mainEnded} onClick={() => send('main')} size="sm" className="h-9 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50">전송</Button>
          </div>
        </div>

        {/* 우측 패널: 유틸 + 파티 채팅 */}
        <div className="rounded-2xl bg-slate-800 border border-slate-700 flex flex-col h-full min-h-0 overflow-hidden">
          {/* 유틸 블록들: 탭 구성 */
          /* 탭: 내 상태, 파티원 상태. 인벤토리/스킬은 내 상태 탭 내부 아이콘으로 오픈 */}
          <div className="p-4 border-b border-slate-700 h-64 min-h-0 overflow-hidden flex flex-col">
            {/* 세그먼트 컨트롤 */}
            <div className="w-full rounded-full bg-slate-800 border border-slate-700 p-1 text-slate-300 grid grid-cols-2 gap-1">
              <button
                className={`w-full px-4 py-1.5 text-sm rounded-full transition-colors text-center ${utilityView === 'status' ? 'bg-slate-100/10 text-white shadow-inner' : 'hover:text-white'}`}
                onClick={() => setUtilityView('status')}
              >
                내 상태
              </button>
              <button
                className={`w-full px-4 py-1.5 text-sm rounded-full transition-colors text-center ${utilityView === 'party' ? 'bg-slate-100/10 text-white shadow-inner' : 'hover:text-white'}`}
                onClick={() => setUtilityView('party')}
              >
                파티원 상태
              </button>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="mt-3 flex-1 overflow-y-auto min-h-0">
              {utilityView === 'status' ? (
                <div className="rounded-lg border border-white/5 bg-black/20 p-3 text-sm text-slate-300">
                  {/* 상단: 닉네임/레벨 + 아이콘 */}
                  <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                    <div>
                      <div>닉네임: <span className="text-white">메롱</span></div>
                      <div className="mt-1 text-slate-300">레벨: <span className="text-white">1</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tooltip html="인벤토리">
                        <button
                          className="h-10 w-10 rounded-md border border-slate-600 bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
                          title="인벤토리"
                          onClick={() => setShowInventoryModal(true)}
                        >
                          <Backpack className="h-5 w-5" />
                        </button>
                      </Tooltip>
                      <Tooltip html="스킬">
                        <button
                          className="h-10 w-10 rounded-md border border-slate-600 bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
                          title="스킬"
                          onClick={() => setShowSkillsModal(true)}
                        >
                          <Wand2 className="h-5 w-5" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* 상세 정보: 파티원 모달과 동일한 구분선 구조 */}
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div>종족: <span className="text-white">엘프</span></div>
                    <div>상태: <span className="text-white">정상</span></div>
                  </div>
                  <div className="border-t border-slate-600" />
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div>HP: <span className="text-white">100/100</span></div>
                    <div>MP: <span className="text-white">100/100</span></div>
                  </div>
                  <div className="border-t border-slate-600" />
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div>물리 공격력: <span className="text-white">{myCombat.physicalAttack}</span></div>
                    <div>마법 공격력: <span className="text-white">{myCombat.magicalAttack}</span></div>
                  </div>
                  <div className="border-t border-slate-600" />
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div>회피율: <span className="text-white">{myCombat.evade}%</span></div>
                    <div>명중률: <span className="text-white">{myCombat.accuracy}%</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div>크리티컬 확률: <span className="text-white">{myCombat.criticalRate}%</span></div>
                    <div>주사위 성공률: <span className="text-white">+{myCombat.diceSuccess}%</span></div>
                  </div>

                  {/* 코어 스탯은 기존 유지 */}
                  <div className="bg-slate-700 rounded-lg p-3 border border-slate-600 mt-2">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>지능: <span className="text-white">10</span></div>
                      <div>지혜: <span className="text-white">10</span></div>
                      <div>의지: <span className="text-white">10</span></div>
                      <div>민첩: <span className="text-white">10</span></div>
                      <div>운: <span className="text-white">10</span></div>
                      <div>힘: <span className="text-white">10</span></div>
                    </div>
                  </div>
                  {/* 인벤토리/스킬 진입은 상단 아이콘으로 유지 */}
                </div>
              ) : (
                <div className="text-xs text-slate-300 w-full h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {partyMembers.map(member => (
                      <button
                        key={member.id}
                        className="w-full text-left px-1 py-1 rounded-md transition-colors"
                        onClick={() => setShowMember(member)}
                      >
                        <div className="rounded-md border border-slate-600 bg-slate-700/70 p-2 hover:border-slate-400 hover:bg-slate-600/70 focus:outline-none focus:ring-2 focus:ring-slate-400/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{member.name}</span>
                            <span className="text-xs text-slate-300">상태: <span className="text-white">{member.status}</span></span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="rounded border border-slate-600 bg-slate-800/70 px-2 py-1 text-xs text-slate-300">
                              HP: <span className="text-green-400">{member.hp.current}/{member.hp.max}</span>
                            </div>
                            <div className="rounded border border-slate-600 bg-slate-800/70 px-2 py-1 text-xs text-slate-300">
                              MP: <span className="text-blue-400">{member.mp.current}/{member.mp.max}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 파티 채팅 */}
          <div className="flex-1 overflow-hidden grid grid-rows-[1fr_auto] min-h-0">
			<div ref={partyChatRef} className="overflow-y-auto p-4 space-y-3 min-h-0">
              {buildGroupedMessages('party').map(group => {
                const isMine = group.user === myNickname
                return (
                  <div key={`${group.user}-${group.timestamp}-${group.items[0].id}`} className={`${isMine ? 'text-right' : 'text-left'}`}>
                    {group.user === '시스템' ? (
                      <div className="flex justify-center my-2">
                        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700">
                          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">시스템</span>
                          <span className="text-slate-300">{group.items[0].message}</span>
                          <span className="text-slate-500">{group.timestamp}</span>
                        </div>
                      </div>
                    ) : isMine ? (
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-xs text-slate-300 mb-0.5"><span className="text-white font-medium">{myNickname}</span><span className="text-slate-400 ml-2">{group.timestamp}</span></div>
                        {group.items.map(item => (
                          <div key={item.id} className="bg-purple-600 text-white px-3 py-2 rounded-lg inline-block max-w-[90%] text-sm">
                            {item.message}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {group.user.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm mb-0.5"><span className="text-white font-medium">{group.user}</span><span className="text-slate-400 text-xs ml-2">{group.timestamp}</span></div>
                          <div className="flex flex-col gap-1">
                            {group.items.map(item => (
                              <div key={item.id} className="text-slate-300 text-sm">{item.message}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="px-4 py-3 border-t border-slate-700 flex gap-2">
              <Input value={partyInput} onChange={e => setPartyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send('party')} placeholder="파티 채팅을 입력하세요..." className="flex-1 border-white/10 bg-black/20 text-white placeholder:text-slate-400 text-sm h-9" />
              <Button onClick={() => send('party')} size="sm" className="h-9 px-3 bg-purple-600 hover:bg-purple-700">전송</Button>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 모달 제거됨 - 탭에서 표시 */}

      {/* 인벤토리 모달 */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-4 border border-slate-600 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">인벤토리</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowInventoryModal(false)} className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-rows-[auto_auto] gap-3">
              <div className="grid grid-cols-5 gap-2 justify-items-center">
                {getInventorySlots(partyMembers[0].inventory).map((item, idx) => {
                  const rarityMap: Record<string, string> = { common: '일반', rare: '레어', epic: '에픽', legendary: '레전드리', empty: '빈 슬롯' }
                  const rarity = rarityMap[item.rarity]
                  const isEmpty = item.rarity === 'empty' || !item.name || item.name === '빈 슬롯'
                  return (
                    <button key={`${item.id}-${idx}`} onMouseEnter={() => setSelectedInventoryIdx(idx)} onFocus={() => setSelectedInventoryIdx(idx)} className={`w-16 h-16 rounded-lg border ${isEmpty ? 'border-dashed border-slate-600/60' : 'border-slate-600'} bg-slate-700 flex flex-col items-center justify-center relative hover:bg-slate-600 transition-colors`}>
                      <span className={`text-base ${isEmpty ? 'text-slate-500' : 'text-slate-200'}`}>{isEmpty ? '□' : item.icon}</span>
                      <span className={`text-[10px] text-center leading-none mt-1 h-4 overflow-hidden whitespace-nowrap text-ellipsis ${isEmpty ? 'text-slate-500' : 'text-slate-100'}`}>{isEmpty ? '빈 슬롯' : item.name}</span>
                    </button>
                  )
                })}
              </div>
              <div className="rounded-md border border-slate-600 bg-slate-800 p-3 text-sm text-slate-300 h-28 overflow-y-auto">
                {(() => {
                  const item = getInventorySlots(partyMembers[0].inventory)[selectedInventoryIdx]
                  if (!item) return null
                  const rarityMap: Record<string, string> = { common: '일반', rare: '레어', epic: '에픽', legendary: '레전드리', empty: '빈 슬롯' }
                  const rarity = rarityMap[item.rarity]
                  const isEmpty = item.rarity === 'empty' || !item.name || item.name === '빈 슬롯'
                  return (
                    <div className="space-y-1">
                      <div className="text-white font-medium">{isEmpty ? '빈 슬롯' : item.name}</div>
                      <div className={`${isEmpty ? 'text-slate-500' : ''}`}>{isEmpty ? '아이템이 없습니다.' : `효과: ${item.effect}`}</div>
                      <div className="text-slate-400">등급: {rarity}</div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 게임 종료 확인 모달 (메인 채팅) */}
      {showGameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-slate-800 rounded-lg p-6 max-w-sm mx-4 border border-slate-600 w-full">
            <div className="text-white text-lg font-semibold mb-2">게임이 종료되었습니다</div>
            <div className="text-slate-300 text-sm mb-4">메인 채팅 입력은 더 이상 할 수 없습니다. 파티 채팅은 계속 가능합니다.</div>
            <div className="flex justify-end gap-2">
              <Button size="sm" className="h-8 px-3 bg-blue-600 hover:bg-blue-700" onClick={() => setShowGameOver(false)}>확인</Button>
            </div>
          </div>
        </div>
      )}
      {/* 스킬 모달 */}
      {showSkillsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-4 border border-slate-600 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">스킬</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSkillsModal(false)} className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-rows-[auto_auto] gap-3">
              <div className="grid grid-cols-5 gap-2 justify-items-center">
                {getSkillSlots(partyMembers[0].skills).map((skill, idx) => {
                  const isEmpty = !skill.name || skill.name === '빈 슬롯'
                  return (
                    <button key={`${skill.id}-${idx}`} onMouseEnter={() => setSelectedSkillIdx(idx)} onFocus={() => setSelectedSkillIdx(idx)} className={`w-16 h-16 rounded-lg border ${isEmpty ? 'border-dashed border-slate-600/60' : 'border-slate-600'} bg-slate-700 flex flex-col items-center justify-center relative hover:bg-slate-600 transition-colors`}>
                      <div className={`mb-1 ${isEmpty ? 'text-slate-500' : ''}`}>{isEmpty ? '□' : <span className="text-2xl">{skill.icon}</span>}</div>
                      <div className={`text-[10px] ${isEmpty ? 'text-slate-500' : 'text-white'} font-medium text-center leading-none h-4 overflow-hidden whitespace-nowrap text-ellipsis`}>{isEmpty ? '빈 슬롯' : skill.name}</div>
                    </button>
                  )
                })}
              </div>
              <div className="rounded-md border border-slate-600 bg-slate-800 p-3 text-sm text-slate-300 h-28 overflow-y-auto">
                {(() => {
                  const skill = getSkillSlots(partyMembers[0].skills)[selectedSkillIdx]
                  if (!skill) return null
                  const isEmpty = !skill.name || skill.name === '빈 슬롯'
                  return (
                    <div className="space-y-1">
                      <div className="text-white font-medium">{isEmpty ? '빈 슬롯' : skill.name}</div>
                      <div className={`${isEmpty ? 'text-slate-500' : ''}`}>{isEmpty ? '스킬이 없습니다.' : skill.effect}</div>
                      <div className="text-slate-400">
                        {isEmpty ? '쿨다운/MP 정보 없음' : <>
                          {skill.cooldown && <>쿨다운: {skill.cooldown} </>}
                          {skill.mana && <>MP: {skill.mana}</>}
                        </>}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 턴 종료 버튼/모달 제거 */}

      {/* 파티원 상세 모달 */}
      {showMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-4 border border-slate-600 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">{showMember.name} 상태</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowMember(null)} className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* 상태 정보 + 구분선 */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">닉네임 :</span> {showMember.name}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">레벨 :</span> {showMember.level}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">종족 :</span> {showMember.race}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">상태 :</span> {showMember.status}</div>
              </div>
              <div className="border-t border-slate-600" />
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">HP :</span> {showMember.hp.current}/{showMember.hp.max}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">MP :</span> {showMember.mp.current}/{showMember.mp.max}</div>
              </div>
              <div className="border-t border-slate-600" />
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">물리 공격력 :</span> {showMember.physicalAttack}</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">마법 공격력 :</span> {showMember.magicalAttack}</div>
              </div>
              <div className="border-t border-slate-600" />
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">회피율 :</span> {showMember.evade}%</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">명중률 :</span> {showMember.accuracy}%</div>
              </div>
              {/* 확률 섹션과는 구분선 없음 */}
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-slate-300"><span className="font-medium text-white">크리티컬 확률 :</span> {showMember.criticalRate}%</div>
                <div className="text-sm text-slate-300"><span className="font-medium text-white">주사위 성공률 :</span> +{showMember.diceSuccess}%</div>
              </div>
            </div>
            <div className="border-t border-slate-600 mb-4" />

            {/* 코어 스탯 (접기/펼치기) */}
            <div className="mb-4">
              <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm"
                onClick={() => setIsCoreOpen(v => !v)}
              >
                <span>코어 스탯</span>
                {isCoreOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {isCoreOpen && (
                <div className="bg-slate-700 rounded-b-md p-4 border border-slate-600 border-t-0 mt-1">
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-sm text-slate-300"><span className="font-medium text-white">지능:</span> {showMember.core.intelligence}</div>
                    <div className="text-sm text-slate-300"><span className="font-medium text-white">지혜:</span> {showMember.core.wisdom}</div>
                    <div className="text-sm text-slate-300"><span className="font-medium text-white">민첩:</span> {showMember.core.agility}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm text-slate-300"><span className="font-medium text-white">힘:</span> {showMember.core.strength}</div>
                    <div className="text-sm text-slate-300"><span className="font-medium text-white">체력:</span> {showMember.core.vitality}</div>
                    <div className="text-sm text-slate-300"><span className="font-medium text-white">운:</span> {showMember.core.luck}</div>
                  </div>
                </div>
              )}
            </div>

            {/* 인벤토리 (접기/펼치기) */}
            <div className="mb-4">
              <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm"
                onClick={() => setIsInvOpen(v => !v)}
              >
                <span>인벤토리</span>
                {isInvOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {isInvOpen && (
                <div className="bg-slate-700 rounded-b-md p-4 border border-slate-600 border-t-0 mt-1">
                  <div className="grid grid-cols-3 gap-2">
                    {showMember.inventory.map(item => {
                      const rarityMap: Record<string, string> = { common: '일반', rare: '레어', epic: '에픽', legendary: '레전드리', empty: '빈 슬롯' }
                      const rarity = rarityMap[item.rarity]
                      const html = `
                        <div class=\\"font-medium mb-1\\">${item.name}</div>
                        ${item.effect ? `<div class=\\"text-slate-300\\">효과: ${item.effect}</div>` : ''}
                        ${rarity ? `<div class=\\"text-slate-400 mt-1\\">등급: ${rarity}</div>` : ''}
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
                </div>
              )}
            </div>

            {/* 스킬 (접기/펼치기) */}
            <div className="mb-2">
              <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm"
                onClick={() => setIsSkillsOpen(v => !v)}
              >
                <span>스킬</span>
                {isSkillsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {isSkillsOpen && (
                <div className="bg-slate-700 rounded-b-md p-4 border border-slate-600 border-t-0 mt-1">
                  <div className="grid grid-cols-3 gap-2">
                    {showMember.skills.map(skill => {
                      const html = `
                        <div class=\\"font-medium mb-1\\">${skill.name}</div>
                        ${skill.effect ? `<div class=\\"text-slate-300\\">${skill.effect}</div>` : ''}
                        ${skill.cooldown ? `<div class=\\"text-slate-400 mt-1\\">쿨다운: ${skill.cooldown}</div>` : ''}
                        ${skill.mana ? `<div class=\\"text-slate-400\\">MP: ${skill.mana}</div>` : ''}
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
              )}
            </div>
          </div>
        </div>
      )}

      {/* 방 나가기 확인 모달 */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-slate-800 rounded-lg p-6 max-w-sm mx-4 border border-slate-600">
            <div className="text-white text-lg font-semibold mb-2">방에서 나가시겠습니까?</div>
            <div className="text-slate-300 text-sm mb-4">메인 화면으로 이동합니다.</div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-3 text-slate-300 hover:text-white hover:bg-slate-700" onClick={() => setShowExitConfirm(false)}>취소</Button>
              <Button size="sm" className="h-8 px-3 bg-red-600 hover:bg-red-700" onClick={() => { setShowExitConfirm(false); navigate('/dungeon') }}>나가기</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



