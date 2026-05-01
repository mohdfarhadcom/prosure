'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'

export type Pro = {
  id: string
  phone: string
  name: string
  service_type: 'home_help' | 'home_cook'
  gender?: string
  lat?: number
  lng?: number
  status: string  // 'pending' | 'approved'
}

type AuthCtx = {
  pro: Pro | null
  loading: boolean
  setPro: (p: Pro | null) => void
  logout: () => void
}

const Ctx = createContext<AuthCtx>({ pro: null, loading: true, setPro: () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [pro, setProState] = useState<Pro | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zilpo_pro')
      if (stored) setProState(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  const setPro = (p: Pro | null) => {
    setProState(p)
    if (p) localStorage.setItem('zilpo_pro', JSON.stringify(p))
    else localStorage.removeItem('zilpo_pro')
  }

  const logout = async () => {
    localStorage.removeItem('zilpo_pro')
    setProState(null)
    await supabase.auth.signOut().catch(() => {})
  }

  return <Ctx.Provider value={{ pro, loading, setPro, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
