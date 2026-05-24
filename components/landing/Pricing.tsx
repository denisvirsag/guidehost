'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import posthog from 'posthog-js'

const PLANS = [
  {
    name: 'Free',
    price: 0,
    description: 'Per testare il servizio con un solo alloggio',
    features: ['1 guida ospiti attiva', 'Fino a 5 sezioni utili', 'QR code per l\'ingresso', 'Link condivisibile'],
    cta: 'Inizia gratis',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 9,
    description: 'Per host attivi che gestiscono più alloggi',
    features: ['Fino a 5 guide ospiti', 'Sezioni e contenuti illimitati', 'QR code vettoriale per la stampa', 'Verifica degli accessi degli ospiti', 'Colori personalizzati per la guida', 'Supporto prioritario via email'],
    cta: 'Prova gratis Pro per 14 giorni',
    href: '/signup?plan=pro',
    highlight: true,
  },
  {
    name: 'Business',
    price: 29,
    description: 'Per property manager e agenzie',
    features: ['Guide ospiti illimitate', 'Tutto incluso del piano Pro', 'Rilascio senza marchio GuideHost', 'Statistiche di visualizzazione avanzate', 'Assistenza dedicata via telefono'],
    cta: 'Parla con noi',
    href: '/signup?plan=business',
    highlight: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-20 bg-white relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Prezzi semplici e trasparenti
          </h2>
          <p className="text-base text-slate-600">
            Inizia gratis, scala quando sei pronto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col p-6 rounded-2xl bg-white border",
                plan.highlight 
                  ? "border-[#FF5A5F]/40 shadow-xl shadow-[#FF5A5F]/5 md:scale-[1.03] z-10" 
                  : "border-slate-200 shadow-sm"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                  <span className="bg-[#FF5A5F] text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full">
                    Più Popolare
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-medium text-slate-500 mb-1">{plan.description}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">€{plan.price}</span>
                  <span className="text-slate-500 text-sm font-medium">/mese</span>
                </div>
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                onClick={() => posthog.capture('pricing_plan_clicked', { plan_name: plan.name, plan_price: plan.price })}
                className={cn(
                  "w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-center transition-colors duration-200",
                  plan.highlight
                    ? "bg-[#FF5A5F] hover:bg-[#E04950] text-white shadow-md shadow-[#FF5A5F]/15"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
