'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ConfirmationResult, RecaptchaVerifier as RV } from 'firebase/auth'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import type { Lang } from '@/context/I18nContext'

function LoginContent() {
  const router = useRouter()
  const { setPro } = useAuth()
  const { t, lang, setLang, langLabels } = useI18n()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [showLang, setShowLang] = useState(false)
  const recaptchaRef = useRef<RV | null>(null)
  const confirmationRef = useRef<ConfirmationResult | null>(null)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Set up invisible reCAPTCHA once on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { firebaseAuth, firebaseConfigured } = await import('@/lib/firebase')
      if (!firebaseConfigured || !firebaseAuth || !mounted) return
      const { RecaptchaVerifier } = await import('firebase/auth')
      recaptchaRef.current = new RecaptchaVerifier(firebaseAuth, 'recaptcha-login', {
        size: 'invisible',
      })
    })()
    return () => { mounted = false }
  }, [])

  const sendOtp = async () => {
    setError('')
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit number'); return }
    setLoading(true)

    // Check account exists first — no point spending an OTP on unknown numbers
    const check = await fetch('/api/check-pro', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    if (!check.ok) {
      setError(check.status === 404 ? 'No account found. Please sign up first.' : t.error)
      setLoading(false)
      return
    }

    try {
      const { firebaseAuth, firebaseConfigured } = await import('@/lib/firebase')
      if (!firebaseConfigured || !firebaseAuth) throw new Error('Auth not configured')
      const { signInWithPhoneNumber } = await import('firebase/auth')

      // Reset verifier if it was used before
      if (!recaptchaRef.current) {
        const { RecaptchaVerifier } = await import('firebase/auth')
        recaptchaRef.current = new RecaptchaVerifier(firebaseAuth, 'recaptcha-login', { size: 'invisible' })
      }

      const result = await signInWithPhoneNumber(firebaseAuth, `+91${phone}`, recaptchaRef.current)
      confirmationRef.current = result
      setStep('otp')
      setCountdown(30)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.error
      setError(msg)
      recaptchaRef.current = null  // force fresh verifier next attempt
    }
    setLoading(false)
  }

  const verify = async () => {
    setError('')
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return }
    if (!confirmationRef.current) { setError('Please request OTP again'); return }
    setLoading(true)
    try {
      const result = await confirmationRef.current.confirm(otp)
      const idToken = await result.user.getIdToken()
      const res = await fetch('/api/verify-firebase', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, phone }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || t.error); setLoading(false); return }
      setPro(data.pro)
      router.replace('/home')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.error)
    }
    setLoading(false)
  }

  const resend = async () => {
    recaptchaRef.current = null
    setOtp('')
    setStep('phone')
    await sendOtp()
  }

  return (
    <main className="min-h-dvh bg-white flex flex-col max-w-[430px] mx-auto">
      {/* invisible reCAPTCHA mount point */}
      <div id="recaptcha-login" />

      {/* Header */}
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

        <p className="text-xs text-center text-gray-400 mt-8">
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
