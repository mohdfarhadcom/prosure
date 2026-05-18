'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type User = { id: string; phone: string; name?: string; email?: string }

type AuthCtx = {
  user: User | null
  loading: boolean
  setUser: (u: User | null) => void
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, setUser: () => {}, logout: async () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Reconcile localStorage with server session — if the cookie is gone,
    // drop the stale user.
    let cancelled = false
    ;(async () => {
      let cached: User | null = null
      try {
        const stored = localStorage.getItem('zilpo_user')
        if (stored) cached = JSON.parse(stored)
      } catch {}
      if (cached) setUserState(cached)

      try {
        const res = await fetch('/api/profile')
        if (cancelled) return
        if (res.ok) {
          const data = await res.json()
          if (data?.user) {
            setUserState(data.user)
            localStorage.setItem('zilpo_user', JSON.stringify(data.user))
          }
        } else if (res.status === 401 && cached) {
          // Server says not logged in but localStorage thinks we are — clear it.
          setUserState(null)
          localStorage.removeItem('zilpo_user')
        }
      } catch {
        // network down — keep the cached user
      }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  const setUser = (u: User | null) => {
    setUserState(u)
    if (u) localStorage.setItem('zilpo_user', JSON.stringify(u))
    else localStorage.removeItem('zilpo_user')
  }

  const logout = async () => {
    try { await fetch('/api/logout', { method: 'POST' }) } catch {}
    localStorage.removeItem('zilpo_user')
    localStorage.removeItem('zilpo_cart')
    setUserState(null)
  }

  return <Ctx.Provider value={{ user, loading, setUser, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
