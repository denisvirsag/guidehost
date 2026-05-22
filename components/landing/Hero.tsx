import Link from 'next/link'
import { ChevronRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="relative min-h-[75vh] lg:min-h-[600px] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF5A5F]/10 via-white to-white" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] md:w-[600px] md:h-[300px] bg-[#FF5A5F]/15 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
          <Star className="w-3.5 h-3.5 text-[#FF5A5F] fill-[#FF5A5F]" />
          <span className="text-xs md:text-sm font-medium text-slate-700">Ottieni più recensioni a 5 stelle su Airbnb e Booking</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-5 leading-[1.15]">
          Fai trovare ai tuoi ospiti il WiFi, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A5F] to-[#ff8c8f]">
            le regole e le istruzioni in un link
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Evita di rispondere ogni giorno alle stesse domande prima del check-in o a tarda notte. I tuoi ospiti trovano subito quello che cercano e tu risparmi ore di messaggi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className={cn(
              "group relative inline-flex items-center justify-center h-11 px-6 text-sm md:text-base font-semibold text-white rounded-full overflow-hidden",
              "bg-slate-900 hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/10"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              Crea la tua prima guida gratis
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center h-11 px-6 text-sm md:text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm"
          >
            Scopri i vantaggi
          </Link>
        </div>

        <p className="mt-5 text-xs md:text-sm text-slate-500">
          Nessuna carta di credito richiesta · Prova gratuita di 14 giorni
        </p>
      </div>
    </section>
  )
}
