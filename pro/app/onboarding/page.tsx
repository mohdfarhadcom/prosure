'use client'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/context/I18nContext'
import type { Lang } from '@/context/I18nContext'

const LANG_OPTIONS: { code: Lang; native: string; sub: string }[] = [
  { code: 'en', native: 'English', sub: 'English' },
  { code: 'hi', native: 'हिंदी', sub: 'Hindi' },
  { code: 'ur', native: 'اردو', sub: 'Urdu' },
  { code: 'mr', native: 'मराठी', sub: 'Marathi' },
  { code: 'kn', native: 'ಕನ್ನಡ', sub: 'Kannada' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { setLang } = useI18n()

  const handleLanguage = (l: Lang) => {
    setLang(l)
    try { localStorage.setItem('zilpo_pro_onboarded', '1') } catch {}
    router.replace('/login')
  }

  return (
    <main className="min-h-dvh bg-white max-w-[430px] mx-auto flex flex-col px-6 py-10">
      <div className="text-center mb-8">
        <span className="gradient-text font-black text-4xl tracking-tighter">zilpo</span>
        <p className="text-sm text-gray-400 mt-1">Professional</p>
      </div>

      <div className="text-center mb-6">
        <p className="text-base font-bold text-gray-900">Select your language</p>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          अपनी भाषा चुनें · اپنی زبان منتخب کریں<br />
          तुमची भाषा निवडा · ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ
        </p>
      </div>

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
