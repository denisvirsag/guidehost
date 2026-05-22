import type { Metadata } from 'next'
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { FeaturesBento } from '@/components/landing/FeaturesBento'
import { Pricing } from '@/components/landing/Pricing'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Guida Ospiti Airbnb Digitale | Ottieni Recensioni a 5 Stelle | GuideHost',
  description:
    'Crea una guida ospiti digitale e interattiva per il tuo Airbnb o casa vacanze. Risparmia tempo, riduci i messaggi e le chiamate notturne, e aumenta le tue recensioni a 5 stelle.',
  keywords: ['guida ospiti airbnb', 'digital guestbook airbnb', 'recensioni 5 stelle airbnb', 'gestione casa vacanze', 'check-in ospiti airbnb', 'risparmiare tempo host'],
  openGraph: {
    title: 'Guida Ospiti Airbnb Digitale | GuideHost',
    description: 'Crea una guida ospiti digitale e interattiva per il tuo Airbnb o casa vacanze. Riduci i messaggi degli ospiti e ottieni recensioni da 5 stelle.',
    type: 'website',
    locale: 'it_IT',
    siteName: 'GuideHost',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <Navbar />
      <main>
        <Hero />
        <FeaturesBento />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
