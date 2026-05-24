import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { Smartphone, RefreshCw, Globe, Layers, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function GuestbookPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 mb-6">
              Guestbook Digitale Interattivo
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
              Tutte le risposte in tasca ai tuoi ospiti.<br/>
              <span className="text-[#FF5A5F]">Nessuna app da scaricare.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              L'accoglienza perfetta inizia molto prima dell'arrivo. Trasforma le domande non fatte in risposte immediate con un concierge digitale sempre a disposizione.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 px-8 text-base font-medium text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5 group"
              >
                Inizia gratis ora
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/#pricing"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-8 text-base font-medium text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Vedi tariffe
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Perché il vecchio faldone cartaceo è superato</h2>
              <p className="text-lg text-slate-600">Regala un'esperienza fluida e nativa digitale che eleva il tuo brand turistico e ti restituisce il tuo tempo.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
                  <Smartphone className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Zero App da Scaricare</h3>
                <p className="text-slate-600 leading-relaxed mb-6">Accesso immediato tramite link web ottimizzato come una Progressive Web App. Gli ospiti non devono intasare la memoria del telefono con app pesanti.</p>
                <ul className="space-y-3 mt-auto">
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> Funziona offline</li>
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> Salva in home screen</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
                  <RefreshCw className="text-rose-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Aggiornamenti in Tempo Reale</h3>
                <p className="text-slate-600 leading-relaxed mb-6">Modifica le regole della casa, la password del WiFi o le istruzioni della TV una volta sola. Tutti i futuri ospiti vedranno la versione aggiornata senza dover ristampare nulla.</p>
                <ul className="space-y-3 mt-auto">
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> Avvisi di emergenza</li>
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> Modifiche istantanee</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                  <Globe className="text-amber-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Multilingua Automatico</h3>
                <p className="text-slate-600 leading-relaxed mb-6">Supera le barriere linguistiche con la traduzione integrata. Accogli ospiti internazionali come se fossi madrelingua, aumentando la loro sicurezza e comprensione.</p>
                <ul className="space-y-3 mt-auto">
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> Oltre 10 lingue supportate</li>
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> Traduzione professionale</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center mb-6">
                  <Layers className="text-teal-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Tutto in Unico Hub</h3>
                <p className="text-slate-600 leading-relaxed mb-6">Dal manuale degli elettrodomestici alle regole di check-out, tutto è organizzato in un unico hub digitale elegante, facile da navigare con una sola mano.</p>
                <ul className="space-y-3 mt-auto">
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> Navigazione intuitiva</li>
                  <li className="flex items-center text-slate-700 font-medium"><CheckCircle2 className="text-emerald-500 mr-2" size={18} /> Categorie personalizzabili</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Riduci del 70% i messaggi ripetitivi.</h2>
            <p className="text-xl text-slate-600 mb-10">Crea la tua prima guida digitale in meno di 10 minuti. Non è richiesta la carta di credito.</p>
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
