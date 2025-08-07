import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

export default function DungeonMainPage() {
  const navigate = useNavigate()
  
  const handleWorldSelect = (worldName: string) => {
    navigate(`/dungeon/mode-selection?world=${encodeURIComponent(worldName)}`)
  }

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