'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

type Props = {
  slug: string
  name: string
  base: number
  original: number
}

export default function ServiceCard({ slug, name, base, original }: Props) {
  const { add, items } = useCart()
  const inCart = items.find(i => i.slug === slug)

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-semibold bg-[#F5A623] text-white px-1.5 py-0.5 rounded">New</span>
      </div>
      <Link href={`/services/${slug}`} className="font-medium text-sm text-gray-900 leading-tight hover:text-[#F5A623]">
        {name}
      </Link>
      <div className="flex items-center gap-1">
        <span className="font-bold text-gray-900">Rs {base}</span>
        <span className="text-xs text-gray-400 line-through">Rs {original}</span>
      </div>
      <button
        onClick={() => add({ slug, name, price: base, original })}
        className={`w-full py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
          inCart
            ? 'bg-[#F5A623] text-white border-[#F5A623]'
            : 'border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623] hover:text-white'
        }`}
      >
        {inCart ? `Added (${inCart.qty})` : '+ Add'}
      </button>
    </div>
  )
}
