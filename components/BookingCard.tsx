'use client'
import Link from 'next/link'

type Props = {
  id: string
  date: string
  slot: string
  amount: number
  status: string
  services: string[]
}

const STATUS_COLOR: Record<string, string> = {
  confirmed: 'bg-blue-50 text-blue-700',
  'en route': 'bg-yellow-50 text-yellow-700',
  'in progress': 'bg-green-50 text-green-700',
  completed: 'bg-gray-50 text-gray-600',
  cancelled: 'bg-red-50 text-red-700',
}

export default function BookingCard({ id, date, slot, amount, status, services }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">{date} · {slot}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLOR[status] || 'bg-gray-50 text-gray-600'}`}>
          {status}
        </span>
      </div>
      <div className="text-sm text-gray-600">{services.join(', ')}</div>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900">Rs {amount}</span>
        <Link href={`/booking/${id}`} className="text-sm text-[#F5A623] font-semibold">
          Manage
        </Link>
      </div>
    </div>
  )
}
