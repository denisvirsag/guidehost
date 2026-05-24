import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { Map, MapPin, Navigation, Heart, ArrowRight } from 'lucide-react'

export default function MapsPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-600 mb-6">
              Consigli Locali & Mappe Interattive
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
              Meno ricerche,<br/> più scoperte.
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              La tua guida personale alla città, curata con amore e servita in digitale. Diventa il super-host che conosce ogni angolo segreto.
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

        {/* Feature Highlights */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-200 to-teal-50 rounded-[40px] transform -rotate-3"></div>
                <div className="relative bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 flex flex-col gap-4">
                  <div className="w-full h-48 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                    <Map className="text-slate-300 w-32 h-32 absolute opacity-50" />
                    <div className="bg-white p-3 rounded-xl shadow-lg relative z-10 flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"><MapPin className="text-teal-600" size={20} /></div>
                      <div>
                        <div className="font-bold text-sm">Trattoria Da Nonna</div>
                        <div className="text-xs text-slate-500">1.2 km di distanza</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">"Live Like a Local"</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Non offrire solo un letto, regala la vera anima del tuo territorio. Diventa l'ambasciatore del tuo quartiere con una mappa interattiva che svela i tuoi segreti meglio custoditi.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 mr-4 mt-1"><Heart size={16} /></div>
                    <div>
                      <h4 className="font-bold text-slate-900">Categorie Personalizzate</h4>
                      <p className="text-slate-600">Organizzazione per tag (romantico, per famiglie, opzioni pioggia, celiaci). L'ospite trova subito ciò che cerca.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 mr-4 mt-1"><Navigation size={16} /></div>
                    <div>
                      <h4 className="font-bold text-slate-900">Integrazione Navigazionale</h4>
                      <p className="text-slate-600">Collegamento diretto a Google Maps e Apple Maps per calcolare i percorsi a piedi o in auto con un click.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Crea la tua Mappa.</h2>
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
