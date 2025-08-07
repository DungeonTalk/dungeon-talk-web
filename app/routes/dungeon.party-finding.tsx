import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { ArrowLeft, X } from 'lucide-react'

export default function PartyFindingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedWorld = searchParams.get('world') || ''
  const [partyCount, setPartyCount] = useState(1)
  const [isPartyComplete, setIsPartyComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPartyCount(prev => {
        if (prev < 3) {
          return prev + 1
        } else {
          setIsPartyComplete(true)
          clearInterval(interval)
          setTimeout(() => {
            navigate(`/dungeon/multi-play?world=${encodeURIComponent(selectedWorld)}`)
          }, 2000)
          return prev
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [navigate, selectedWorld])

  const handleBack = () => {
    navigate(`/dungeon/mode-selection?world=${encodeURIComponent(selectedWorld)}`)
  }

  const handleCancel = () => {
    navigate(`/dungeon/mode-selection?world=${encodeURIComponent(selectedWorld)}`)
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-md mx-auto bg-slate-800 rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 p-6 text-center border-b border-slate-700 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-white"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-white">멀티</h1>
        </div>

        {/* Party Finding */}
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
      </div>
    </div>
  )
}