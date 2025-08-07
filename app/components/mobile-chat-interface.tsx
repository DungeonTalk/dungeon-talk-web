import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Progress } from './ui/progress'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ArrowLeft, Send, Heart, ShoppingBag, Settings, Users, Sword, Shield, Zap, Volume2, VolumeX, MoreVertical, UserPlus, Crown, Mic, MicOff } from 'lucide-react'

interface PartyMember {
  id: string
  name: string
  level: number
  class: string
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  isLeader: boolean
  isOnline: boolean
  avatar?: string
}

interface ChatMessage {
  id: number
  text: string
  sender: string
  color: string
  timestamp: Date
  type: 'message' | 'system' | 'action'
}

export default function MobileChatInterface() {
  const [isChatActive, setIsChatActive] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [activeTab, setActiveTab] = useState('party-chat')
  const [isMicOn, setIsMicOn] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  
  const [partyMembers] = useState<PartyMember[]>([
    {
      id: '1',
      name: '파티장',
      level: 25,
      class: '전사',
      hp: 850,
      maxHp: 1000,
      mp: 200,
      maxMp: 300,
      isLeader: true,
      isOnline: true,
      avatar: '/armored-warrior.png'
    },
    {
      id: '2',
      name: '마법사',
      level: 23,
      class: '마법사',
      hp: 450,
      maxHp: 600,
      mp: 800,
      maxMp: 900,
      isLeader: false,
      isOnline: true,
      avatar: '/powerful-mage.png'
    },
    {
      id: '3',
      name: '힐러',
      level: 24,
      class: '성직자',
      hp: 600,
      maxHp: 700,
      mp: 650,
      maxMp: 800,
      isLeader: false,
      isOnline: false,
      avatar: '/priest.png'
    }
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      id: 1, 
      text: "파티가 구성되었습니다!", 
      sender: "시스템", 
      color: "text-yellow-400",
      timestamp: new Date(),
      type: 'system'
    },
    { 
      id: 2, 
      text: "던전 탐험을 시작해볼까요?", 
      sender: "파티장", 
      color: "text-green-400",
      timestamp: new Date(),
      type: 'message'
    },
    { 
      id: 3, 
      text: "좋습니다! 준비됐어요", 
      sender: "마법사", 
      color: "text-blue-400",
      timestamp: new Date(),
      type: 'message'
    },
    { 
      id: 4, 
      text: "함께 가시죠!", 
      sender: "힐러", 
      color: "text-purple-400",
      timestamp: new Date(),
      type: 'message'
    }
  ])

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        text: currentMessage,
        sender: "나",
        color: "text-cyan-400",
        timestamp: new Date(),
        type: 'message'
      }])
      setCurrentMessage('')
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="max-w-md mx-auto bg-slate-800 rounded-3xl shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 2rem)' }}>
          {/* Header */}
          <div className="bg-slate-800 p-4 border-b border-slate-700 relative flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-white"
              onClick={() => {
                const searchParams = new URLSearchParams(window.location.search);
                const world = searchParams.get('world') || '';
                window.location.href = `/dungeon/mode-selection?world=${encodeURIComponent(world)}`;
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <span className="text-lg font-semibold text-white">멀티플레이</span>
              <Badge variant="secondary" className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white">
                파티 3/3
              </Badge>
            </div>

            {/* Voice Controls */}
            <div className="absolute right-16 top-1/2 transform -translate-y-1/2 flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={isMicOn ? "text-green-400" : "text-slate-400"}
                  >
                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isMicOn ? '마이크 끄기' : '마이크 켜기'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSoundOn(!isSoundOn)}
                    className={isSoundOn ? "text-blue-400" : "text-slate-400"}
                  >
                    {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSoundOn ? '소리 끄기' : '소리 켜기'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Main Content with Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-b border-slate-700">
                <TabsTrigger value="party-chat" className="text-xs">파티 채팅</TabsTrigger>
                <TabsTrigger value="party-info" className="text-xs">파티 정보</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">설정</TabsTrigger>
              </TabsList>

              {/* Party Chat Tab */}
              <TabsContent value="party-chat" className="flex-1 flex flex-col mt-0">
                <div className="flex-1 px-4 pb-4 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-4 p-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`${message.color} font-semibold text-sm`}>
                                {message.sender}
                              </span>
                              {message.sender === '파티장' && (
                                <Crown className="h-3 w-3 text-yellow-400" />
                              )}
                              {message.type === 'system' && (
                                <Badge variant="outline" className="text-xs">시스템</Badge>
                              )}
                            </div>
                            <div className="text-white text-sm">{message.text}</div>
                          </div>
                          <div className="text-slate-500 text-xs ml-2">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Chat Input */}
                {isChatActive && (
                  <div className="p-4 border-t border-slate-700">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="파티 채팅을 입력하세요..."
                        className="flex-1 bg-slate-700 border-slate-600 focus:ring-cyan-500 text-white placeholder-slate-400"
                        autoFocus
                      />
                      <Button onClick={handleSendMessage} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Party Info Tab */}
              <TabsContent value="party-info" className="flex-1 mt-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">파티 정보</h3>
                      <Badge variant="outline" className="bg-slate-700 text-slate-300">
                        던전: 어둠의 동굴 (상급)
                      </Badge>
                    </div>

                    {partyMembers.map((member) => (
                      <Card key={member.id} className="bg-slate-700 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-slate-600 text-white">
                                {member.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{member.name}</span>
                                {member.isLeader && <Crown className="h-4 w-4 text-yellow-400" />}
                                <Badge 
                                  variant={member.isOnline ? "default" : "secondary"}
                                  className={member.isOnline ? "bg-green-600" : "bg-slate-500"}
                                >
                                  {member.isOnline ? "온라인" : "오프라인"}
                                </Badge>
                              </div>
                              <div className="text-sm text-slate-300">
                                Lv.{member.level} {member.class}
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>프로필 보기</DropdownMenuItem>
                                <DropdownMenuItem>귓속말</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-400">
                                  파티에서 추방
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* HP/MP Bars */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              <div className="flex-1">
                                <div className="flex justify-between text-xs text-slate-300 mb-1">
                                  <span>HP</span>
                                  <span>{member.hp}/{member.maxHp}</span>
                                </div>
                                <Progress 
                                  value={(member.hp / member.maxHp) * 100} 
                                  className="h-2 bg-slate-600"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-blue-500" />
                              <div className="flex-1">
                                <div className="flex justify-between text-xs text-slate-300 mb-1">
                                  <span>MP</span>
                                  <span>{member.mp}/{member.maxMp}</span>
                                </div>
                                <Progress 
                                  value={(member.mp / member.maxMp) * 100} 
                                  className="h-2 bg-slate-600"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      <UserPlus className="h-4 w-4 mr-2" />
                      새 파티원 초대
                    </Button>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="flex-1 mt-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <Card className="bg-slate-700 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">게임 설정</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">자동 전투</span>
                          <Button variant="outline" size="sm">설정</Button>
                        </div>
                        <Separator className="bg-slate-600" />
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">알림 설정</span>
                          <Button variant="outline" size="sm">설정</Button>
                        </div>
                        <Separator className="bg-slate-600" />
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">키 설정</span>
                          <Button variant="outline" size="sm">설정</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">파티 설정</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">아이템 분배</span>
                          <Badge variant="outline">순서대로</Badge>
                        </div>
                        <Separator className="bg-slate-600" />
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">경험치 분배</span>
                          <Badge variant="outline">균등 분배</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Bottom Interface */}
          <div className="bg-slate-800 p-4 flex justify-between items-center flex-shrink-0 border-t border-slate-700">
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
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-white text-sm font-semibold">850/1000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-white text-sm font-semibold">200/300</span>
              </div>
            </div>

            {/* Inventory Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-16 h-16 rounded-full flex flex-col items-center justify-center border-slate-600 bg-slate-800 text-slate-400 hover:bg-slate-700"
                >
                  <ShoppingBag className="h-5 w-5 mb-1" />
                  <div className="text-xs">가방</div>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-slate-800 border-slate-700">
                <SheetHeader>
                  <SheetTitle className="text-white">인벤토리</SheetTitle>
                  <SheetDescription className="text-slate-300">
                    아이템을 관리하세요
                  </SheetDescription>
                </SheetHeader>
                <div className="grid grid-cols-6 gap-2 mt-4">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center"
                    >
                      {i < 3 && (
                        <div className="text-2xl">
                          {i === 0 ? '⚔️' : i === 1 ? '🛡️' : '🧪'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}