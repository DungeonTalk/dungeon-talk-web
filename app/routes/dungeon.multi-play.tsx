import { lazy, Suspense, useState, useEffect } from 'react'
import LoadingVideo from '@/components/loading-video'

const MobileChatInterface = lazy(() => import('../components/mobile-chat-interface'))

export default function MultiPlayPage() {
  const [loadingPhase, setLoadingPhase] = useState<'initial' | 'transition' | 'complete'>('initial')

  useEffect(() => {
    const initialTimer = setTimeout(() => setLoadingPhase('transition'), 3000)
    const transitionTimer = setTimeout(() => setLoadingPhase('complete'), 6000)
    return () => { clearTimeout(initialTimer); clearTimeout(transitionTimer) }
  }, [])

  if (loadingPhase === 'initial') {
    return <LoadingVideo message="멀티플레이에 입장 중..." />
  }

  if (loadingPhase === 'transition') {
    return <LoadingVideo message="채팅방으로 이동 중..." />
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading chat...</div>
      </div>
    }>
      <MobileChatInterface />
    </Suspense>
  )
}