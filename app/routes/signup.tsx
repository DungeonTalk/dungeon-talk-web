import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { register as registerApi } from '@/http/memberControllerApi'
import { login as loginApi } from '@/http/authControllerApi'
import { ROUTES } from '@/constants/routes'

export default function SignupPage() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [race, setRace] = useState('human')
  const races = [
    { value: 'human', label: '인간' },
    { value: 'elf', label: '엘프' },
    { value: 'dwarf', label: '드워프' },
  ]
  const raceDescriptions: Record<string, string> = {
    human:
      '인간은 평균적인 능력치를 지니고 있으며 새로운 환경에 빠르게 적응하는 종족입니다. 전투, 탐험, 사회적 상호작용 등 어떤 역할에도 무난하게 참여할 수 있어 파티의 빈자리를 유연하게 메우기 좋습니다. 초심자에게 특히 추천되는 안정적인 선택입니다.',
    elf:
      '엘프는 신체 능력은 비교적 약하지만 마법적 재능과 감각이 매우 뛰어난 종족입니다. 원거리 전투와 정교한 주문 운용에 강점을 보이며, 자연과의 교감 능력이 높아 정찰과 지원 역할에서 빛을 발합니다. 숙련된 운용 시 높은 기술 난이도에 비례하는 보상을 제공합니다.',
    dwarf:
      '드워프는 마법적 재능은 낮지만 단단한 체력과 강한 의지를 갖춘 종족입니다. 근접 전투와 방어, 장비 제작과 같은 실용 영역에서 탁월한 능력을 발휘합니다. 꾸준함과 끈기를 바탕으로 난관을 정면 돌파하는 플레이 스타일에 적합한 선택입니다.',
  }

  const isValidUserId = /^[A-Za-z0-9가-힣]{1,20}$/.test(userId)
  const isValidNickname = nickname.trim().length > 0 && nickname.trim().length <= 6
  const canSubmit = isValidUserId && password && password2 && isValidNickname && password === password2 && race

  const handleSubmit = async () => {
    setError('')
    if (!isValidUserId) {
      setError('아이디는 영문/숫자/한글만 가능하며 최대 20자입니다.')
      return
    }
    if (!isValidNickname) {
      setError('닉네임은 1~6글자여야 합니다.')
      return
    }
    if (!password || !password2) {
      setError('비밀번호를 입력해주세요.')
      return
    }
    if (password !== password2) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      await registerApi({ name: userId, nickName: nickname, password })
      await loginApi({ name: userId, password })
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('dgt_logged_in', '1')
        }
      } catch {}
      navigate(ROUTES.DUNGEON)
    } catch (e: any) {
      const msg = e?.data?.msg || '회원가입에 실패했습니다.'
      setError(msg)
    }
  }

  return (
    <div className="p-5">
      <div className="space-y-4 max-w-sm mx-auto">
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div>
                <div className="text-slate-300 text-sm mb-1">아이디</div>
                <Input
                  value={userId}
                  maxLength={20}
                  onChange={e => {
                    const alnum = e.target.value.replace(/[^A-Za-z0-9가-힣]/g, '').slice(0, 20)
                    setUserId(alnum)
                  }}
                  placeholder="영문/숫자/한글, 최대 20자"
                  className="bg-black/20 border-white/10 text-white h-9"
                />
                {!isValidUserId && userId.length > 0 && (
                  <div className="mt-1 text-[11px] text-red-400">아이디는 영문/숫자/한글만 가능하며 최대 20자입니다.</div>
                )}
              </div>
              <div>
                <div className="text-slate-300 text-sm mb-1">비밀번호</div>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" className="bg-black/20 border-white/10 text-white h-9" />
              </div>
              <div>
                <div className="text-slate-300 text-sm mb-1">비밀번호 확인</div>
                <Input type="password" value={password2} onChange={e => setPassword2(e.target.value)} placeholder="비밀번호를 다시 입력하세요" className="bg-black/20 border-white/10 text-white h-9" />
              </div>
              <div>
                <div className="text-slate-300 text-sm mb-1">닉네임</div>
                <Input
                  value={nickname}
                  maxLength={6}
                  onChange={e => setNickname(e.target.value.slice(0, 6))}
                  placeholder="최대 6글자"
                  className="bg-black/20 border-white/10 text-white h-9"
                />
                {!isValidNickname && nickname.length > 0 && (
                  <div className="mt-1 text-[11px] text-red-400">닉네임은 1~6글자여야 합니다.</div>
                )}
              </div>
              <div>
                <div className="text-slate-300 text-sm mb-1">종족 선택</div>
                <div className="flex gap-2 flex-nowrap overflow-x-auto">
                  {races.map(r => (
                    <label key={r.value} className={`flex items-center gap-2 rounded-md border px-3 h-10 w-28 flex-shrink-0 cursor-pointer select-none ${race === r.value ? 'border-blue-400 bg-blue-500/10 text-white' : 'border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                      <input
                        type="radio"
                        name="race"
                        className="accent-blue-500"
                        checked={race === r.value}
                        onChange={() => setRace(r.value)}
                      />
                      <span className="text-sm">{r.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-2 text-xs text-slate-300">
                  {raceDescriptions[race]}
                </div>
              </div>
              {error && <div className="text-xs text-red-400">{error}</div>}
              <Button className="w-full h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={!canSubmit}>회원가입</Button>
              <div className="text-center text-xs text-slate-300 pt-1">
                이미 계정이 있으신가요? <Link to={ROUTES.SIGNIN} className="text-blue-400 hover:underline">로그인</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}