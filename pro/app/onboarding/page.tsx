'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/context/I18nContext'
import type { Lang } from '@/context/I18nContext'

// Show each language entirely in its own script so anyone can identify it
const LANG_OPTIONS: { code: Lang; native: string; sub: string }[] = [
  { code: 'en', native: 'English', sub: 'English' },
  { code: 'hi', native: 'हिंदी', sub: 'Hindi' },
  { code: 'ur', native: 'اردو', sub: 'Urdu' },
  { code: 'mr', native: 'मराठी', sub: 'Marathi' },
  { code: 'kn', native: 'ಕನ್ನಡ', sub: 'Kannada' },
]

type VideoSlide = {
  key: keyof ReturnType<typeof useI18n>['t']
  descKey: keyof ReturnType<typeof useI18n>['t']
  icon: React.ReactNode
  color: string
}

const VIDEOS: VideoSlide[] = [
  {
    key: 'video1Title', descKey: 'video1Desc',
    color: '#1a1a2e',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    key: 'video2Title', descKey: 'video2Desc',
    color: '#0f3460',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    key: 'video3Title', descKey: 'video3Desc',
    color: '#16213e',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    key: 'video4Title', descKey: 'video4Desc',
    color: '#1b1b2f',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    key: 'video5Title', descKey: 'video5Desc',
    color: '#162032',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { t, lang, setLang } = useI18n()
  const [step, setStep] = useState<'language' | 'videos'>('language')
  const [videoIdx, setVideoIdx] = useState(0)

  const handleLanguage = (l: Lang) => {
    setLang(l)
    setStep('videos')
  }

  const markDone = () => {
    try { localStorage.setItem('zilpo_pro_onboarded', '1') } catch {}
    router.replace('/login')
  }

  const next = () => {
    if (videoIdx < VIDEOS.length - 1) setVideoIdx(v => v + 1)
    else markDone()
  }

  const isLast = videoIdx === VIDEOS.length - 1

  // ── Language selection ─────────────────────────────────────────────────────
  if (step === 'language') {
    return (
      <main className="min-h-dvh bg-white max-w-[430px] mx-auto flex flex-col px-6 py-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="gradient-text font-black text-4xl tracking-tighter">zilpo</span>
          <p className="text-sm text-gray-400 mt-1">Professional</p>
        </div>

        {/* Multi-language hint — shows all 5 so anyone can recognise their language */}
        <div className="text-center mb-6">
          <p className="text-base font-bold text-gray-900">Select your language</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            अपनी भाषा चुनें · اپنی زبان منتخب کریں<br />
            तुमची भाषा निवडा · ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ
          </p>
        </div>

        {/* Language buttons */}
        <div className="flex flex-col gap-3">
          {LANG_OPTIONS.map(opt => (
            <button
              key={opt.code}
              onClick={() => handleLanguage(opt.code)}
              className="w-full flex items-center justify-between bg-gray-50 hover:bg-[#FFF8EC] border-2 border-transparent hover:border-[#F5A623] rounded-2xl px-5 py-4 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5A623] to-[#FF6B35] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-black text-sm">{opt.code.toUpperCase()}</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg text-gray-900 leading-tight">{opt.native}</p>
                  <p className="text-xs text-gray-400">{opt.sub}</p>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </div>
      </main>
    )
  }

  // ── Video slides ──────────────────────────────────────────────────────────
  const video = VIDEOS[videoIdx]
  const titleKey = video.key as keyof typeof t
  const descKey = video.descKey as keyof typeof t

  return (
    <main className="min-h-dvh bg-white max-w-[430px] mx-auto flex flex-col">
      {/* Progress dots + skip */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex gap-1.5">
          {VIDEOS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === videoIdx ? 'w-6 bg-[#F5A623]' : i < videoIdx ? 'w-3 bg-[#F5A623]/40' : 'w-3 bg-gray-200'}`}
            />
          ))}
        </div>
        <button onClick={markDone} className="text-xs text-gray-400 font-semibold px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
          {t.skip} →
        </button>
      </div>

      {/* Video placeholder */}
      <div className="mx-6 rounded-2xl overflow-hidden shadow-xl" style={{ background: video.color, aspectRatio: '16/9' }}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
            {video.icon}
          </div>

          {/* Play button */}
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center cursor-default">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>

          {/* Coming soon badge */}
          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1">
            <p className="text-white/80 text-[10px] font-semibold">{t.comingSoon}</p>
          </div>

          {/* Video number */}
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1">
            <p className="text-white/80 text-[10px] font-semibold">{videoIdx + 1} / {VIDEOS.length}</p>
          </div>
        </div>
      </div>

      {/* Title + description */}
      <div className="px-6 mt-6 flex-1">
        <h2 className="font-bold text-xl text-gray-900 leading-tight mb-2">
          {String(t[titleKey])}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          {String(t[descKey])}
        </p>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-10 mt-6">
        <button
          onClick={next}
          className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
        >
          {isLast ? t.getStarted : `${t.continue} →`}
        </button>
        {videoIdx > 0 && (
          <button
            onClick={() => setVideoIdx(v => v - 1)}
            className="w-full mt-3 text-xs text-gray-400 text-center"
          >
            ← {t.back}
          </button>
        )}
      </div>
    </main>
  )
}
