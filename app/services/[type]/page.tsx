'use client'
import { useParams, useRouter } from 'next/navigation'
import { getService } from '@/lib/services'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

const DURATION_PRICES: Record<string, { mins: number; price: number; orig: number }[]> = {
  default: [
    { mins: 30, price: 49, orig: 125 },
    { mins: 60, price: 99, orig: 250 },
    { mins: 90, price: 149, orig: 325 },
  ],
  'complete-wardrobe': [{ mins: 120, price: 497, orig: 700 }],
  'kitchen-cabinets': [{ mins: 90, price: 597, orig: 800 }],
  'fridge-cleaning': [{ mins: 60, price: 149, orig: 250 }],
}

export default function ServiceDetailPage() {
  const { type } = useParams<{ type: string }>()
  const router = useRouter()
  const { add, items } = useCart()
  const svc = getService(type)

  if (!svc) {
    return (
      <main className="page px-4 py-8">
        <p className="text-gray-500">Service not found.</p>
        <Link href="/" className="text-[#F5A623] font-semibold mt-2 block">Go home</Link>
      </main>
    )
  }

  const durations = DURATION_PRICES[type] || DURATION_PRICES.default
  const inCart = items.find(i => i.slug === type)

  return (
    <main className="page">
      <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-700 font-medium">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-semibold text-base">{svc.name}</h1>
      </header>

      <div className="px-4 py-6">
        {/* Service description */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[10px] font-semibold bg-[#F5A623] text-white px-2 py-0.5 rounded">New</span>
          </div>
          <h2 className="font-bold text-xl mb-2">{svc.name}</h2>
          <p className="text-sm text-gray-600">{svc.desc}</p>
          <p className="text-xs text-gray-400 mt-2">Approx. {svc.duration} min</p>
        </div>

        {/* What is included */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-3">What is included</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex gap-2"><span className="text-[#F5A623] font-bold">-</span>Professional carries all tools</li>
            <li className="flex gap-2"><span className="text-[#F5A623] font-bold">-</span>Verified, trained worker</li>
            <li className="flex gap-2"><span className="text-[#F5A623] font-bold">-</span>Damage cover up to Rs 6,000</li>
            <li className="flex gap-2"><span className="text-[#F5A623] font-bold">-</span>Masked contact — no direct numbers shared</li>
          </ul>
        </div>

        {/* Duration options */}
        <div className="mb-8">
          <h3 className="font-semibold text-sm mb-3">Select duration</h3>
          <div className="flex flex-col gap-3">
            {durations.map(d => (
              <button
                key={d.mins}
                onClick={() => add({ slug: type, name: svc.name, price: d.price, original: d.orig })}
                className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:border-[#F5A623] transition-colors"
              >
                <div>
                  <div className="font-semibold text-sm">{d.mins < 60 ? `${d.mins} min` : `${d.mins / 60} hr`}</div>
                  <div className="text-xs text-gray-400">Scheduled booking</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#F5A623]">Rs {d.price}</div>
                  <div className="text-xs text-gray-400 line-through">Rs {d.orig}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Book now button */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              add({ slug: type, name: svc.name, price: durations[0].price, original: durations[0].orig })
              router.push('/cart')
            }}
            className="flex-1 bg-[#F5A623] text-white font-semibold py-4 rounded-2xl text-base"
          >
            {inCart ? 'Go to cart' : 'Book now'}
          </button>
        </div>
      </div>
    </main>
  )
}
