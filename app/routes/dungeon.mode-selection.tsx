import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '../components/ui/button'

export default function ModeSelectionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedWorld = searchParams.get('world') || ''

  const handleModeSelect = (mode: 'single' | 'multi') => {
    if (mode === 'multi') {
      navigate(`/dungeon/party-finding?world=${encodeURIComponent(selectedWorld)}`)
    } else {
      navigate(`/dungeon/single-play?world=${encodeURIComponent(selectedWorld)}`)
    }
  }

  // 게임별 이미지 매핑
  const getGameArt = (worldName: string) => {
    if (worldName.includes('잊혀진 별')) {
      return {
        src: '/powerful-mage.png',
        gradient: 'from-purple-900/50 to-blue-900/50',
        accent: 'text-purple-300'
      }
    } else if (worldName.includes('좀비')) {
      return {
        src: '/zombie.png',
        gradient: 'from-red-900/50 to-orange-900/50',
        accent: 'text-red-300'
      }
    } else if (worldName.includes('시간의 미궁')) {
      return {
        src: '/armored-warrior.png',
        gradient: 'from-amber-900/50 to-yellow-900/50',
        accent: 'text-amber-300'
      }
    }
    return {
      src: '/placeholder-logo.png',
      gradient: 'from-slate-900/50 to-slate-800/50',
      accent: 'text-slate-300'
    }
  }

  const art = getGameArt(selectedWorld)

  // 좀비 아포칼립스용 World War Z 스타일 포스터
  const ZombiePoster = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* 좀비 실루엣들 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-center space-x-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-8 h-16 bg-red-900/60 rounded-t-full transform -skew-x-12"></div>
          ))}
        </div>
      </div>
      
      {/* 붉은 안개 효과 */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-transparent to-transparent"></div>
      
      {/* 제목 */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-4xl font-bold text-red-500 drop-shadow-2xl">ZOMBIE</h1>
        <h2 className="text-2xl font-semibold text-red-400 drop-shadow-xl">APOCALYPSE</h2>
      </div>
      
      {/* 경고 텍스트 */}
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-red-300 text-sm font-mono">SURVIVAL IS NOT AN OPTION</p>
        <p className="text-red-400 text-xs font-mono">IT'S THE ONLY WAY</p>
      </div>
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">{selectedWorld}</h1>
        
        {/* 게임 이미지 */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
          {selectedWorld.includes('좀비') ? (
            <ZombiePoster />
          ) : (
            <img
              src={art.src}
              alt={selectedWorld}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {!selectedWorld.includes('좀비') && (
            <div className={`absolute inset-0 bg-gradient-to-tr ${art.gradient} mix-blend-multiply`} />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className={`text-lg font-semibold ${art.accent}`}>{selectedWorld}</div>
            <div className="text-slate-300 text-xs">세계에 어울리는 분위기로 모험을 시작하세요</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Button
          variant="outline"
          className="h-32 rounded-2xl text-lg font-semibold border-slate-600 text-slate-300 hover:bg-slate-700"
          onClick={() => handleModeSelect('single')}
        >
          싱글플레이
        </Button>
        <Button
          variant="outline"
          className="h-32 rounded-2xl text-lg font-semibold border-slate-600 text-slate-300 hover:bg-slate-700"
          onClick={() => handleModeSelect('multi')}
        >
          멀티플레이
        </Button>
      </div>
    </div>
  )
}