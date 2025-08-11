import React from 'react'

interface LoadingVideoProps {
  message: string
  subMessage?: string
  loop?: boolean
}

export default function LoadingVideo({ message, subMessage, loop = true }: LoadingVideoProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="mx-auto flex max-w-sm flex-col overflow-hidden rounded-2xl bg-slate-800 shadow-lg w-full">
        <div className="relative w-full h-64 bg-black">
          <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop={loop}>
            <source src="/Loading.mp4" type="video/mp4" />
            로딩 중...
          </video>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="text-white font-medium">{message}</div>
            {subMessage && <div className="text-slate-300 text-sm mt-1">{subMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
