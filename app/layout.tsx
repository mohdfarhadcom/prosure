import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { LocationProvider } from '@/context/LocationContext'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Zilpo – Professional at your door in 10 minutes',
  description: 'Connect to a verified home professional within 10–15 minutes. Cleaning, cooking, laundry and more.',
  metadataBase: new URL('https://thezilpo.com'),
  alternates: { canonical: 'https://thezilpo.com' },
  openGraph: {
    title: 'Zilpo – Professional at your door in 10 minutes',
    description: 'Connect to a verified home professional within 10–15 minutes. Cleaning, cooking, laundry and more.',
    url: 'https://thezilpo.com',
    siteName: 'Zilpo',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Zilpo – Professional at your door in 10 minutes',
    description: 'Connect to a verified home professional within 10–15 minutes.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* CSS-only loading screen */}
        <div
          className="zilpo-loading fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center gap-6"
          style={{ animationFillMode: 'forwards' }}
        >
          <div className="zilpo-logo-pulse flex flex-col items-center gap-2">
            <span
              className="gradient-text font-black tracking-tighter"
              style={{ fontSize: 52, letterSpacing: '-2px', lineHeight: 1 }}
            >
              zilpo
            </span>
            <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">Pro at your door in 10 min</span>
          </div>
          {/* Progress bar */}
          <div className="w-32 h-0.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="zilpo-bar h-full bg-gradient-to-r from-[#F5A623] to-[#FF6B35] rounded-full" />
          </div>
        </div>

        <AuthProvider>
          <CartProvider>
            <LocationProvider>
              {children}
              <Navbar />
            </LocationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
