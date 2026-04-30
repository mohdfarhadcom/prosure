'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en, { Translations } from '@/lib/i18n/en'

export type Lang = 'en' | 'hi' | 'ur' | 'mr' | 'kn'

const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  hi: 'हिंदी',
  ur: 'اردو',
  mr: 'मराठी',
  kn: 'ಕನ್ನಡ',
}

type I18nCtx = {
  t: Translations
  lang: Lang
  setLang: (l: Lang) => void
  langLabels: typeof LANG_LABELS
}

const Ctx = createContext<I18nCtx>({ t: en, lang: 'en', setLang: () => {}, langLabels: LANG_LABELS })

async function loadTranslations(lang: Lang): Promise<Translations> {
  if (lang === 'en') return en
  const mod = await import(`@/lib/i18n/${lang}`)
  return mod.default
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  const [t, setT] = useState<Translations>(en)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zilpo_pro_lang') as Lang | null
      if (stored && LANG_LABELS[stored]) setLangState(stored)
    } catch {}
  }, [])

  useEffect(() => {
    loadTranslations(lang).then(setT)
    try { localStorage.setItem('zilpo_pro_lang', lang) } catch {}
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)

  return <Ctx.Provider value={{ t, lang, setLang, langLabels: LANG_LABELS }}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
export { LANG_LABELS }
