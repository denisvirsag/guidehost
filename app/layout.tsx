import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import PostHogProvider from '@/components/analytics/PostHogProvider'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GuideHost — Guide Interattive per Airbnb',
    template: '%s | GuideHost',
  },
  description:
    'Crea guide interattive professionali per i tuoi ospiti Airbnb. Niente più PDF o fogli stampati — solo una guida digitale accessibile via QR code o link, ottimizzata per mobile.',
  keywords: ['airbnb guide', 'property manager', 'guida ospiti', 'casa vacanze', 'qr code'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'GuideHost',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
