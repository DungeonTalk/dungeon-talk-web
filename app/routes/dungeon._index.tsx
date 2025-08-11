import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Plus, Minus } from 'lucide-react'

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

  // 능력치 수정 함수
  const modifyStat = (statName: string, amount: number) => {
    setStats(prev => {
      const newStats = { ...prev }
      const newBonus = Math.max(0, newStats[statName].bonus + amount)
      newStats[statName] = {
        ...newStats[statName],
        bonus: newBonus,
        total: newStats[statName].base + newBonus
      }
      return newStats
    })
  }

  const handleWorldSelect = (worldName: string) => {
    navigate(`/dungeon/mode-selection?world=${encodeURIComponent(worldName)}`)
  }

  return (
    <div className="p-6">
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
          <div className="bg-slate-700 rounded-lg p-4 mb-4">
            {/* 기본 정보 */}
            <div className="space-y-3 mb-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">닉네임</span>
                  <span className="font-semibold text-white">베룡</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">레벨</span>
                  <span className="font-semibold text-white">1</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">종족</span>
                  <span className="font-semibold text-white">인간</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">HP</span>
                  <span className="font-semibold text-green-400">100/100</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">MP</span>
                  <span className="font-semibold text-blue-400">100/100</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-600 mb-3"></div>
            
            {/* 공격력 */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">물리 공격력</span>
                <span className="font-semibold text-orange-400">10</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">마법 공격력</span>
                <span className="font-semibold text-purple-400">10</span>
              </div>
            </div>
            
            <div className="border-t border-slate-600 mb-3"></div>
            
            {/* 능력치 */}
            <div className="grid grid-cols-3 gap-2">
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
                  <div key={key} className="text-center p-2 bg-slate-600/50 rounded">
                    <div className="text-slate-300 text-xs">{statNames[key as keyof typeof statNames]}</div>
                    <div className="font-bold text-white mb-1">{stat.total}</div>
                    {stat.bonus > 0 && (
                      <div className="text-green-400 text-xs mb-1">+{stat.bonus}</div>
                    )}
                    <div className="flex justify-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 text-xs border-slate-500 hover:bg-slate-600"
                        onClick={() => modifyStat(key, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 text-xs border-slate-500 hover:bg-slate-600"
                        onClick={() => modifyStat(key, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 추가 능력치 요약 */}
            {Object.values(stats).some(stat => stat.bonus > 0) && (
              <>
                <div className="border-t border-slate-600 mt-3 mb-2"></div>
                <div className="text-center">
                  <div className="text-slate-300 text-xs mb-1">추가 능력치</div>
                  <div className="text-green-400 text-sm font-medium">
                    총 +{Object.values(stats).reduce((sum, stat) => sum + stat.bonus, 0)} 포인트
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 월드 선택 */}
          <div className="text-center mb-3">
            <Button 
              variant="outline" 
              className="px-4 py-1 rounded-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
              onClick={() => {/* 세계종류 버튼 기능 */}}
            >
              세계종류
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button
              variant="outline"
              className="h-14 rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
              onClick={() => handleWorldSelect('잊혀진 별의 마지막 노래')}
            >
              잊혀진 별의<br />마지막 노래
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
              onClick={() => handleWorldSelect('좀비 아포칼립스')}
            >
              좀비<br />아포칼립스
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
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