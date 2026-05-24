import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { Copy, FileText, Check } from 'lucide-react'

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />
      
      <main className="pt-32 pb-20">
        <section className="max-w-6xl mx-auto px-6 mb-24 text-center">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 mb-6">
            Libreria Template
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Copia, incolla e rispondi <br/>in 3 secondi.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Non reinventare la ruota per ogni ospite. Abbiamo raccolto e testato i migliori messaggi per aumentare l'interazione e ridurre i problemi.
          </p>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="grid gap-8">
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><FileText className="text-blue-500"/> Messaggio di Conferma Prenotazione</h3>
                <button className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  <Copy size={14}/> Copia
                </button>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl text-slate-600 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {`Ciao [Nome Ospite],

Grazie per aver scelto la nostra casa per il tuo soggiorno a [Città]! Confermo di aver ricevuto la tua prenotazione per le date [Date].

Troverai tutte le informazioni per il check-in, la password del WiFi e i nostri consigli sui ristoranti della zona nella nostra Guida Digitale interattiva:
👉 [Link alla tua guida GuideHost]

Se hai domande prima dell'arrivo, sono a tua disposizione.

A presto,
[Il tuo nome]`}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><FileText className="text-blue-500"/> Promemoria Check-out (Sera Prima)</h3>
                <button className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  <Copy size={14}/> Copia
                </button>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl text-slate-600 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {`Ciao [Nome Ospite],

Spero tu stia passando un fantastico soggiorno! Ti scrivo solo per ricordarti che il check-out è previsto per domani alle ore [Orario]. 

Nella sezione "Check-out" della nostra guida digitale troverai le semplici istruzioni per chiudere la casa e lasciare le chiavi:
👉 [Link alla sezione Check-out]

Ti auguro una buona ultima serata a [Città]!`}
              </div>
            </div>

          </div>
        </section>

        <section className="bg-slate-900 py-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Vuoi automatizzare l'invio di questi messaggi?</h2>
          <p className="text-slate-400 mb-8">Con GuideHost, puoi integrare questi link direttamente nei tuoi template automatici su Airbnb.</p>
          <Link 
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-medium text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Inizia Ora
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
