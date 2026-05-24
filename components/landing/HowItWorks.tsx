import { Link as LinkIcon, Edit3, Share2 } from 'lucide-react'

const STEPS = [
  {
    icon: Edit3,
    title: 'Aggiungi i dettagli',
    desc: 'Inserisci le informazioni di base (WiFi, regole, check-in). Usa i nostri template pronti per fare ancora prima.',
  },
  {
    icon: LinkIcon,
    title: 'Genera il link',
    desc: 'Con un clic GuideHost crea la pagina web dedicata alla tua struttura, bella da vedere e il QR code associato.',
  },
  {
    icon: Share2,
    title: 'Condividi con gli ospiti',
    desc: 'Invia il link nei messaggi automatici e appendi il QR code all\'ingresso. Hai finito.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Crea la tua guida in meno di 10 minuti
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Non serve alcuna competenza tecnica. Se sai usare lo smartphone, sai usare GuideHost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-slate-100" />
          
          {STEPS.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white border-[8px] border-slate-50 rounded-full flex items-center justify-center shadow-sm mb-6 relative z-10">
                <div className="w-16 h-16 bg-[#FF5A5F]/10 text-[#FF5A5F] rounded-full flex items-center justify-center">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
