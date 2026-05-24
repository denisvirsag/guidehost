import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { Key, Video, ShieldCheck, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function SelfCheckInPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600 mb-6">
              Check-in Autonomo Visivo
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
              Azzerate le chiamate notturne per trovare le chiavi.
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Il check-in perfetto non richiede una stretta di mano. Richiede chiarezza. Trasforma il momento più critico del viaggio in un arrivo senza attriti.
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

        {/* Step-by-Step Feature */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">L'indipendenza che desiderano, la sicurezza che esigi.</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Un volo atterra con 3 ore di ritardo alle 2:00 di notte. La famiglia arriva esausta. Con GuideHost, seguono semplicemente le foto sul telefono e in 2 minuti sono a letto. Nessuno stress per loro, nessuna sveglia notturna per te.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center text-rose-500 font-bold text-xl">1</div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">Istruzioni Visive</h4>
                      <p className="text-slate-600">Aggiungi foto, brevi video e mappe per ogni singolo passaggio. Mostra "Il cancello blu" o "La cassetta di sicurezza dietro il vaso".</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center text-rose-500 font-bold text-xl">2</div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">Integrazione Serrature Smart</h4>
                      <p className="text-slate-600">Invia PIN univoci e temporanei direttamente nella guida per serrature intelligenti come Nuki o Igloohome.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center text-rose-500 font-bold text-xl">3</div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">Arrivi H24</h4>
                      <p className="text-slate-600">Abbatti i costi operativi per l'accoglienza fisica. Nessuna necessità di concordare orari o pagare staff extra per i ritardi.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-rose-50 rounded-[40px] transform rotate-3"></div>
                <div className="relative bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 flex flex-col gap-6">
                  <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-rose-100 flex items-center justify-center"><Key className="text-rose-500" /></div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Step 1: Trova il lucchetto</div>
                      <div className="text-xs text-slate-500">Il lucchetto si trova attaccato al cancello in ferro battuto.</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-rose-100 flex items-center justify-center"><ShieldCheck className="text-rose-500" /></div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Step 2: Inserisci il codice</div>
                      <div className="text-xs text-slate-500">Usa le ultime 4 cifre del tuo numero di telefono.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Dormi sonni tranquilli.</h2>
            <p className="text-xl text-slate-600 mb-10">L'automazione che accoglie i tuoi ospiti con precisione millimetrica.</p>
            <Link 
              href="/signup"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#FF5A5F] px-10 text-lg font-bold text-white shadow-xl shadow-[#FF5A5F]/20 hover:bg-[#ff454a] transition-transform hover:-translate-y-1"
            >
              Provalo Ora
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
