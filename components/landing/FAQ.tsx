import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: "Gli ospiti devono scaricare un'app?",
    a: "No. La guida si apre nel browser del telefono, come una normale pagina web. Nessuna installazione richiesta."
  },
  {
    q: "Funziona anche con Booking.com o Vrbo?",
    a: "Sì. GuideHost genera un semplice link che puoi inserire nei messaggi automatici di qualsiasi piattaforma."
  },
  {
    q: "Posso cancellare quando voglio?",
    a: "Assolutamente sì. Nessun vincolo, nessun costo di cancellazione."
  },
  {
    q: "Cosa succede se aggiorno le informazioni nella guida?",
    a: "Le modifiche sono istantanee. Il link e il QR code rimangono sempre gli stessi, senza bisogno di inviarli nuovamente agli ospiti."
  },
  {
    q: "Quanto tempo ci vuole per creare la prima guida?",
    a: "La maggior parte degli host completa la prima guida in meno di 10 minuti grazie alla nostra interfaccia intuitiva."
  }
]

export function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Domande Frequenti
          </h2>
        </div>
        
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details key={i} className="group border-b border-slate-200 pb-4">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-lg text-slate-900 hover:text-[#FF5A5F] py-4 transition-colors">
                <span>{faq.q}</span>
                <span className="transition group-open:rotate-180">
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                </span>
              </summary>
              <p className="text-slate-600 text-base leading-relaxed mt-2 pb-2">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
