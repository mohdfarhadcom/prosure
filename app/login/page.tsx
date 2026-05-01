'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ConfirmationResult, RecaptchaVerifier as RV } from 'firebase/auth'
import { useAuth } from '@/context/AuthContext'

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/'
  const { setUser } = useAuth()

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const recaptchaRef = useRef<RV | null>(null)
  const confirmationRef = useRef<ConfirmationResult | null>(null)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

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
    if (phone.replace(/\D/g, '').length < 10) { setError('Enter a valid 10-digit number'); return }
    setError('')
    setLoading(true)
    try {
      const { firebaseAuth, firebaseConfigured } = await import('@/lib/firebase')
      if (!firebaseConfigured || !firebaseAuth) throw new Error('Auth not configured')
      const { signInWithPhoneNumber } = await import('firebase/auth')

      if (!recaptchaRef.current) {
        const { RecaptchaVerifier } = await import('firebase/auth')
        recaptchaRef.current = new RecaptchaVerifier(firebaseAuth, 'recaptcha-login', { size: 'invisible' })
      }

      const result = await signInWithPhoneNumber(firebaseAuth, `+91${phone}`, recaptchaRef.current)
      confirmationRef.current = result
      setStep('otp')
      setCountdown(30)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send OTP')
      recaptchaRef.current = null
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (otp.length !== 6) { setError('Enter 6-digit OTP'); return }
    if (!confirmationRef.current) { setError('Please request OTP again'); return }
    setError('')
    setLoading(true)
    try {
      const result = await confirmationRef.current.confirm(otp)
      const idToken = await result.user.getIdToken()
      const res = await fetch('/api/verify-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed')
      setUser(data.user)
      router.push(redirect)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    recaptchaRef.current = null
    setOtp('')
    await sendOtp()
  }

  return (
    <main className="page px-4 py-8">
      {/* invisible reCAPTCHA mount point */}
      <div id="recaptcha-login" />

      <div className="text-2xl font-extrabold text-[#F5A623] mb-8">Zilpo</div>

      {step === 'phone' ? (
        <>
          <h1 className="font-bold text-2xl mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-8">We will send a 6-digit code.</p>

          <label className="block text-sm font-medium mb-2">Mobile number</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden mb-4 focus-within:border-[#F5A623]">
            <span className="px-3 py-4 text-sm text-gray-500 bg-gray-50 border-r border-gray-200">+91</span>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="98100 40589"
              className="flex-1 px-4 py-4 text-sm outline-none"
              maxLength={10}
              inputMode="numeric"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-[#F5A623] text-white font-semibold py-4 rounded-2xl disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Get OTP'}
          </button>
        </>
      ) : (
        <>
          <h1 className="font-bold text-2xl mb-1">Enter OTP</h1>
          <p className="text-sm text-gray-500 mb-8">Sent to +91 {phone}</p>

          <label className="block text-sm font-medium mb-2">6-digit code</label>
          <input
            type="tel"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="------"
            className="w-full border border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-widest outline-none focus:border-[#F5A623] mb-4"
            maxLength={6}
            inputMode="numeric"
            autoFocus
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-[#F5A623] text-white font-semibold py-4 rounded-2xl mb-3 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            onClick={() => { setStep('phone'); setOtp(''); setError('') }}
            className="w-full text-gray-500 text-sm py-2"
          >
            Change number
          </button>

          {countdown > 0
            ? <p className="text-center text-xs text-gray-400 mt-1">Resend in {countdown}s</p>
            : <button onClick={resend} disabled={loading} className="w-full text-[#F5A623] text-sm font-semibold py-2">Resend OTP</button>
          }
        </>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        By continuing you agree to our{' '}
        <a href="/terms" className="underline">Terms</a> and{' '}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="page px-4 py-8 text-gray-400 text-sm">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
