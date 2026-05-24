import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { QrCode, Scan, Smartphone, ArrowRight, Home, Settings } from 'lucide-react'

export default function QrCodePage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 mb-6">
              Smart QR Code Kit
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
              Un'inquadratura,<br/> un soggiorno perfetto.
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Istruzioni invisibili finché non servono. L'intelligenza spaziale per il tuo affitto breve. Stampa, esponi e stupisci i tuoi ospiti.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 px-8 text-base font-medium text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5 group"
              >
                Inizia gratis ora
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fai parlare la tua struttura</h2>
              <p className="text-lg text-slate-600">Posiziona le risposte esattamente dove servono con QR code dinamici e di design.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                  <Scan className="text-slate-700" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Micro-interazioni</h3>
                <p className="text-slate-600">Istruzioni posizionate esattamente nel momento e nel luogo del bisogno. Un QR sulla lavatrice, uno sul termostato.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                  <Settings className="text-slate-700" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Dinamicità Assoluta</h3>
                <p className="text-slate-600">Cambi la password del router? Aggiorni il link nel software senza dover mai ristampare il QR code fisico. Rimane sempre valido.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                  <Home className="text-slate-700" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Protezione Casa</h3>
                <p className="text-slate-600">Gli ospiti usano correttamente i dispositivi (macchine del caffè, vasche idromassaggio) evitando danni per utilizzo improprio.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Genera il tuo primo Smart QR Code.</h2>
            <Link 
              href="/signup"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#FF5A5F] px-10 text-lg font-bold text-white shadow-xl shadow-[#FF5A5F]/20 hover:bg-[#ff454a] transition-transform hover:-translate-y-1"
            >
              Crea la tua Guida Ora
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
