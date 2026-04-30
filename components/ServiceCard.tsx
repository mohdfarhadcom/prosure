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
}

export default function ServiceCard({ slug, name, base, original, img }: Props) {
  const { add, items } = useCart()
  const inCart = items.find(i => i.slug === slug)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <Image
          src={img}
          alt={name}
          fill
          sizes="(max-width: 480px) 33vw, 160px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        <span className="absolute top-2 left-2 text-[9px] font-bold bg-[#F5A623] text-white px-1.5 py-0.5 rounded-md shadow">
          New
        </span>
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1.5">
        <Link href={`/services/${slug}`} className="font-semibold text-xs text-gray-900 leading-tight line-clamp-2 hover:text-[#F5A623]">
          {name}
        </Link>
        <div className="flex items-center gap-1">
          <span className="font-bold text-sm text-gray-900">Rs {base}</span>
          <span className="text-[10px] text-gray-400 line-through">Rs {original}</span>
        </div>
        <button
          onClick={() => add({ slug, name, price: base, original })}
          className={`w-full py-1.5 rounded-lg text-xs font-bold border transition-all ${
            inCart
              ? 'bg-[#F5A623] text-white border-[#F5A623]'
              : 'border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623] hover:text-white'
          }`}
        >
          {inCart ? `Added (${inCart.qty})` : '+ Add'}
        </button>
      </div>
    </div>
  )
}
