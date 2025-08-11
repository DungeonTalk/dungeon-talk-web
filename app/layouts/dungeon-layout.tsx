import { Outlet, useNavigate, useLocation } from 'react-router'
import { Button } from '../components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function DungeonLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 각 경로에 대한 제목 매핑
  const getTitleByPath = (path: string) => {
    if (path === '/dungeon' || path === '/dungeon/') return 'Dungeon Talk'
    if (path.includes('/dungeon/mode-selection')) {
      const searchParams = new URLSearchParams(location.search)
      const world = searchParams.get('world')
      return world || '게임 선택'
    }
    if (path.includes('/dungeon/single-play')) return ''
    if (path.includes('/dungeon/multi-play')) return '멀티플레이'
    if (path.includes('/dungeon/party-finding')) return '멀티'
    if (path.includes('/dungeon/chat-demo')) return ''
    return 'Dungeon Talk'
  }
  
  const handleBack = () => {
    navigate('/dungeon')
  }
  
  const isMainPage = location.pathname === '/dungeon' || location.pathname === '/dungeon/'
  
  return (
    <div className="h-dvh p-4 flex items-center justify-center">
      <div className="w-full max-w-md h-full bg-slate-800 rounded-3xl shadow-lg overflow-hidden grid grid-rows-[auto_1fr]">
        {/* 헤더 */}
        {!location.pathname.includes('/dungeon/single-play') && !location.pathname.includes('/dungeon/chat-demo') && !location.pathname.includes('/dungeon/multi-play') && (
          <header className="bg-slate-800 p-6 text-center border-b border-slate-700 relative">
            {!isMainPage && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-white"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className={`${isMainPage ? 'text-2xl' : 'text-xl'} font-bold text-white`}>
              {getTitleByPath(location.pathname)}
            </h1>
          </header>
        )}
        
        {/* 페이지 콘텐츠 */}
        <main className="overflow-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  )
}