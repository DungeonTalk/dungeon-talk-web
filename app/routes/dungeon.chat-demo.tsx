import { lazy, Suspense } from 'react'

const WebChatInterface = lazy(() => import('../components/web-chat-interface'))

export default function ChatDemoPage() {
  return (
    <div className="h-full">
      <Suspense fallback={
        <div className="h-full bg-slate-800 flex items-center justify-center">
          <div className="text-white">채팅 데모 로딩중...</div>
        </div>
      }>
        <WebChatInterface />
      </Suspense>
    </div>
  )
}