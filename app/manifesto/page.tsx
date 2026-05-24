import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { Heart, Star, Users } from 'lucide-react'

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />
      
      <main className="pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 mb-24 text-center">
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600 mb-6">
            Il nostro Manifesto
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
            L'ospitalità digitale che non perde il tocco umano.
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed text-left">
            Crediamo fermamente che la tecnologia non debba sostituire l'accoglienza, ma elevarla. GuideHost nasce da una frustrazione comune a molti host: voler offrire un'esperienza perfetta senza sacrificare la propria vita privata rispondendo a messaggi ripetitivi.
          </p>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed text-left">
            Il nostro manifesto si basa su tre pilastri fondamentali:
          </p>

          <div className="grid sm:grid-cols-3 gap-8 mt-16 text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
                <Heart className="text-rose-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Empatia prima di tutto</h3>
              <p className="text-slate-600">Creiamo strumenti che fanno sentire l'ospite coccolato, non gestito da un robot.</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                <Star className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">L'Eccellenza come Standard</h3>
              <p className="text-slate-600">Le recensioni a 5 stelle non sono fortuna, sono il risultato di sistemi prevedibili.</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                <Users className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Rispetto del Tempo</h3>
              <p className="text-slate-600">Il tuo tempo ha valore. Il tempo del tuo ospite in vacanza ne ha altrettanto.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Unisciti alla rivoluzione dell'ospitalità.</h2>
            <Link 
              href="/signup"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-slate-900 px-10 text-lg font-bold text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-transform hover:-translate-y-1"
            >
              Inizia a usare GuideHost
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
