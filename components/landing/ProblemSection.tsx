import { FileQuestion, MessageCircle, StarOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const PAIN_POINTS = [
  {
    icon: MessageCircle,
    title: 'Messaggi a mezzanotte',
    desc: '"Scusa, non riesco a trovare la password del WiFi" — alle 23:47 di un venerdì sera.',
  },
  {
    icon: FileQuestion,
    title: 'Le stesse domande, sempre',
    desc: 'WiFi, riscaldamento, parcheggio, orario di checkout. Rispondi 10 volte al giorno alle stesse cose.',
  },
  {
    icon: StarOff,
    title: 'Recensioni mancate per dettagli',
    desc: 'Un ospite confuso o un disguido evitabile si trasforma in un 4 stelle invece di 5.',
  },
]

export function ProblemSection() {
  return (
    <section id="why-guidehost" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative subtle gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF5A5F]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Ti riconosci in queste situazioni?
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Ogni host Airbnb affronta le stesse frustrazioni ogni giorno. Fino ad oggi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PAIN_POINTS.map((point, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-900/80 rounded-xl flex items-center justify-center mb-6 shadow-inner border border-slate-700/50">
                <point.icon className="w-6 h-6 text-[#FF5A5F]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{point.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
