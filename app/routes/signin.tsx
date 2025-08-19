import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { login as loginApi } from '@/http/authControllerApi'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'

export default function SigninPage() {
  const navigate = useNavigate()
  const LOGIN_FAIL_COUNT_KEY = 'dgt_login_fail_count'
  const LOGIN_LOCK_UNTIL_KEY = 'dgt_login_lock_until'
  const MAX_ATTEMPTS = 5
  const LOCK_DURATION_MS = 10 * 60 * 1000

  const getNumberFromLocalStorage = (key: string): number => {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return 0
      const v = localStorage.getItem(key)
      const n = v ? parseInt(v, 10) : 0
      return Number.isFinite(n) ? n : 0
    } catch { return 0 }
  }

  const setNumberToLocalStorage = (key: string, value: number) => {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
      localStorage.setItem(key, String(value))
    } catch {}
  }

  const clearLoginGuards = () => {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
      localStorage.removeItem(LOGIN_FAIL_COUNT_KEY)
      localStorage.removeItem(LOGIN_LOCK_UNTIL_KEY)
    } catch {}
  }

  const getLockRemainingMs = (): number => {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return 0
      const untilStr = localStorage.getItem(LOGIN_LOCK_UNTIL_KEY)
      const until = untilStr ? parseInt(untilStr, 10) : 0
      const now = Date.now()
      return until && until > now ? until - now : 0
    } catch { return 0 }
  }

  const formatMsToMMSS = (ms: number): string => {
    const totalSec = Math.ceil(ms / 1000)
    const mm = Math.floor(totalSec / 60)
    const ss = totalSec % 60
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
    return `${pad(mm)}:${pad(ss)}`
  }

  // 로그인 상태 및 입력값
  const [loginId, setLoginId] = useState('')
  const [loginPw, setLoginPw] = useState('')
  const canLogin = loginId.trim().length > 0 && loginPw.trim().length > 0

  // 이미 로그인된 경우 던전으로 리다이렉트
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const v = localStorage.getItem('dgt_logged_in')
        if (v === '1') {
          navigate(ROUTES.DUNGEON)
        }
      }
    } catch {}
  }, [navigate])

  const handleLogin = async () => {
    // 잠금 확인
    const remain = getLockRemainingMs()
    if (remain > 0) {
      alert(`로그인 시도가 일시적으로 제한되었습니다. 남은 시간 ${formatMsToMMSS(remain)} 후 다시 시도해주세요.`)
      return
    }
    try {
      await loginApi({ name: loginId, password: loginPw })
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('dgt_logged_in', '1')
        }
      } catch {}
      clearLoginGuards()
      navigate(ROUTES.DUNGEON)
    } catch (e: any) {
      const msg = e?.data?.msg || '로그인에 실패했습니다.'
      // 실패 카운트 증가
      let cnt = getNumberFromLocalStorage(LOGIN_FAIL_COUNT_KEY)
      cnt = cnt + 1
      if (cnt >= MAX_ATTEMPTS) {
        setNumberToLocalStorage(LOGIN_FAIL_COUNT_KEY, MAX_ATTEMPTS)
        setNumberToLocalStorage(LOGIN_LOCK_UNTIL_KEY, Date.now() + LOCK_DURATION_MS)
        alert(`${msg}\n실패 ${MAX_ATTEMPTS}/${MAX_ATTEMPTS}. 10분 후 다시 시도해주세요.`)
      } else {
        setNumberToLocalStorage(LOGIN_FAIL_COUNT_KEY, cnt)
        alert(`${msg} (${cnt}/${MAX_ATTEMPTS})`)
      }
    }
  }

  return (
    <div className="p-5">
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="w-full h-20 sm:h-24 md:h-28 overflow-hidden flex items-center justify-center mb-6">
          <img
            src="/dungeontalk-open.svg"
            alt="던전톡 오픈!"
            className="max-w-full h-full object-contain object-center"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement
              if (!img.dataset.fallback) {
                img.dataset.fallback = '1'
                img.src = '/placeholder-logo.png'
              }
            }}
          />
        </div>
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div>
                <div className="text-slate-300 text-sm mb-1">아이디</div>
                <Input value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="아이디를 입력하세요" className="bg-black/20 border-white/10 text-white h-9" onKeyDown={e => { if (e.key === 'Enter' && canLogin) handleLogin() }} />
              </div>
              <div>
                <div className="text-slate-300 text-sm mb-1">비밀번호</div>
                <Input type="password" value={loginPw} onChange={e => setLoginPw(e.target.value)} placeholder="비밀번호를 입력하세요" className="bg-black/20 border-white/10 text-white h-9" onKeyDown={e => { if (e.key === 'Enter' && canLogin) handleLogin() }} />
              </div>
              <Button className="w-full h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleLogin} disabled={!canLogin}>로그인</Button>
              <div className="text-center text-xs text-slate-400">아이디와 비밀번호를 입력하세요.</div>
              <div className="text-center text-xs text-slate-300 pt-1">
                회원이 아니신가요? <Link to={ROUTES.SIGNUP} className="text-blue-400 hover:underline">회원가입</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}