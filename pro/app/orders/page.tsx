'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { supabase } from '@/lib/supabaseClient'
import OrderCard, { Order } from '@/components/OrderCard'
import Navbar from '@/components/Navbar'

type Tab = 'active' | 'available' | 'completed'

export default function OrdersPage() {
  const { pro, loading } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('active')
  const [orders, setOrders] = useState<Order[]>([])
  const [fetching, setFetching] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !pro) router.replace('/login')
  }, [pro, loading, router])

  useEffect(() => {
    if (!pro) return
    setFetching(true)
    setOrders([])

    if (tab === 'available') {
      supabase
        .from('bookings')
        .select('id, booking_type, date, slot, address, amount, status, duration')
        .eq('status', 'confirmed')
        .eq('booking_mode', 'schedule')
        .is('professional_id', null)
        .order('date', { ascending: true })
        .then(({ data }) => {
          setOrders((data as Order[]) || [])
          setFetching(false)
        })
      return
    }

    const statuses = tab === 'active'
      ? ['accepted', 'in progress', 'pending']
      : ['completed', 'cancelled']

    supabase
      .from('bookings')
      .select('id, booking_type, date, slot, address, amount, status, duration')
      .eq('professional_id', pro.id)
      .in('status', statuses)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || [])
        setFetching(false)
      })
  }, [pro?.id, tab])

  const claimOrder = async (orderId: string) => {
    if (!pro) return
    setClaimingId(orderId)
    const { error } = await supabase
      .from('bookings')
      .update({ professional_id: pro.id, status: 'accepted' })
      .eq('id', orderId)
      .is('professional_id', null)
    setClaimingId(null)
    if (!error) {
      router.push(`/orders/${orderId}`)
    } else {
      alert('This order was already taken.')
      setOrders(prev => prev.filter(o => o.id !== orderId))
    }
  }

  if (loading || !pro) return null

  const TABS: { key: Tab; label: string }[] = [
    { key: 'active', label: t.active },
    { key: 'available', label: 'Available' },
    { key: 'completed', label: t.completed },
  ]

  return (
    <>
      <main className="page">
        <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4">
          <h1 className="font-bold text-xl text-gray-900">{t.orders}</h1>
          <div className="flex gap-2 mt-3">
            {TABS.map(s => (
              <button key={s.key} onClick={() => setTab(s.key)}
                className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                  tab === s.key ? 'bg-[#F5A623] text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </header>

        <div className="px-4 mt-4 flex flex-col gap-3 pb-24">
          {tab === 'available' && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-xs text-blue-700">Scheduled orders you can accept. First come, first served.</p>
            </div>
          )}
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
                {tab === 'active' ? t.noActiveOrders : tab === 'available' ? 'No scheduled orders available right now' : t.noCompletedOrders}
              </p>
            </div>
          ) : (
            orders.map(o => (
              <OrderCard key={o.id} order={o}
                onClaim={tab === 'available' ? () => claimOrder(o.id) : undefined}
                claiming={claimingId === o.id} />
            ))
          )}
        </div>
      </main>
      <Navbar />
    </>
  )
}
