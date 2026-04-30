'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Location = { lat: number; lng: number; address: string }

type LocationCtx = {
  location: Location | null
  setLocation: (l: Location) => void
}

const Ctx = createContext<LocationCtx>({ location: null, setLocation: () => {} })

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location | null>(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem('zilpo_location')
      if (s) setLocationState(JSON.parse(s))
    } catch {}
  }, [])

  const setLocation = (l: Location) => {
    setLocationState(l)
    localStorage.setItem('zilpo_location', JSON.stringify(l))
  }

  return <Ctx.Provider value={{ location, setLocation }}>{children}</Ctx.Provider>
}

export const useLocation = () => useContext(Ctx)
