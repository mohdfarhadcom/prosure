'use client'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
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
  'fridge-cleaning': [{ mins: 30, price: 149, orig: 250 }, { mins: 60, price: 249, orig: 450 }],
}

export default function ServiceDetailPage() {
  const { type } = useParams<{ type: string }>()
  const router = useRouter()
  const { add, items } = useCart()
  const svc = getService(type)

  if (!svc) {
    return (
      <main className="page px-4 py-8">
        <p className="text-gray-500 text-sm">Service not found.</p>
        <Link href="/" className="text-[#F5A623] font-semibold mt-2 block">Go home</Link>
      </main>
    )
  }

  const durations = DURATION_PRICES[type] || DURATION_PRICES.default
  const inCart = items.find(i => i.slug === type)

  return (
    <main className="page">
      {/* Hero image */}
      <div className="relative w-full h-56">
        <Image src={svc.img} alt={svc.name} fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl p-2 shadow"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span className="absolute top-4 right-4 text-[10px] font-bold bg-[#F5A623] text-white px-2 py-1 rounded-lg shadow">New</span>
      </div>

      <div className="px-4 py-6">
        {/* Title */}
        <div className="mb-5">
          <h1 className="font-black text-2xl tracking-tight">{svc.name}</h1>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{svc.desc}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">Approx. {svc.duration} min</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg capitalize">{svc.category}</span>
          </div>
        </div>

        {/* What is included */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-5">
          <h3 className="font-semibold text-sm mb-3">What is included</h3>
          <div className="flex flex-col gap-2.5">
            {[
              'Professional brings all tools and supplies',
              'Verified and background-checked worker',
              'Damage cover up to Rs 6,000 per booking',
              'Masked contact — no direct numbers shared',
            ].map(item => (
              <div key={item} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#FFF3DC] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#F5A623] text-[10px] font-bold">✓</span>
                </div>
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Duration + price options */}
        <h3 className="font-semibold text-sm mb-3">Select duration</h3>
        <div className="flex flex-col gap-3 mb-8">
          {durations.map(d => (
            <button
              key={d.mins}
              onClick={() => add({ slug: type, name: svc.name, price: d.price, original: d.orig })}
              className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 hover:border-[#F5A623] hover:bg-[#FFF3DC]/30 transition-all group"
            >
              <div className="text-left">
                <div className="font-semibold text-sm">{d.mins < 60 ? `${d.mins} min` : `${d.mins / 60} hr`}</div>
                <div className="text-xs text-gray-400 mt-0.5">Scheduled booking</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-extrabold text-[#F5A623] text-base">Rs {d.price}</div>
                  <div className="text-xs text-gray-400 line-through">Rs {d.orig}</div>
                </div>
                <div className="w-8 h-8 border-2 border-[#F5A623] rounded-full flex items-center justify-center group-hover:bg-[#F5A623] transition-colors">
                  <span className="text-[#F5A623] group-hover:text-white text-base leading-none">+</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            add({ slug: type, name: svc.name, price: durations[0].price, original: durations[0].orig })
            router.push('/cart')
          }}
          className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
        >
          {inCart ? 'View cart' : 'Book now'}
        </button>
      </div>
    </main>
  )
}
