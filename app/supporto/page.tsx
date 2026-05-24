'use client'

import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { useState } from 'react'
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  ArrowLeft, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles,
  LifeBuoy,
  User,
  BookOpen,
  CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function SupportoPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'account' | 'guide' | 'pagamenti'>('all')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  
  // Contact Form States
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [plan, setPlan] = useState('free')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
      setPlan('free')
    }, 1200)
  }

  const faqCategories = [
    { id: 'all', label: 'Tutte le domande', icon: LifeBuoy },
    { id: 'account', label: 'Account & Accesso', icon: User },
    { id: 'guide', label: 'Creazione Guide & QR', icon: BookOpen },
    { id: 'pagamenti', label: 'Fatturazione & Piani', icon: CreditCard },
  ]

  const faqs = [
    {
      category: 'account',
      q: 'Come faccio a creare un account su GuideHost?',
      a: 'Creare un account è facilissimo. Clicca su "Inizia gratis" in alto a destra, inserisci la tua email e scegli una password. Potrai configurare la tua prima guida ospite in meno di 10 minuti.',
    },
    {
      category: 'account',
      q: 'Posso cambiare la mia password o email in seguito?',
      a: 'Sì, puoi aggiornare le tue credenziali di accesso in qualsiasi momento direttamente all\'interno della sezione "Impostazioni" della tua area riservata (Dashboard).',
    },
    {
      category: 'guide',
      q: 'Come stampo il QR code per la casa?',
      a: 'All\'interno della tua dashboard, nella sezione "QR Code", troverai il pulsante per scaricare il codice associato alla tua guida in formato immagine ad alta risoluzione (PNG) o vettoriale (SVG) perfetto per la stampa professionale da appendere.',
    },
    {
      category: 'guide',
      q: 'Gli ospiti devono installare un\'applicazione?',
      a: 'No, GuideHost è una Web App. Gli ospiti devono semplicemente inquadrare il QR code con la fotocamera dello smartphone o cliccare sul link ricevuto. La guida si aprirà direttamente nel loro browser preferito senza rallentamenti.',
    },
    {
      category: 'pagamenti',
      q: 'Posso disdire l\'abbonamento quando voglio?',
      a: 'Sì, non c\'è alcun vincolo contrattuale o durata minima. Puoi decidere di annullare il rinnovo automatico in qualunque momento con un solo clic dal tuo account nella sezione Impostazioni > Fatturazione.',
    },
    {
      category: 'pagamenti',
      q: 'Fornite fatture fiscali italiane?',
      a: 'Certamente. Ad ogni pagamento Stripe genera automaticamente una ricevuta. Se inserisci la tua Partita IVA e i dati di fatturazione nelle impostazioni, riceverai la fattura elettronica ad ogni ciclo di rinnovo.',
    },
  ]

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory)

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />

      <main className="pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Come possiamo aiutarti?
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Trova le risposte alle domande più frequenti o contatta direttamente il nostro team di supporto. Siamo qui per te.
          </p>
        </section>

        {/* Categorie FAQ */}
        <section className="max-w-5xl mx-auto px-6 mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any)
                  setOpenFaqIndex(null)
                }}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all",
                  activeCategory === cat.id
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                )}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* FAQ Accordion List */}
        <section className="max-w-3xl mx-auto px-6 mb-24">
          <div className="space-y-4">
            {filteredFaqs.map((faq, i) => (
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
        </section>

        {/* Canali di Contatto & Form */}
        <section className="bg-slate-50 py-20 border-y border-slate-100 mb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-16">
              
              {/* Canali di Contatto */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Non hai trovato la risposta?</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Siamo a tua disposizione attraverso canali veloci e pronti a risolvere qualsiasi dubbio.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Mail size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Email di Supporto</h4>
                      <p className="text-sm text-slate-500 mt-0.5">Scrivici in ogni momento</p>
                      <a href="mailto:supporto@guidehost.it" className="text-sm font-semibold text-blue-600 hover:underline block mt-2">
                        supporto@guidehost.it
                      </a>
                    </div>
                  </div>

                  {/* Chat */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                      <MessageCircle size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Live Chat</h4>
                      <p className="text-sm text-slate-500 mt-0.5">Supporto istantaneo dalla Dashboard</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Risposta in meno di 5 min
                      </span>
                    </div>
                  </div>

                  {/* Telefono */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                      <Phone size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Linea Dedicata Telefonica</h4>
                      <p className="text-sm text-slate-500 mt-0.5">Supporto vocale 24/7 per allarmi ed emergenze</p>
                      <span className="inline-flex items-center text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full mt-2">
                        Esclusivo per piano Business
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form di Contatto */}
              <div className="lg:col-span-7">
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Inviaci un messaggio diretto</h3>
                  
                  {isSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-8 text-center space-y-4"
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                      <h4 className="text-lg font-bold">Messaggio inviato con successo!</h4>
                      <p className="text-sm text-emerald-700">
                        Grazie per averci contattato. Il nostro team ti risponderà all'indirizzo email fornito nel minor tempo possibile.
                      </p>
                      <button 
                        onClick={() => setIsSuccess(false)}
                        className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
                      >
                        Invia un altro messaggio
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Il tuo nome"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 outline-none text-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nome@esempio.it"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 outline-none text-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Piano Attuale</label>
                        <select
                          value={plan}
                          onChange={(e) => setPlan(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 outline-none text-sm transition-all bg-white"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="business">Business</option>
                          <option value="non-ancora">Non sono ancora registrato</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Messaggio</label>
                        <textarea
                          required
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Come possiamo aiutarti oggi?"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 outline-none text-sm transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Ritorno alla Home */}
        <section className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Torna alla home
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  )
}
