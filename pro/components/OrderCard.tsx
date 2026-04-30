'use client'
import Link from 'next/link'
import { useI18n } from '@/context/I18nContext'

type Order = {
  id: string
  service_name: string
  scheduled_at: string
  address: string
  total: number
  status: string
  duration?: number
}

export default function OrderCard({ order }: { order: Order }) {
  const { t } = useI18n()

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const statusLabel: Record<string, string> = {
    pending: t.statusPending,
    accepted: t.statusAccepted,
    completed: t.statusCompleted,
    cancelled: t.statusCancelled,
  }

  const d = new Date(order.scheduled_at)
  const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#F5A623] transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm text-gray-900">{order.service_name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{dateStr} · {timeStr}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {statusLabel[order.status] || order.status}
        </span>
      </div>
      <p className="text-xs text-gray-500 truncate mb-3">{order.address}</p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm text-[#F5A623]">{t.rs} {order.total}</span>
        {order.duration && (
          <span className="text-xs text-gray-400">{order.duration} {t.mins}</span>
        )}
      </div>
    </Link>
  )
}
