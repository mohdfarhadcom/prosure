'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { supabase } from '@/lib/supabaseClient'
import OrderCard from '@/components/OrderCard'
import Navbar from '@/components/Navbar'

type Booking = {
  id: string
  service_name: string
  scheduled_at: string
  address: string
  total: number
  status: string
  duration?: number
}

export default function OrdersPage() {
  const { pro, loading } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const [tab, setTab] = useState<'active' | 'completed'>('active')
  const [orders, setOrders] = useState<Booking[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !pro) router.replace('/login')
  }, [pro, loading, router])

  useEffect(() => {
    if (!pro) return
    setFetching(true)
    const statuses = tab === 'active' ? ['accepted', 'pending'] : ['completed', 'cancelled']
    supabase
      .from('bookings')
      .select('id, service_name, scheduled_at, address, total, status, duration')
      .eq('professional_id', pro.id)
      .in('status', statuses)
      .order('scheduled_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as Booking[]) || [])
        setFetching(false)
      })
  }, [pro?.id, tab])

  if (loading || !pro) return null

  return (
    <>
      <main className="page">
        <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4">
          <h1 className="font-bold text-xl text-gray-900">{t.orders}</h1>
          <div className="flex gap-2 mt-3">
            {(['active', 'completed'] as const).map(s => (
              <button
                key={s}
                onClick={() => setTab(s)}
                className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                  tab === s ? 'bg-[#F5A623] text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {s === 'active' ? t.active : t.completed}
              </button>
            ))}
          </div>
        </header>

        <div className="px-4 mt-4 flex flex-col gap-3">
          {fetching ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl shimmer" />
            ))
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
              </div>
              <p className="text-sm font-semibold text-gray-500">
                {tab === 'active' ? t.noActiveOrders : t.noCompletedOrders}
              </p>
            </div>
          ) : (
            orders.map(o => <OrderCard key={o.id} order={o} />)
          )}
        </div>
      </main>
      <Navbar />
    </>
  )
}
