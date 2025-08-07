import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '../components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ModeSelectionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedWorld = searchParams.get('world') || ''

  const handleBack = () => {
    navigate('/dungeon')
  }

  const handleModeSelect = (mode: 'single' | 'multi') => {
    if (mode === 'multi') {
      navigate(`/dungeon/party-finding?world=${encodeURIComponent(selectedWorld)}`)
    } else {
      navigate(`/dungeon/single-play?world=${encodeURIComponent(selectedWorld)}`)
    }
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
          <h1 className="text-xl font-bold text-white">{selectedWorld}</h1>
        </div>

        {/* Mode Selection */}
        <div className="p-8">
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
      </div>
    </div>
  )
}