import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { LocationProvider } from '@/context/LocationContext'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Zilpo – House Help On Demand',
  description: 'Book professional house help in minutes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* CSS-only loading screen — renders before JS hydrates */}
        <div
          className="zilpo-loading fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center gap-4"
          style={{ animationFillMode: 'forwards' }}
        >
          <div className="zilpo-spinner" />
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Zilpo</span>
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
