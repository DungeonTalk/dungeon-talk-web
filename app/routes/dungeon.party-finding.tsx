import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { X } from 'lucide-react'
import LoadingVideo from '@/components/loading-video'

export default function PartyFindingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedWorld = searchParams.get('world') || ''
  const [partyCount, setPartyCount] = useState(1)
  const [isPartyComplete, setIsPartyComplete] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPartyCount(prev => {
        if (prev < 3) {
          return prev + 1
        } else {
          setIsPartyComplete(true)
          clearInterval(interval)
          // 3/3 상태에서 바로 로딩 화면 표시
          setShowLoading(true)
          // 3초 후 채팅 화면으로 이동
          setTimeout(() => {
            navigate(`/dungeon/chat-demo?world=${encodeURIComponent(selectedWorld)}`)
          }, 3000)
          return prev
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [navigate, selectedWorld])

  const handleCancel = () => {
    navigate(`/dungeon/mode-selection?world=${encodeURIComponent(selectedWorld)}`)
  }

  // 로딩 화면 표시
  if (showLoading) {
    return (
      <LoadingVideo message="던전에 입장 중..." />
    )
  }

  return (
    <div className="p-8">
          <Card className="h-80 flex flex-col items-center justify-center bg-slate-800 border border-slate-700">
            <CardContent className="text-center p-8">
              <div className="mb-8">
                <p className="text-lg font-semibold text-slate-300 mb-2">
                  파티원을
                </p>
                <p className="text-lg font-semibold text-slate-300 mb-4">
                  찾는중입니다.
                </p>
                <p className="text-2xl font-bold text-blue-600">{partyCount}/3</p>
              </div>
              
              <div className="mb-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              </div>

              <Button
                variant="ghost"
                size="lg"
                className="rounded-full text-slate-300 hover:text-white"
                onClick={handleCancel}
              >
                <X className="h-6 w-6 mr-2" />
                취소
              </Button>
            </CardContent>
          </Card>
    </div>
  )
}


