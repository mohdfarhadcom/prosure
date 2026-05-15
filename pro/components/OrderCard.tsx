'use client'
import Link from 'next/link'
import { useI18n } from '@/context/I18nContext'

export type Order = {
  id: string
  booking_type: string
  date: string
  slot: string
  address: string
  amount: number
  status: string
  duration?: number
}

export default function OrderCard({ order, onClaim, claiming }: {
  order: Order
  onClaim?: () => void
  claiming?: boolean
}) {
  const { t } = useI18n()

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-purple-100 text-purple-700',
    'in progress': 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const statusLabel: Record<string, string> = {
    pending: t.statusPending,
    accepted: t.statusAccepted,
    confirmed: 'Available',
    'in progress': 'In Progress',
    completed: t.statusCompleted,
    cancelled: t.statusCancelled,
  }

  const serviceLabel = order.booking_type === 'hourly' ? 'Hourly Service' : 'Home Services'
  const dateStr = order.date
    ? new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })
    : ''

  if (onClaim) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold text-sm text-gray-900">{serviceLabel}</p>
            <p className="text-xs text-gray-400 mt-0.5">{dateStr} · {order.slot}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
            {statusLabel[order.status] || order.status}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate mb-3">{order.address}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-sm text-[#F5A623]">{t.rs} {order.amount}</span>
            <span className="text-xs text-gray-400 ml-2">You earn: Rs {Math.round(order.amount * 0.8)}</span>
          </div>
          {order.duration && <span className="text-xs text-gray-400">{order.duration} {t.mins}</span>}
        </div>
        <button onClick={onClaim} disabled={claiming}
          className="w-full mt-3 py-3 rounded-xl bg-[#F5A623] text-white text-sm font-bold disabled:opacity-50 shadow-[0_4px_16px_rgba(245,166,35,0.3)]">
          {claiming ? 'Accepting...' : 'Accept Order'}
        </button>
      </div>
    )
  }

  return (
    <Link href={`/orders/${order.id}`}
      className="block bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#F5A623] transition-all">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm text-gray-900">{serviceLabel}</p>
          <p className="text-xs text-gray-400 mt-0.5">{dateStr} · {order.slot}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {statusLabel[order.status] || order.status}
        </span>
      </div>
      <p className="text-xs text-gray-500 truncate mb-3">{order.address}</p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm text-[#F5A623]">{t.rs} {order.amount}</span>
        {order.duration && <span className="text-xs text-gray-400">{order.duration} {t.mins}</span>}
      </div>
    </Link>
  )
}
