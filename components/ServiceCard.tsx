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
  isNew?: boolean
}

export default function ServiceCard({ slug, name, base, original, img, isNew }: Props) {
  const { add, items, remove } = useCart()
  const inCart = items.find(i => i.slug === slug)
  const discount = Math.round((1 - base / original) * 100)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <Link href={`/services/${slug}`}>
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 200px"
          />
          {isNew && (
            <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-md shadow z-10">
              NEW
            </span>
          )}
          {discount > 0 && (
            <span className="absolute bottom-1.5 right-1.5 text-[9px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-md shadow z-10">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-2.5">
        <Link href={`/services/${slug}`} className="font-semibold text-xs text-gray-900 leading-tight line-clamp-2 hover:text-[#F5A623] block mb-1.5">
          {name}
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <span className="font-bold text-sm text-gray-900">₹{base}</span>
          <span className="text-[10px] text-gray-400 line-through">₹{original}</span>
        </div>

        {inCart ? (
          <div className="flex items-center border border-[#F5A623] rounded-lg overflow-hidden">
            <button onClick={() => remove(slug)} className="flex-1 py-1 bg-white text-[#F5A623] font-bold text-sm">−</button>
            <span className="px-2 text-xs font-bold text-[#F5A623]">{inCart.qty}</span>
            <button onClick={() => add({ slug, name, price: base, original })} className="flex-1 py-1 bg-[#F5A623] text-white font-bold text-sm">+</button>
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
