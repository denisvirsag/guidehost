import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FinalCTA() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden text-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-900" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Inizia stasera. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A5F] to-[#ff8c8f]">
            Dormi meglio già domani.
          </span>
        </h2>
        
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Unisciti a 800+ host italiani che hanno smesso di rispondere alle stesse domande.
        </p>

        <Link
          href="/signup"
          className={cn(
            "group relative inline-flex items-center justify-center h-14 px-8 text-lg font-semibold text-white rounded-full overflow-hidden",
            "bg-[#FF5A5F] hover:bg-[#e04e53] transition-colors shadow-xl shadow-[#FF5A5F]/20"
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            Crea la tua guida gratis
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
        
        <p className="mt-6 text-sm text-slate-400">
          Nessuna carta di credito · Prova gratuita 14 giorni · Cancelli quando vuoi
        </p>
      </div>
    </section>
  )
}
