import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { I18nProvider } from '@/context/I18nContext'

export const metadata: Metadata = {
  title: 'Zilpo Pro',
  description: 'Zilpo Professional App — manage orders and earnings',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
