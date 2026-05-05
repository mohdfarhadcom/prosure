'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

type Props = {
  slug: string
  name: string
  base: number
  original: number
  img: string
  rating?: number
  reviews?: number
  isNew?: boolean
}

export default function ServiceCard({ slug, name, base, original, img, rating = 4.9, reviews, isNew }: Props) {
  const { add, items, remove } = useCart()
  const inCart = items.find(i => i.slug === slug)

  const formatReviews = (n?: number) => {
    if (!n) return null
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return String(n)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
      {/* Image */}
      <Link href={`/services/${slug}`}>
        <div className="relative w-full overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
          <Image
            src={img}
            alt={name}
            fill
            sizes="(max-width: 480px) 33vw, 160px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          {isNew && (
            <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-[#F5A623] text-white px-1.5 py-0.5 rounded-md shadow">
              NEW
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-2.5">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#F5A623" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span className="text-[10px] font-bold text-gray-700">{rating.toFixed(1)}</span>
          {reviews && <span className="text-[10px] text-gray-400">({formatReviews(reviews)})</span>}
        </div>

        <Link href={`/services/${slug}`} className="font-semibold text-xs text-gray-900 leading-tight line-clamp-2 hover:text-[#F5A623] block mb-1.5">
          {name}
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <span className="font-bold text-sm text-gray-900">₹{base}</span>
          <span className="text-[10px] text-gray-400 line-through">₹{original}</span>
        </div>

        {inCart ? (
          <div className="flex items-center border border-[#F5A623] rounded-lg overflow-hidden">
            <button
              onClick={() => remove(slug)}
              className="flex-1 py-1 bg-white text-[#F5A623] font-bold text-sm"
            >−</button>
            <span className="px-2 text-xs font-bold text-[#F5A623]">{inCart.qty}</span>
            <button
              onClick={() => add({ slug, name, price: base, original })}
              className="flex-1 py-1 bg-[#F5A623] text-white font-bold text-sm"
            >+</button>
          </div>
        ) : (
          <button
            onClick={() => add({ slug, name, price: base, original })}
            className="w-full py-1.5 rounded-lg text-xs font-bold border border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623] hover:text-white transition-all"
          >
            + Add
          </button>
        )}
      </div>
    </div>
  )
}
