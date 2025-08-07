import { lazy, Suspense } from 'react'

const MobileChatInterface = lazy(() => import('../components/mobile-chat-interface'))

export default function MultiPlayPage() {
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