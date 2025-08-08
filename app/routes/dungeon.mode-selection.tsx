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

  return (
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
  )
}