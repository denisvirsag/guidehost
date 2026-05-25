'use client'

import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { useState } from 'react'
import { Check, ChevronDown, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function PrezziPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const plans = [
    {
      name: 'Free',
      description: 'Ideale per provare il servizio su un singolo alloggio',
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        '1 guida ospiti attiva',
        'Fino a 5 sezioni utili',
        'QR code per l\'ingresso',
        'Link web condivisibile',
        'Supporto standard via email',
      ],
      cta: 'Inizia gratis',
      href: '/signup',
      highlight: false,
    },
    {
      name: 'Pro',
      description: 'Perfetto per host singoli che vogliono automatizzare tutto',
      price: {
        monthly: 9,
        yearly: 7, // 84€ all'anno (risparmio di 24€ rispetto a 108€)
      },
      features: [
        'Fino a 5 guide ospiti attive',
        'Sezioni e contenuti illimitati',
        'QR code vettoriale ad alta definizione per la stampa',
        'Traduzione automatica multilingua',
        'Verifica degli accessi degli ospiti (Tracking)',
        'Colori personalizzati per riflettere il tuo brand',
        'Supporto prioritario via email (risposta < 12 ore)',
      ],
      cta: 'Inizia 14 giorni gratis',
      href: '/signup?plan=pro',
      highlight: true,
    },
    {
      name: 'Business',
      description: 'Progettato per property manager e agenzie con molti alloggi',
      price: {
        monthly: 29,
        yearly: 23, // 276€ all'anno (risparmio di 72€ rispetto a 348€)
      },
      features: [
        'Guide ospiti illimitate',
        'Tutte le funzionalità del piano Pro',
        'Rilascio white-label (nessun marchio GuideHost)',
        'Statistiche di visualizzazione avanzate e analitiche',
        'Integrazione API (prossimamente)',
        'Supporto email prioritario 24/7',
      ],
      cta: 'Parla con noi',
      href: '/signup?plan=business',
      highlight: false,
    },
  ]

  const faqs = [
    {
      q: 'Quali metodi di pagamento sono accettati?',
      a: 'Accettiamo tutte le principali carte di credito e di debito (Visa, Mastercard, American Express) tramite Stripe, il circuito di pagamento online più sicuro e diffuso al mondo.',
    },
    {
      q: 'Posso disdire il mio abbonamento in qualsiasi momento?',
      a: 'Assolutamente sì. Non ci sono contratti a lungo termine o vincoli. Puoi cancellare il tuo abbonamento con un clic direttamente dalle impostazioni di fatturazione del tuo account. Il servizio rimarrà attivo fino al termine del periodo pagato.',
    },
    {
      q: 'Come funziona il periodo di prova gratuito di 14 giorni?',
      a: 'Per il piano Pro puoi attivare una prova gratuita di 14 giorni. Non ti verrà addebitato alcun importo prima del termine della prova e puoi disdire in qualsiasi momento durante questi 14 giorni senza spendere un centesimo.',
    },
    {
      q: 'Offrite rimborsi se cambio idea?',
      a: 'Sì, se per qualsiasi motivo non sei soddisfatto del servizio, offriamo un rimborso completo entro 14 giorni dal primo addebito. Scrivici semplicemente a supporto@guidehost.it.',
    },
    {
      q: 'Cosa succede se supero il numero di guide consentito?',
      a: 'Se hai bisogno di gestire più alloggi di quelli previsti dal tuo piano attuale, riceverai una notifica che ti inviterà ad effettuare l\'upgrade al piano superiore. Non bloccheremo mai improvvisamente l\'accesso dei tuoi ospiti.',
    },
  ]

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />

      <main className="pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Piani chiari per host intelligenti.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Inizia gratis senza carta di credito. Scegli il piano più adatto alle tue esigenze e disdici quando vuoi, con un solo clic.
          </p>
        </section>

        {/* Toggle Periodo Fatturazione */}
        <section className="flex justify-center items-center gap-4 mb-16">
          <span className={cn(
            "text-sm font-semibold transition-colors",
            billingPeriod === 'monthly' ? "text-slate-900" : "text-slate-400"
          )}>
            Fatturazione mensile
          </span>
          
          <button 
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-slate-900 rounded-full p-1 transition-colors relative flex items-center"
          >
            <motion.div 
              layout 
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={cn(
                "w-6 h-6 bg-white rounded-full shadow-md",
                billingPeriod === 'yearly' ? "ml-6" : ""
              )} 
            />
          </button>

          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-semibold transition-colors",
              billingPeriod === 'yearly' ? "text-slate-900" : "text-slate-400"
            )}>
              Fatturazione annuale
            </span>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full">
              Risparmia 20%
            </span>
          </div>
        </section>

        {/* Griglia dei Piani */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {plans.map((plan) => {
              const currentPrice = billingPeriod === 'yearly' ? plan.price.yearly : plan.price.monthly
              const savedAmount = plan.price.monthly * 12 - plan.price.yearly * 12

              return (
                <div
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col p-8 rounded-3xl bg-white border transition-all duration-300",
                    plan.highlight 
                      ? "border-[#FF5A5F] shadow-xl shadow-[#FF5A5F]/5 md:scale-[1.03] z-10" 
                      : "border-slate-200 shadow-sm hover:border-slate-300"
                  )}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                      <span className="bg-[#FF5A5F] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                        Consigliato
                      </span>
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed min-h-[40px]">{plan.description}</p>
                    
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tight text-slate-900">
                        €{currentPrice}
                      </span>
                      <span className="text-slate-400 text-sm font-medium">/mese</span>
                    </div>

                    {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                      <p className="text-xs text-emerald-600 font-semibold mt-2">
                        Fatturato annualmente (€{plan.price.yearly * 12}/anno) — Risparmi €{savedAmount}
                      </p>
                    )}
                    {billingPeriod === 'yearly' && plan.price.yearly === 0 && (
                      <p className="text-xs text-slate-400 font-medium mt-2">
                        Sempre gratuito
                      </p>
                    )}
                    {billingPeriod === 'monthly' && plan.price.yearly > 0 && (
                      <p className="text-xs text-slate-400 font-medium mt-2">
                        Fatturato mese per mese
                      </p>
                    )}
                  </div>

                  <ul className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={cn(
                      "w-full py-3 px-4 rounded-2xl text-sm font-bold text-center transition-all duration-200",
                      plan.highlight
                        ? "bg-[#FF5A5F] hover:bg-[#E04950] text-white shadow-md shadow-[#FF5A5F]/15 hover:-translate-y-0.5"
                        : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 hover:-translate-y-0.5"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              )
            })}
          </div>
        </section>

        {/* Domande Frequenti Accordion */}
        <section className="bg-slate-50 py-24 border-y border-slate-100">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Domande Frequenti su Prezzi e Pagamenti</h2>
              <p className="text-slate-600">Hai qualche dubbio prima di iniziare? Trovi tutte le risposte qui.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="font-bold text-slate-900 text-base md:text-lg">{faq.q}</span>
                    <ChevronDown 
                      className={cn(
                        "w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0",
                        openFaqIndex === i ? "rotate-180 text-slate-900" : ""
                      )} 
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaqIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <div className="p-6 pt-0 border-t border-slate-50 text-slate-600 text-sm md:text-base leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner Finale */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-slate-900 text-white rounded-3xl p-12 md:p-16 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF5A5F]/10 blur-[100px] rounded-full pointer-events-none" />
              
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                Inizia gratis oggi
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
                Prova il piano Pro gratuitamente per 14 giorni. Nessun costo nascosto, cancelli online con un clic quando vuoi.
              </p>

              <Link 
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#FF5A5F] hover:bg-[#E04950] px-8 text-base font-semibold text-white shadow-lg shadow-[#FF5A5F]/20 transition-all hover:-translate-y-0.5 group"
              >
                Inizia ora
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
