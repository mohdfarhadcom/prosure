'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth, Pro } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'

const ID_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'voter', label: 'Voter ID' },
  { value: 'ration', label: 'Ration Card' },
]

const STEPS = ['info', 'service', 'phone', 'otp', 'idproof'] as const
type Step = typeof STEPS[number]

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setPro } = useAuth()
  const { t } = useI18n()
  const [step, setStep] = useState<Step>('info')
  const [phone, setPhone] = useState(searchParams.get('phone') || '')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [serviceType, setServiceType] = useState<'home_help' | 'home_cook' | ''>('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [pendingPro, setPendingPro] = useState<Pro | null>(null)

  // ID proof state
  const [idType, setIdType] = useState('')
  const [idFile, setIdFile] = useState<File | null>(null)
  const [idPreview, setIdPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const goToPhone = () => {
    setError('')
    if (!name.trim()) { setError('Name is required'); return }
    if (!serviceType) { setError('Select a service type'); return }
    if (serviceType === 'home_help' && gender !== 'female') { setError('Home Help is only available for female professionals'); return }
    setStep('phone')
  }

  const sendOtp = async () => {
    setError('')
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit number'); return }
    setLoading(true)
    const res = await fetch('/api/send-otp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || t.error); return }
    setStep('otp')
    setCountdown(30)
  }

  const verify = async () => {
    setError('')
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return }
    setLoading(true)
    const res = await fetch('/api/verify-otp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: otp, name, service_type: serviceType, gender }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || t.error); return }
    // Store pro data and proceed to ID proof step
    setPendingPro(data.pro as Pro)
    setStep('idproof')
  }

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 10 * 1024 * 1024) { setError('File must be under 10 MB'); return }
    setIdFile(f)
    setIdPreview(URL.createObjectURL(f))
    setError('')
  }

  const uploadIdProof = async () => {
    if (!pendingPro || !idType || !idFile) { setError('Please select document type and upload a file'); return }
    setError('')
    setUploading(true)

    const fd = new FormData()
    fd.append('idType', idType)
    fd.append('file', idFile)

    try {
      const res = await fetch('/api/upload-id-proof', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setUploading(false)
        setError(data?.error || 'Upload failed. Please try again.')
        return
      }
    } catch {
      setUploading(false)
      setError('Network error. Please try again.')
      return
    }

    setUploading(false)
    setPro(pendingPro)
    router.replace('/home')
  }

  const skipIdProof = () => {
    if (!pendingPro) return
    setPro(pendingPro)
    router.replace('/home')
  }

  return (
    <main className="min-h-dvh bg-white flex flex-col max-w-[430px] mx-auto">
      <div className="flex items-center justify-between px-6 pt-10 pb-6">
        <div>
          <span className="gradient-text font-black text-3xl tracking-tighter">zilpo</span>
          <p className="text-xs text-gray-400 mt-0.5">Professional</p>
        </div>
        <div className="flex gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? 'w-6 bg-[#F5A623]' : i < STEPS.indexOf(step) ? 'w-3 bg-[#F5A623]/40' : 'w-3 bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-6">
        {(step === 'info' || step === 'service') && (
          <>
            <h1 className="font-bold text-2xl text-gray-900 mb-1">{t.signup}</h1>
            <p className="text-sm text-gray-400 mb-6">Create your professional account</p>
          </>
        )}

        {step === 'info' && (
          <>
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t.name}</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-[#F5A623] transition-colors"
              />
            </div>
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Gender</label>
              <div className="flex gap-2">
                {['male', 'female', 'other'].map(g => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border capitalize transition-colors ${
                      gender === g ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'border-gray-200 text-gray-700 hover:border-[#F5A623]'
                    }`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <button
              onClick={() => { setError(''); if (!name.trim()) { setError('Name is required'); return } if (!gender) { setError('Select your gender'); return } setStep('service') }}
              className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(245,166,35,0.35)]">
              {t.continue}
            </button>
          </>
        )}

        {step === 'service' && (
          <>
            <h2 className="font-bold text-xl text-gray-900 mb-1">{t.chooseService}</h2>
            <p className="text-sm text-gray-400 mb-6">You can only choose one</p>
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => {
                  if (gender !== 'female') { setError('Home Help is only available for female professionals'); return }
                  setError(''); setServiceType('home_help')
                }}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all ${serviceType === 'home_help' ? 'border-[#F5A623] bg-[#FFF8EC]' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-gray-900">{t.homeHelp}</p>
                      <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">Female only</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{t.homeHelpDesc}</p>
                  </div>
                  {serviceType === 'home_help' && (
                    <div className="w-5 h-5 rounded-full bg-[#F5A623] flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => { setError(''); setServiceType('home_cook') }}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all ${serviceType === 'home_cook' ? 'border-[#F5A623] bg-[#FFF8EC]' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 011.05-1.54 5 5 0 017.08 0A5.11 5.11 0 0116.59 6 4 4 0 0118 13.87V21H6z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900">{t.homeCook}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.homeCookDesc}</p>
                  </div>
                  {serviceType === 'home_cook' && (
                    <div className="w-5 h-5 rounded-full bg-[#F5A623] flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </div>
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <button onClick={goToPhone} disabled={!serviceType}
              className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-40 shadow-[0_4px_20px_rgba(245,166,35,0.35)]">
              {t.continue}
            </button>
            <button onClick={() => setStep('info')} className="w-full mt-3 text-xs text-gray-400 text-center">{t.back}</button>
          </>
        )}

        {step === 'phone' && (
          <>
            <h1 className="font-bold text-2xl text-gray-900 mb-1">Verify your number</h1>
            <p className="text-sm text-gray-400 mb-6">We'll send you a one-time password</p>
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t.phone}</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-[#F5A623] transition-colors">
                <span className="text-sm font-medium text-gray-500">+91</span>
                <div className="w-px h-4 bg-gray-200" />
                <input type="tel" maxLength={10} value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={t.phonePlaceholder}
                  className="flex-1 bg-transparent text-sm outline-none" />
              </div>
            </div>
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <button onClick={sendOtp} disabled={loading}
              className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-50 shadow-[0_4px_20px_rgba(245,166,35,0.35)]">
              {loading ? t.loading : t.sendOtp}
            </button>
            <button onClick={() => setStep('service')} className="w-full mt-3 text-xs text-gray-400 text-center">{t.back}</button>
          </>
        )}

        {step === 'otp' && (
          <>
            <h1 className="font-bold text-2xl text-gray-900 mb-1">Enter OTP</h1>
            <p className="text-sm text-gray-400 mb-6">Sent to +91 {phone}</p>
            <input type="tel" maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder={t.otpPlaceholder}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-[#F5A623] transition-colors tracking-widest text-center text-lg font-bold mb-4"
              autoFocus />
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <button onClick={verify} disabled={loading}
              className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-50 shadow-[0_4px_20px_rgba(245,166,35,0.35)]">
              {loading ? t.loading : t.verifyOtp}
            </button>
            <div className="mt-3 text-center">
              {countdown > 0
                ? <p className="text-xs text-gray-400">{t.resendIn} {countdown}s</p>
                : <button onClick={sendOtp} className="text-xs text-[#F5A623] font-semibold">{t.resendOtp}</button>
              }
            </div>
            <button onClick={() => { setStep('phone'); setOtp(''); setError('') }}
              className="w-full mt-3 text-xs text-gray-400 text-center">
              ← Change number
            </button>
          </>
        )}

        {step === 'idproof' && (
          <>
            <div className="mb-2">
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Account created ✓</span>
            </div>
            <h1 className="font-bold text-2xl text-gray-900 mb-1 mt-3">Verify your identity</h1>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Upload a government-issued ID. This is kept securely and only accessed if legally required (e.g. police inquiry).
            </p>

            <p className="text-xs font-semibold text-gray-500 mb-2">Document type</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {ID_TYPES.map(({ value, label }) => (
                <button key={value} onClick={() => setIdType(value)}
                  className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${
                    idType === value ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'border-gray-200 text-gray-700'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-gray-500 mb-2">Upload photo / scan</p>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={pickFile} className="hidden" />

            {idPreview ? (
              <div className="relative mb-4">
                <img src={idPreview} alt="ID preview" className="w-full h-40 object-cover rounded-2xl border border-gray-200" />
                <button
                  onClick={() => { setIdFile(null); setIdPreview(null) }}
                  className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-gray-500 font-bold text-sm"
                >×</button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-8 flex flex-col items-center gap-2 mb-4 hover:border-[#F5A623] transition-colors"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <p className="text-sm text-gray-400 font-medium">Tap to upload</p>
                <p className="text-xs text-gray-300">JPG, PNG, or PDF · max 10 MB</p>
              </button>
            )}

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-5">
              <p className="text-xs text-blue-700 font-semibold mb-0.5">Your privacy is protected</p>
              <p className="text-[10px] text-blue-600 leading-relaxed">Documents are encrypted and stored privately. Only shared with authorities if legally required. Customers never see this.</p>
            </div>

            <button
              onClick={uploadIdProof}
              disabled={uploading || !idType || !idFile}
              className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-40 shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
            >
              {uploading ? 'Uploading...' : 'Submit & continue'}
            </button>
            <button onClick={skipIdProof} className="w-full mt-3 text-xs text-gray-400 text-center">
              Skip for now (you can add later in profile)
            </button>
          </>
        )}

        <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
          By clicking Send OTP you agree to our{' '}
          <Link href="/terms" className="underline text-gray-500">Terms &amp; Conditions</Link> and{' '}
          <Link href="/privacy" className="underline text-gray-500">Privacy Policy</Link>.
        </p>
        <p className="text-xs text-center text-gray-400 mt-4">
          {t.hasAccount}{' '}
          <Link href="/login" className="text-[#F5A623] font-semibold">{t.login}</Link>
        </p>
      </div>
    </main>
  )
}

export default function SignupPage() {
  return <Suspense><SignupContent /></Suspense>
}
