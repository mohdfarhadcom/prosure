'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import type { Lang } from '@/context/I18nContext'

type VideoSlide = {
  key: keyof ReturnType<typeof useI18n>['t']
  descKey: keyof ReturnType<typeof useI18n>['t']
  icon: React.ReactNode
  color: string
}

const VIDEOS: VideoSlide[] = [
  {
    key: 'video1Title', descKey: 'video1Desc', color: '#1a1a2e',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    key: 'video2Title', descKey: 'video2Desc', color: '#0f3460',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg>,
  },
  {
    key: 'video3Title', descKey: 'video3Desc', color: '#16213e',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    key: 'video4Title', descKey: 'video4Desc', color: '#1b1b2f',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    key: 'video5Title', descKey: 'video5Desc', color: '#162032',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
]

function VideoSlides({ onDone }: { onDone: () => void }) {
  const { t } = useI18n()
  const [idx, setIdx] = useState(0)
  const isLast = idx === VIDEOS.length - 1
  const video = VIDEOS[idx]
  const titleKey = video.key as keyof typeof t
  const descKey = video.descKey as keyof typeof t

  return (
    <main className="min-h-dvh bg-white max-w-[430px] mx-auto flex flex-col">
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex gap-1.5">
          {VIDEOS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-[#F5A623]' : i < idx ? 'w-3 bg-[#F5A623]/40' : 'w-3 bg-gray-200'}`} />
          ))}
        </div>
        <button onClick={onDone} className="text-xs text-gray-400 font-semibold px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
          {t.skip} →
        </button>
      </div>

      <div className="mx-6 rounded-2xl overflow-hidden shadow-xl" style={{ background: video.color, aspectRatio: '16/9' }}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
            {video.icon}
          </div>
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center cursor-default">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1">
            <p className="text-white/80 text-[10px] font-semibold">{t.comingSoon}</p>
          </div>
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1">
            <p className="text-white/80 text-[10px] font-semibold">{idx + 1} / {VIDEOS.length}</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 flex-1">
        <h2 className="font-bold text-xl text-gray-900 leading-tight mb-2">{String(t[titleKey])}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{String(t[descKey])}</p>
      </div>

      <div className="px-6 pb-10 mt-6">
        <button
          onClick={() => { if (isLast) onDone(); else setIdx(i => i + 1) }}
          className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
        >
          {isLast ? t.getStarted : `${t.continue} →`}
        </button>
        {idx > 0 && (
          <button onClick={() => setIdx(i => i - 1)} className="w-full mt-3 text-xs text-gray-400 text-center">
            ← {t.back}
          </button>
        )}
      </div>
    </main>
  )
}

function LoginContent() {
  const router = useRouter()
  const { setPro } = useAuth()
  const { t, lang, setLang, langLabels } = useI18n()
  const [step, setStep] = useState<'phone' | 'otp' | 'videos'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [showLang, setShowLang] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const sendOtp = async () => {
    setError('')
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit number'); return }
    setLoading(true)
    const res = await fetch('/api/send-otp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, loginOnly: true }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(res.status === 404 ? 'No account found. Please sign up first.' : data.error || t.error)
      setLoading(false)
      return
    }
    setStep('otp')
    setCountdown(30)
    setLoading(false)
  }

  const verify = async () => {
    setError('')
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return }
    setLoading(true)
    const res = await fetch('/api/verify-otp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: otp }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || t.error); setLoading(false); return }
    setPro(data.pro)

    // Show videos on first login
    let seen = false
    try { seen = !!localStorage.getItem('zilpo_pro_videos_seen') } catch {}
    if (!seen) {
      setStep('videos')
    } else {
      router.replace('/home')
    }
  }

  const finishVideos = () => {
    try { localStorage.setItem('zilpo_pro_videos_seen', '1') } catch {}
    router.replace('/home')
  }

  const resend = async () => {
    setOtp('')
    setStep('phone')
    await sendOtp()
  }

  if (step === 'videos') {
    return <VideoSlides onDone={finishVideos} />
  }

  return (
    <main className="min-h-dvh bg-white flex flex-col max-w-[430px] mx-auto">
      <div className="flex items-center justify-between px-6 pt-10 pb-6">
        <div>
          <span className="gradient-text font-black text-3xl tracking-tighter">zilpo</span>
          <p className="text-xs text-gray-400 mt-0.5">Professional</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowLang(v => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl px-3 py-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>
            {langLabels[lang]}
          </button>
          {showLang && (
            <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden w-36">
              {(Object.keys(langLabels) as Lang[]).map(l => (
                <button key={l} onClick={() => { setLang(l); setShowLang(false) }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0 ${lang === l ? 'font-bold text-[#F5A623]' : 'text-gray-700'}`}>
                  {langLabels[l]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-6">
        <h1 className="font-bold text-2xl text-gray-900 mb-1">{t.login}</h1>
        <p className="text-sm text-gray-400 mb-8">Welcome back, professional</p>

        {step === 'phone' ? (
          <>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t.phone}</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-[#F5A623] transition-colors mb-4">
              <span className="text-sm font-medium text-gray-500">+91</span>
              <div className="w-px h-4 bg-gray-200" />
              <input type="tel" maxLength={10} value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder={t.phonePlaceholder}
                className="flex-1 bg-transparent text-sm outline-none" />
            </div>
            {error && (
              <div className="mb-4 bg-red-50 rounded-xl px-4 py-3">
                <p className="text-xs text-red-600">{error}</p>
                {error.includes('sign up') && (
                  <Link href="/signup" className="text-xs text-[#F5A623] font-bold mt-1 block">{t.signup} →</Link>
                )}
              </div>
            )}
            <button onClick={sendOtp} disabled={loading}
              className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-50 shadow-[0_4px_20px_rgba(245,166,35,0.35)]">
              {loading ? t.loading : t.sendOtp}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">OTP sent to +91 {phone}</p>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">OTP</label>
            <input type="tel" maxLength={6} value={otp} autoFocus
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder={t.otpPlaceholder}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-[#F5A623] transition-colors tracking-widest text-center text-lg font-bold mb-4" />
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <button onClick={verify} disabled={loading}
              className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-50 shadow-[0_4px_20px_rgba(245,166,35,0.35)]">
              {loading ? t.loading : t.verifyOtp}
            </button>
            <div className="mt-3 text-center">
              {countdown > 0
                ? <p className="text-xs text-gray-400">{t.resendIn} {countdown}s</p>
                : <button onClick={resend} className="text-xs text-[#F5A623] font-semibold">{t.resendOtp}</button>
              }
            </div>
            <button onClick={() => { setStep('phone'); setOtp(''); setError('') }}
              className="w-full mt-3 text-xs text-gray-400 text-center">
              ← Change number
            </button>
          </>
        )}

        <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
          By clicking Send OTP you agree to our{' '}
          <Link href="/terms" className="underline text-gray-500">Terms &amp; Conditions</Link> and{' '}
          <Link href="/privacy" className="underline text-gray-500">Privacy Policy</Link>.
        </p>
        <p className="text-xs text-center text-gray-400 mt-4">
          {t.noAccount}{' '}
          <Link href="/signup" className="text-[#F5A623] font-semibold">{t.signup}</Link>
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return <Suspense><LoginContent /></Suspense>
}
