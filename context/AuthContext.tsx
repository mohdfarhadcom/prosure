'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'

export type User = { id: string; phone: string; name?: string; email?: string }

type AuthCtx = {
  user: User | null
  loading: boolean
  setUser: (u: User | null) => void
  logout: () => void
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, setUser: () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zilpo_user')
      if (stored) setUserState(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  const setUser = (u: User | null) => {
    setUserState(u)
    if (u) localStorage.setItem('zilpo_user', JSON.stringify(u))
    else localStorage.removeItem('zilpo_user')
  }

  const logout = async () => {
    localStorage.removeItem('zilpo_user')
    localStorage.removeItem('zilpo_cart')
    setUserState(null)
    await supabase.auth.signOut().catch(() => {})
  }

  return <Ctx.Provider value={{ user, loading, setUser, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
