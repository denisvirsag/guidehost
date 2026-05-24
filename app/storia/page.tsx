import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'

export default function StoriaPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />
      
      <main className="pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 mb-6">
              La Nostra Storia
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
              Da host, per gli host.
            </h1>
          </div>
          
          <div className="prose prose-lg text-slate-600 max-w-none">
            <p>
              Tutto è iniziato con un raccoglitore ad anelli. Era il 2018, e gestivamo tre appartamenti nel centro di Roma. Ogni settimana perdevamo ore a stampare fogli, aggiornare password del WiFi scritte a penna e tradurre istruzioni in inglese maccheronico usando Google Translate.
            </p>
            <p>
              Un venerdì notte, un ospite ci chiamò alle 3 del mattino. Non riusciva a trovare l'interruttore del boiler. Era scritto a pagina 4 della guida cartacea, ma al buio e stanco per il viaggio, non l'aveva letto.
            </p>
            <blockquote className="border-l-4 border-[#FF5A5F] pl-6 my-8 italic text-2xl text-slate-800 font-medium">
              "Doveva esserci un modo migliore. Un modo per avere tutte le risposte già nella tasca dell'ospite, prima ancora che sorgesse la domanda."
            </blockquote>
            <p>
              Abbiamo cercato soluzioni online, ma trovavamo solo software complessi destinati a grandi hotel, o semplici creatori di PDF che non risolvevano il problema dell'interattività e della traduzione.
            </p>
            <p>
              Così è nata GuideHost. Una piattaforma snella, bella da vedere e facilissima da usare. Abbiamo iniziato a testarla sui nostri appartamenti: i messaggi degli ospiti sono crollati del 70%. Le recensioni a 5 stelle sono diventate la norma, perché gli ospiti si sentivano guidati e sicuri in ogni momento del loro soggiorno.
            </p>
            <p>
              Oggi, GuideHost aiuta migliaia di host in tutta Italia a riprendersi il proprio tempo, offrendo al contempo un servizio di livello alberghiero.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
