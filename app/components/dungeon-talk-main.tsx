import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { ArrowLeft, X } from 'lucide-react'
import DynamicMobileChat from './dynamic-mobile-chat'

type Screen = 'main' | 'mode-selection' | 'party-finding' | 'single-play' | 'multi-play'

export default function DungeonTalkMain() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main')
  const [selectedWorld, setSelectedWorld] = useState<string>('')
  const [isChatActive, setIsChatActive] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{id: number, text: string, sender: string}>>([
    { id: 1, text: "던전에 입장했습니다.", sender: "시스템" },
    { id: 2, text: "앞에 보물상자가 보입니다.", sender: "내레이터" }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [partyCount, setPartyCount] = useState(1)
  const [isPartyComplete, setIsPartyComplete] = useState(false)

  useEffect(() => {
    if (currentScreen === 'party-finding') {
      const interval = setInterval(() => {
        setPartyCount(prev => {
          if (prev < 3) {
            return prev + 1
          } else {
            setIsPartyComplete(true)
            clearInterval(interval)
            setTimeout(() => {
              setCurrentScreen('multi-play')
            }, 2000)
            return prev
          }
        })
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [currentScreen])

  const handleWorldSelect = (worldName: string) => {
    setSelectedWorld(worldName)
    setCurrentScreen('mode-selection')
  }

  const handleModeSelect = (mode: 'single' | 'multi') => {
    if (mode === 'multi') {
      setPartyCount(1)
      setIsPartyComplete(false)
      setCurrentScreen('party-finding')
    } else {
      setCurrentScreen('single-play')
    }
  }

  const handleBack = () => {
    if (currentScreen === 'mode-selection') {
      setCurrentScreen('main')
    } else if (currentScreen === 'party-finding') {
      setCurrentScreen('mode-selection')
    } else if (currentScreen === 'single-play') {
      setCurrentScreen('mode-selection')
    } else if (currentScreen === 'multi-play') {
      setCurrentScreen('mode-selection')
    }
  }

  const handleCancel = () => {
    setCurrentScreen('mode-selection')
  }

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        text: currentMessage,
        sender: "플레이어"
      }])
      setCurrentMessage('')
    }
  }

  if (currentScreen === 'main') {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="max-w-md mx-auto bg-slate-800 rounded-3xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 p-6 text-center border-b border-slate-700">
            <h1 className="text-2xl font-bold text-white">Dungeon Talk</h1>
          </div>

          {/* Character Info */}
          <div className="p-6">
            <Card className="mb-6 bg-slate-800 border border-slate-700">
              <CardContent className="p-4 text-center">
                <p className="text-slate-300">베니(이벤트, 공지, 설명 등)</p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-semibold text-white">닉네임:</span> <span className="text-slate-300">베룡</span></p>
                  <p><span className="font-semibold text-white">종족:</span> <span className="text-slate-300">드래곤</span></p>
                </div>
                <div>
                  <p><span className="font-semibold text-white">레벨:</span> <span className="text-slate-300">1(인간의 레벨)</span></p>
                  <p><span className="font-semibold text-white">HP:</span> <span className="text-slate-300">100/100</span></p>
                  <p><span className="font-semibold text-white">MP:</span> <span className="text-slate-300">100/100</span></p>
                </div>
              </div>
              
              <hr className="my-4 border-slate-600" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-semibold text-white">물리 공격력:</span> <span className="text-slate-300">10</span></p>
                  <p><span className="font-semibold text-white">마법 공격력:</span> <span className="text-slate-300">10</span></p>
                </div>
                <div className="text-right">
                  <p><span className="font-semibold text-white">물리 공격력:</span> <span className="text-slate-300">10</span></p>
                  <p><span className="font-semibold text-white">마법 공격력:</span> <span className="text-slate-300">10</span></p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm mt-4">
                <p><span className="font-semibold text-white">힘:</span> <span className="text-slate-300">10</span></p>
                <p><span className="font-semibold text-white">지혜:</span> <span className="text-slate-300">10</span></p>
                <p><span className="font-semibold text-white">의지:</span> <span className="text-slate-300">10</span></p>
                <p><span className="font-semibold text-white">민첩:</span> <span className="text-slate-300">10</span></p>
                <p><span className="font-semibold text-white">지능:</span> <span className="text-slate-300">10</span></p>
                <p><span className="font-semibold text-white">운:</span> <span className="text-slate-300">10</span></p>
              </div>
            </div>

            {/* World Selection */}
            <div className="text-center mb-4">
              <Button 
                variant="outline" 
                className="mb-4 px-6 py-2 rounded-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => {/* 세계종류 버튼 기능 */}}
              >
                세계종류
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-16 rounded-2xl border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => handleWorldSelect('게임 1')}
              >
                게임 1
              </Button>
              <Button
                variant="outline"
                className="h-16 rounded-2xl border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => handleWorldSelect('게임 2')}
              >
                게임 2
              </Button>
              <Button
                variant="outline"
                className="h-16 rounded-2xl border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => handleWorldSelect('게임 3')}
              >
                게임 3
              </Button>
            </div>

            <div className="text-right mt-4">
              <span className="text-sm text-slate-400">더보기 →</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === 'mode-selection') {
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

  if (currentScreen === 'party-finding') {
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

  if (currentScreen === 'single-play') {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="max-w-md mx-auto bg-slate-800 rounded-3xl shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 2rem)' }}>
          {/* Header */}
          <div className="bg-slate-800 p-4 border-b border-slate-700 relative flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-white"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <span className="text-lg font-semibold text-white">플레이 화면</span>
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-slate-400">상급</span>
            </div>
          </div>

          {/* Chat Tabs */}
          <div className="bg-slate-800 px-4 pb-4 flex-shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-10 rounded-lg bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                메인 채팅
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-lg border-slate-600 text-slate-400 hover:bg-slate-700"
              >
                파티 채팅
              </Button>
            </div>
          </div>

          {/* Main Content Area - Chat */}
          <div className="flex-1 px-4 pb-4 overflow-hidden">
            <div className="bg-slate-800 rounded-lg h-full p-4 flex flex-col relative">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-cyan-400 font-semibold text-sm mb-1">플레이어1</div>
                    <div className="text-white text-sm">안녕하세요</div>
                  </div>
                  <div className="text-slate-500 text-xs">14:30</div>
                </div>
              
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-cyan-400 font-semibold text-sm mb-1">플레이어2</div>
                    <div className="text-white text-sm">같이 던전 가실분?</div>
                  </div>
                  <div className="text-slate-500 text-xs">14:31</div>
                </div>

                {chatMessages.map((message) => (
                  <div key={message.id} className="flex justify-between items-start">
                    <div>
                      <div className="text-cyan-400 font-semibold text-sm mb-1">{message.sender}</div>
                      <div className="text-white text-sm">{message.text}</div>
                    </div>
                    <div className="text-slate-500 text-xs">
                      {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            
              {/* Heart buttons on the right */}
              <div className="absolute right-4 top-4 space-y-2">
                <Button
                  size="sm"
                  className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 p-0"
                >
                  <span className="text-white">♥</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-10 h-10 rounded-full border-slate-600 bg-slate-700 hover:bg-slate-600 p-0"
                >
                  <span className="text-slate-400">♥</span>
                </Button>
              </div>
            
              {/* Chat Input */}
              {isChatActive && (
                <div className="flex gap-2 flex-shrink-0">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400"
                    autoFocus
                  />
                  <Button onClick={handleSendMessage} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                    전송
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Interface */}
          <div className="bg-slate-800 p-4 flex justify-between items-center flex-shrink-0">
            <Button
              variant={isChatActive ? "default" : "outline"}
              className={`w-16 h-16 rounded-full flex flex-col items-center justify-center ${
                isChatActive 
                  ? "bg-slate-700 text-white" 
                  : "border-slate-600 bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
              onClick={() => setIsChatActive(!isChatActive)}
            >
              <div className="text-lg mb-1">💬</div>
              <div className="text-xs">채팅</div>
            </Button>
          
            {/* Health/Status bars */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">♥</span>
                <span className="text-white text-sm font-semibold">85/100</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">🛡</span>
                <span className="text-white text-sm font-semibold">42/50</span>
              </div>
            </div>
          
            <Button
              variant="outline"
              className="w-16 h-16 rounded-full flex flex-col items-center justify-center border-slate-600 bg-slate-800 text-slate-400 hover:bg-slate-700"
              onClick={() => {/* 가방 기능 */}}
            >
              <div className="text-lg mb-1">🎒</div>
              <div className="text-xs">가방</div>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === 'multi-play') {
    return <DynamicMobileChat />
  }

  return null
}