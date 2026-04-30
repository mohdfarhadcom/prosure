'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const path = usePathname()
  const { count } = useCart()
  const { user } = useAuth()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/bookings', label: 'Bookings' },
    { href: '/help', label: 'Help' },
    { href: user ? '/profile' : '/login', label: user ? 'Profile' : 'Login' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden">
      <div className="flex items-center justify-around h-14">
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex flex-col items-center text-xs gap-0.5 px-3 py-1 ${
              path === l.href ? 'text-[#F5A623] font-semibold' : 'text-gray-500'
            }`}
          >
            <span className="text-base">{l.label === 'Home' ? '⌂' : l.label === 'Bookings' ? '▦' : l.label === 'Help' ? '?' : '○'}</span>
            <span>{l.label}</span>
          </Link>
        ))}
        <Link
          href="/cart"
          className={`flex flex-col items-center text-xs gap-0.5 px-3 py-1 relative ${
            path === '/cart' ? 'text-[#F5A623] font-semibold' : 'text-gray-500'
          }`}
        >
          <span className="text-base">✦</span>
          <span>Cart</span>
          {count > 0 && (
            <span className="absolute top-0 right-1 bg-[#F5A623] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
