import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { Button } from '../components/ui/button'
import { X } from 'lucide-react'
import Tooltip from "@/components/tooltip";
import LoadingVideo from "@/components/loading-video";

export default function SinglePlayPage() {
  const [showExitModal, setShowExitModal] = useState(false)
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState<'transition' | 'complete'>('transition')
  const [searchParams] = useSearchParams()
  const selectedWorld = searchParams.get('world') || '던전 게임'
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPhase('complete'), 3000)
    return () => clearTimeout(timer)
  }, [])

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

  // 로딩 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      // setIsLoading(false) // Removed as per new_code
    }, 3000) // 3초 후 로딩 완료

    return () => clearTimeout(timer)
  }, [])

  const handleExit = () => {
    setShowExitModal(true)
  }

  const confirmExit = () => {
    navigate('/dungeon')
  }

  const cancelExit = () => {
    setShowExitModal(false)
  }

  if (loadingPhase === 'transition') {
    return <LoadingVideo message="던전에 입장 중..." />
  }

  return (
    <div className="min-h-screen bg-slate-900 p-2">
      <div className="mx-auto flex max-w-sm flex-col overflow-hidden rounded-2xl bg-slate-800 shadow-lg min-h-[600px] h-full">
        {/* 상단 X 버튼 */}
        <div className="flex justify-between items-center p-3 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-white font-medium text-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
              {selectedWorld || '던전 게임'}
            </div>
            <div className="text-slate-400 text-sm mt-1">
              싱글 플레이
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

        {/* 본문 영역 (채팅 제거됨) */}
        <div className="flex-1 overflow-hidden relative min-h-0 p-3">
          <div className="h-full w-full rounded-lg border border-slate-700 bg-slate-800/60 flex items-center justify-center">
            <div className="text-slate-300 text-sm text-center px-3">
              싱글 플레이 모드입니다. 채팅과 연결 기능은 제거되었습니다.
            </div>
          </div>
        </div>

        {/* 하단 패널 */}
        <div className="flex-shrink-0 space-y-2 border-t border-slate-700 p-2">
          <div className="grid grid-cols-2 gap-2">
            <div 
              className="rounded-lg border border-white/5 bg-black/20 p-2 text-center cursor-pointer hover:bg-black/30 transition-colors"
              onClick={() => setShowStatusModal(true)}
            >
              <div className="text-xs text-slate-300">HP: <span className="text-green-400">85/100</span></div>
              <div className="text-xs text-slate-300">MP: <span className="text-blue-400">42/50</span></div>
            </div>
            <button 
              className="rounded-lg border border-white/5 bg-black/20 px-2 py-2 text-xs text-white"
              onClick={() => setShowInventoryModal(true)}
            >
              인벤토리/스킬
            </button>
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

      {/* 던전 클리어 모달 제거됨 */}

      {/* 인벤토리/스킬 모달 */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white whitespace-nowrap">인벤토리 & 스킬</h3>
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
          <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-4 border border-slate-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">내 상태</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStatusModal(false)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
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
                  <span className="font-medium text-white">주사위 성공률 :</span> +1%
                </div>
              </div>
            </div>

            {/* 코어 스탯 */}
            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">지능:</span> 10
                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">지혜 :</span> 10
                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">의지 :</span> 10
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">민첩:</span> 10
                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">운:</span> 10
                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">힘:</span> 10
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}