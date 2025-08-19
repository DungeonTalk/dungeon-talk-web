import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { logout as logoutApi } from '@/http/authControllerApi'
import { getMemberIdFromToken } from '@/http/client'
import { getCharacterByMember } from '@/http/gameCharacterApi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Plus, Minus } from 'lucide-react'
import { ROUTES } from '@/constants/routes'

interface Stat {
  base: number
  bonus: number
  total: number
}

export default function DungeonMainPage() {
  const navigate = useNavigate()
  
  // 능력치 상태 관리
  const [stats, setStats] = useState<Record<string, Stat>>({
    strength: { base: 10, bonus: 0, total: 10 },
    wisdom: { base: 10, bonus: 0, total: 10 },
    willpower: { base: 10, bonus: 0, total: 10 },
    agility: { base: 10, bonus: 0, total: 10 },
    intelligence: { base: 10, bonus: 0, total: 10 },
    luck: { base: 10, bonus: 0, total: 10 }
  })

  // 추가 포인트 총량 (필요 시 조정 또는 서버 값 연동)
  const [availableBonusPoints] = useState<number>(5)

  // 능력치 수정 함수 (+/- 제한 포함)
  const modifyStat = (statName: string, amount: number) => {
    if (amount === 0) return

    setStats(prevStats => {
      const current = prevStats[statName]
      if (!current) return prevStats

      const totalAllocated = Object.values(prevStats).reduce((sum, s) => sum + s.bonus, 0)

      // 증가: 남은 포인트가 없으면 불가
      if (amount > 0 && totalAllocated >= availableBonusPoints) {
        return prevStats
      }

      // 감소: 해당 스탯에 할당된 보너스가 없으면 불가
      if (amount < 0 && current.bonus <= 0) {
        return prevStats
      }

      const newBonus = Math.max(0, current.bonus + amount)
      const updated: Record<string, Stat> = {
        ...prevStats,
        [statName]: {
          ...current,
          bonus: newBonus,
          total: current.base + newBonus,
        },
      }
      return updated
    })
  }

  const totalAllocated = Object.values(stats).reduce((sum, stat) => sum + stat.bonus, 0)
  const remainingBonusPoints = availableBonusPoints - totalAllocated

  const handleWorldSelect = (worldName: string) => {
		navigate(`/dungeon/party-finding?world=${encodeURIComponent(worldName)}`)
  }

  // UI 상태
  const [isSaveOpen, setIsSaveOpen] = useState(false)

  // 로그인 체크 및 리다이렉트
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const v = localStorage.getItem('dgt_logged_in')
        if (v !== '1') {
          navigate(ROUTES.SIGNIN)
          return
        }
      }
    } catch {
      navigate(ROUTES.SIGNIN)
    }
  }, [navigate])

  // 캐릭터 정보 로드 및 저장된 보너스 스탯 복원
  useEffect(() => {
    ;(async () => {
      try {
        const memberId = getMemberIdFromToken()
        if (memberId) {
          const { data } = await getCharacterByMember(memberId)
          const c = data?.data
          if (c) {
            // 기본 표시에 반영 가능한 부분이 있으면 여기서 상태 업데이트
            // 현재 UI의 닉네임/레벨/종족 자리에 반영 위해 로컬 상태를 추가
            setProfile({ nickname: c.name || '모험가', level: c.level || 1, race: c.race || '인간', hp: c.hp || 100, mp: c.mp || 100 })
          }
        }
      } catch {}
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem('dgt_stats')
          if (raw) {
            const parsed = JSON.parse(raw)
            if (parsed && typeof parsed === 'object') {
              setStats(prev => {
                const updated: Record<string, Stat> = { ...prev }
                for (const k of Object.keys(updated)) {
                  const item = (parsed as any)[k]
                  if (item && item.bonus != null) {
                    const base = updated[k].base
                    const bonus = Math.max(0, Number(item.bonus) || 0)
                    updated[k] = { base, bonus, total: base + bonus }
                  }
                }
                return updated
              })
            }
          }
        }
      } catch {}
    })()
  }, [])

  // 캐릭터 프로필 표시용 상태
  const [profile, setProfile] = useState({ nickname: '모험가', level: 1, race: '인간', hp: 100, mp: 100 })

  const handleLogout = async () => {
    try { await logoutApi() } catch {}
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('dgt_logged_in')
      }
    } catch {}
    navigate(ROUTES.SIGNIN)
  }

  const handleSaveBonus = () => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const compact: Record<string, { bonus: number }> = {}
        for (const [k, v] of Object.entries(stats)) compact[k] = { bonus: v.bonus }
        localStorage.setItem('dgt_stats', JSON.stringify(compact))
      }
    } catch {}
    setIsSaveOpen(true)
  }

  	  return (
  		<div className="p-5">
          <div className="w-full h-20 sm:h-24 md:h-28 overflow-hidden flex items-center justify-center mb-6">
            <img
              src="/dungeontalk-open.svg"
              alt="던전톡 오픈!"
              className="max-w-full h-full object-contain object-center"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement
                if (!img.dataset.fallback) {
                  img.dataset.fallback = '1'
                  img.src = '/placeholder-logo.png'
                }
              }}
            />
          </div>

          {/* 스탯 */}
          <div className="bg-slate-700 rounded-lg p-3 mb-3">
            {/* 기본 정보 */}
            <div className="space-y-2 mb-2">
                <div className="grid grid-cols-3 gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">닉네임</span>
                  <span className="font-semibold text-white">{profile.nickname}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">레벨</span>
                  <span className="font-semibold text-white">{profile.level}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">종족</span>
                  <span className="font-semibold text-white">{profile.race}</span>
                </div>
              </div>
                <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">HP</span>
                  <span className="font-semibold text-green-400">{profile.hp}/{profile.hp}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">MP</span>
                  <span className="font-semibold text-blue-400">{profile.mp}/{profile.mp}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-600 mb-2"></div>
            
            {/* 공격력 */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">물리 공격력</span>
                <span className="font-semibold text-orange-400">10</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">마법 공격력</span>
                <span className="font-semibold text-purple-400">10</span>
              </div>
            </div>
            
            <div className="border-t border-slate-600 mb-2"></div>
            
            {/* 능력치 */}
            {/* 추가 포인트 표시 (게이지 제거) */}
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">추가 가능 포인트</span>
                <span className="text-xs"><span className={`${remainingBonusPoints > 0 ? 'text-green-400' : 'text-slate-400'}`}>{remainingBonusPoints}</span>/<span className="text-slate-300">{availableBonusPoints}</span></span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {Object.entries(stats).map(([key, stat]) => {
                const statNames = {
                  strength: '힘',
                  wisdom: '지혜',
                  willpower: '의지',
                  agility: '민첩',
                  intelligence: '지능',
                  luck: '운'
                }
                
                return (
                  <div key={key} className="text-center p-1.5 bg-slate-600/50 rounded">
                    <div className="text-[10px] text-slate-300 leading-none mb-1">{statNames[key as keyof typeof statNames]}</div>
                    <div className="flex items-baseline justify-center gap-1 mb-1">
                      <span className="text-white font-semibold text-sm leading-none">{stat.total}</span>
                      {stat.bonus > 0 && (
                        <span className="text-green-400 text-[10px] leading-none">(+{stat.bonus})</span>
                      )}
                    </div>
                    <div className="flex justify-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-5 w-5 p-0 text-[10px] border-slate-500 hover:bg-slate-600"
                         disabled={stat.bonus <= 0}
                        onClick={() => modifyStat(key, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-5 w-5 p-0 text-[10px] border-slate-500 hover:bg-slate-600"
                         disabled={remainingBonusPoints <= 0}
                        onClick={() => modifyStat(key, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 저장/로그아웃 버튼 배치: 저장은 왼쪽, 로그아웃은 오른쪽 끝 */}
            <div className="mt-2 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                className="h-8 px-3 border-slate-500 text-slate-200 hover:bg-slate-600"
                onClick={handleSaveBonus}
              >
                추가 능력치 저장
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-8 px-3 border-white/40 text-white hover:bg-white/10"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </div>
            </div>

            {/* 저장 완료 모달 */}
            <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
              <DialogContent className="bg-slate-800 border border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>저장 완료</DialogTitle>
                  <DialogDescription className="text-slate-300">
                    추가 능력치가 저장되었습니다.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => setIsSaveOpen(false)} className="bg-blue-600 hover:bg-blue-700">
                    확인
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 추가 능력치 총합 표시는 사용자 요청으로 제거 */}
          </div>

          {/* 월드 선택 */}
          <div className="text-center mb-2">
            <Button 
              variant="outline" 
              className="px-4 py-1 rounded-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
              onClick={() => {/* 세계종류 버튼 기능 */}}
            >
              세계종류
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <Button
              variant="outline"
              className="h-12 rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
              onClick={() => handleWorldSelect('잊혀진 별의 마지막 노래')}
            >
              잊혀진 별의<br />마지막 노래
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
              onClick={() => handleWorldSelect('좀비 아포칼립스')}
            >
              좀비<br />아포칼립스
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
              onClick={() => handleWorldSelect('시간의 미궁')}
            >
              시간의<br />미궁
            </Button>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">더보기 →</span>
          </div>
        </div>
  )
}