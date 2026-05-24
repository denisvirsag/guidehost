import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { LifeBuoy, Mail, MessageCircle, PlayCircle } from 'lucide-react'

export default function SupportoPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />
      
      <main className="pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 mb-24 text-center">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-600 mb-6">
            Centro Assistenza
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
            Siamo qui per aiutarti.
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Hai domande sulla configurazione? Il nostro team è pronto a supportarti per mettere online la tua prima guida in meno di 10 minuti.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
            <a href="mailto:support@guidehost.it" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group">
              <Mail className="text-purple-500 w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">Supporto via Email</h3>
              <p className="text-slate-600">Scrivici in qualsiasi momento. Rispondiamo entro 24 ore lavorative.</p>
            </a>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all group cursor-pointer">
              <PlayCircle className="text-purple-500 w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">Video Tutorial</h3>
              <p className="text-slate-600">Guarda le nostre guide passo-passo per scoprire tutti i segreti della piattaforma.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Domande Frequenti</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Gli ospiti devono scaricare un'app?</h4>
                <p className="text-slate-600">Assolutamente no. Il guestbook si apre nel browser del loro telefono tramite un link o scansionando un codice QR.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Posso usare la guida per più appartamenti?</h4>
                <p className="text-slate-600">Sì, i nostri piani (come il piano Pro) ti permettono di gestire guide separate per tutte le tue proprietà da un unico account.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">La traduzione in altre lingue è automatica?</h4>
                <p className="text-slate-600">Sì, scrivendo il testo in italiano, la piattaforma offre la traduzione automatica per gli ospiti stranieri basandosi sulla lingua del loro smartphone.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
