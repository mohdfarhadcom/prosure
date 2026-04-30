'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function RootPage() {
  const { pro, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    try {
      const onboarded = localStorage.getItem('zilpo_pro_onboarded')
      if (!onboarded) {
        router.replace('/onboarding')
        return
      }
    } catch {}
    router.replace(pro ? '/home' : '/login')
  }, [pro, loading, router])

  return (
    <div className="min-h-dvh flex items-center justify-center bg-white">
      <span className="gradient-text font-black text-4xl tracking-tighter">zilpo</span>
    </div>
  )
}
