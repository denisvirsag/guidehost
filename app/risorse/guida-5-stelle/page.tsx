import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { Star, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'

export default function Guida5StellePage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />
      
      <main className="pt-32 pb-20">
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 text-left">
              <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600 mb-6">
                Guida Pratica Gratuita
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                Il manuale definitivo per scalare le classifiche.
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Le recensioni a 5 stelle non sono frutto del caso. Scopri i segreti dell'algoritmo di Airbnb e impara a strutturare un'esperienza ospite inattaccabile.
              </p>
              <div className="flex items-center gap-4">
                <Link 
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#FF5A5F] px-8 text-base font-medium text-white shadow-lg shadow-[#FF5A5F]/20 hover:bg-[#ff454a] transition-all hover:-translate-y-0.5"
                >
                  Scarica la Guida in PDF
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-amber-100 rounded-[40px] p-8 aspect-square relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 to-amber-50 rounded-[40px] transform rotate-3 opacity-50"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-amber-100 max-w-sm w-full">
                  <div className="flex justify-center mb-6">
                    <div className="flex text-amber-400">
                      <Star size={32} fill="currentColor" />
                      <Star size={32} fill="currentColor" />
                      <Star size={32} fill="currentColor" />
                      <Star size={32} fill="currentColor" />
                      <Star size={32} fill="currentColor" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">L'Algoritmo Perfetto</h3>
                  <p className="text-center text-slate-500 text-sm">Edizione 2026</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Cosa imparerai in questa guida:</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                <CheckCircle className="text-emerald-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Il tempismo delle risposte</h4>
                  <p className="text-slate-600">Come rispondere in meno di 5 minuti senza stare incollati al telefono, sfruttando l'automazione.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                <TrendingUp className="text-emerald-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Prevenire i feedback negativi</h4>
                  <p className="text-slate-600">La tecnica del "controllo a metà soggiorno" per risolvere i problemi prima del check-out.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                <Star className="text-emerald-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Ottimizzare la percezione del valore</h4>
                  <p className="text-slate-600">Piccoli dettagli a costo zero che spingono gli ospiti a perdonare piccoli imprevisti.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
