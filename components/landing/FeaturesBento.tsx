import { Smartphone, QrCode, Zap, BarChart3, Globe, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: QrCode,
    title: 'QR code all\'ingresso',
    desc: 'Stampa il QR e appendi all\'ingresso. L\'ospite lo inquadra e accede subito a tutto, senza app da scaricare.',
    className: 'md:col-span-2 md:row-span-2',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Zap,
    title: 'Aggiornamenti istantanei',
    desc: 'Hai cambiato la password WiFi? Aggiorni la guida dal telefono in 10 secondi. Il link resta lo stesso.',
    className: 'md:col-span-1 md:row-span-1',
    color: 'bg-rose-100 text-[#FF5A5F]',
  },
  {
    icon: BarChart3,
    title: 'Verifica che l\'abbiano letto',
    desc: 'Traccia chi ha aperto la guida prima dell\'arrivo. Sai già che le istruzioni stradali sono state viste.',
    className: 'md:col-span-1 md:row-span-1',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Globe,
    title: 'Condivisione automatica',
    desc: 'Inserisci il link nei messaggi automatici di Airbnb o Booking. Gli ospiti lo ricevono subito dopo la prenotazione.',
    className: 'md:col-span-1 md:row-span-1',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Smartphone,
    title: 'Traduzione automatica',
    desc: 'GuideHost rileva la lingua dell\'ospite e traduce tutto in automatico. Il tedesco legge in tedesco, l\'inglese in inglese.',
    className: 'md:col-span-1 md:row-span-1',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: Shield,
    title: 'Zero manutenzione',
    desc: 'Nessun PDF da aggiornare e re-inviare. Ogni modifica è live all\'istante, così la tua guida è sempre perfetta e professionale.',
    className: 'md:col-span-1 md:row-span-1',
    color: 'bg-pink-100 text-pink-600',
  },
]

export function FeaturesBento() {
  return (
    <section id="features" className="py-16 md:py-20 bg-slate-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block text-sm font-bold text-[#FF5A5F] tracking-wider uppercase mb-2">La soluzione</div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Tutto quello che serve agli ospiti, in un link
          </h2>
          <p className="text-base text-slate-600">
            GuideHost crea una guida digitale professionale per il tuo alloggio. Condividila in automatico dopo ogni prenotazione.
          </p>
        </div>

        {/* 
          Using grid-rows-none on mobile so height adjusts to content,
          and a taller fixed row size on medium+ screens to fit text and mockup perfectly.
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[220px]">
          {FEATURES.map((feature) => {
            const isFeatured = feature.className.includes('md:col-span-2')

            if (isFeatured) {
              return (
                <div
                  key={feature.title}
                  className={cn(
                    "group relative bg-white border border-slate-200/60 rounded-2xl p-6 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row gap-6",
                    feature.className
                  )}
                >
                  <div className="flex-1 flex flex-col justify-between z-10">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-6 md:mb-0", feature.color)}>
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#FF5A5F] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>

                  {/* QR Code Stand Mockup on the right to fill space and look highly premium */}
                  <div className="hidden md:flex items-center justify-center w-[200px] relative overflow-hidden h-full shrink-0 select-none pointer-events-none">
                    <div className="flex flex-col items-center translate-y-3 transition-transform duration-500 group-hover:translate-y-1">
                      {/* Stand Frame */}
                      <div className="w-[120px] h-[140px] bg-slate-50 border border-slate-200 shadow-lg rounded-xl p-3 flex flex-col items-center justify-between text-center relative bg-gradient-to-b from-white to-slate-50">
                        {/* Acrylic reflection effect */}
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-tr from-white/0 via-white/20 to-white/40 rounded-t-xl" />
                        
                        {/* Frame Header */}
                        <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                          GuideHost
                        </div>

                        {/* QR Code Graphic */}
                        <div className="relative w-16 h-16 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-inner">
                          <QrCode size={48} className="text-slate-800" />
                          {/* Inner brand dot */}
                          <div className="absolute w-3.5 h-3.5 bg-[#FF5A5F] rounded-md border border-white flex items-center justify-center shadow-sm">
                            <div className="w-1 h-1 bg-white rounded-full" />
                          </div>
                        </div>

                        {/* Frame Footer */}
                        <div className="bg-slate-900 text-white text-[7px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
                          Scansiona Qui
                        </div>
                      </div>
                      
                      {/* Stand Base */}
                      <div className="w-[130px] h-[10px] bg-slate-800 rounded-lg shadow-md border-t border-slate-700/50" />
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )
            }

            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative bg-white border border-slate-200/60 rounded-2xl p-6 overflow-hidden hover:shadow-lg transition-shadow duration-300",
                  feature.className
                )}
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0", feature.color)}>
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-[#FF5A5F] transition-colors leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-4 md:line-clamp-3">
                      {feature.desc}
                    </p>
                  </div>
                </div>
                {/* Subtle hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
