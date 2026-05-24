import { MegaMenuNavbar } from '@/components/landing/MegaMenuNavbar'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import { 
  QrCode, 
  RefreshCw, 
  Globe, 
  ShieldCheck, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Wifi, 
  BookOpen, 
  MapPin, 
  MessageSquare,
  Sparkles,
  Smartphone,
  Home
} from 'lucide-react'

export const metadata = {
  title: 'Funzionalità | GuideHost',
  description: 'Tutte le funzionalità di GuideHost: QR code intelligenti, traduzione automatica, aggiornamenti istantanei e molto altro.',
}

export default function FunzionalitaPage() {
  const features = [
    {
      icon: QrCode,
      title: 'Smart QR Code Kit',
      desc: 'Genera codici QR personalizzati da stampare e appendere in casa. Gli ospiti li inquadrano e accedono all\'istante senza installare nulla.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: RefreshCw,
      title: 'Aggiornamenti Istantanei',
      desc: 'Cambia la password del WiFi o gli orari di checkout dal pannello di controllo. La guida degli ospiti si aggiorna in tempo reale in un secondo.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: Globe,
      title: 'Traduzione Automatica',
      desc: 'Scrivi in italiano e GuideHost traduce automaticamente la guida nella lingua del telefono dell\'ospite (inglese, tedesco, francese, ecc.).',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: ShieldCheck,
      title: 'Verifica Accessi',
      desc: 'Ricevi una notifica o controlla le statistiche per sapere quando l\'ospite ha aperto la guida per la prima volta. Meno ansia da check-in.',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      icon: Share2,
      title: 'Condivisione Automatica',
      desc: 'Invia il link web della guida tramite messaggi automatici su Airbnb, Booking o WhatsApp con un semplice copia e incolla.',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
  ]

  const comparisons = [
    {
      aspect: 'Condivisione delle informazioni',
      withoutGH: 'PDF giganti via email o fogli stampati e sgualciti sparsi per casa.',
      withGH: 'Un link elegante pre-arrivo e un QR Code adesivo all\'ingresso.',
      status: false,
    },
    {
      aspect: 'Modifica dati (es. password WiFi)',
      withoutGH: 'Ristamparla, plastificarla e rimetterla in casa ad ogni cambio.',
      withGH: 'Aggiornamento dal telefono in 5 secondi, istantaneo per tutti.',
      status: true,
    },
    {
      aspect: 'Ospiti internazionali',
      withoutGH: 'Frustrazione nel tradurre o spiegare tutto in 3 lingue diverse.',
      withGH: 'Traduzione automatica nativa integrata basata sul browser.',
      status: true,
    },
    {
      aspect: 'Supporto ospite',
      withoutGH: 'Chiamate a mezzanotte per chiedere dove sono le stoviglie o come si accende l\'AC.',
      withGH: 'Istruzioni visive con foto e video passo-passo disponibili 24/7.',
      status: true,
    },
    {
      aspect: 'Sicurezza ed Accessi',
      withoutGH: 'Nessun modo di sapere se l\'ospite ha letto le regole prima di entrare.',
      withGH: 'Notifica e tracking delle visualizzazioni per prevenire problemi.',
      status: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FF5A5F]/20 selection:text-[#FF5A5F]">
      <MegaMenuNavbar />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5A5F]/20 bg-[#FF5A5F]/5 px-4 py-1.5 text-xs font-semibold text-[#FF5A5F] mb-6">
            <Sparkles size={12} className="fill-[#FF5A5F]" /> Le Funzionalità di GuideHost
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Progettato per cancellare le domande ripetitive.
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            La guida ospiti digitale che azzera i dubbi dei tuoi ospiti e aumenta le tue recensioni a 5 stelle.
          </p>
        </section>

        {/* Feature Grid */}
        <section className="bg-slate-50 py-24 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Ogni strumento utile, in un unico link
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                Tutto quello che serve ai tuoi ospiti per vivere un soggiorno perfetto, organizzato in un'interfaccia premium.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div 
                  key={i} 
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                      <f.icon className={`w-6 h-6 ${f.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{f.desc}</p>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Incluso in tutti i piani
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Mockup Preview */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  <Smartphone size={14} /> Esperienza Mobile Ottimizzata
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                  Una web app splendida, senza download richiesti.
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  L'ospite inquadra il QR code o fa clic sul link e la guida si apre all'istante nel browser del suo telefono. Funziona come un'app nativa ma non richiede alcuna installazione.
                </p>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Nessuna barriera d'ingresso</h4>
                      <p className="text-sm text-slate-600">Niente username, password o app da scaricare dall'App Store.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Caricamento fulmineo</h4>
                      <p className="text-sm text-slate-600">Ottimizzato per caricarsi all'istante anche con connessioni mobili 3G/4G.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* HTML/CSS Phone Mockup */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative mx-auto border-[10px] border-slate-950 rounded-[44px] h-[600px] w-[300px] bg-slate-50 shadow-2xl overflow-hidden flex flex-col">
                  {/* Speaker and Notch */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 flex items-center justify-center z-30">
                    <div className="w-20 h-3.5 bg-slate-950 rounded-b-xl absolute top-0" />
                  </div>

                  {/* App Screen Container */}
                  <div className="flex-1 flex flex-col pt-6 overflow-hidden">
                    {/* App Header */}
                    <div className="p-4 bg-gradient-to-br from-[#FF5A5F] to-[#ff7d81] text-white flex flex-col gap-1">
                      <div className="text-xs opacity-80 uppercase tracking-widest font-bold">BENVENUTO A</div>
                      <h3 className="text-base font-extrabold tracking-tight">Villa Bella Vista</h3>
                      <div className="text-[10px] bg-white/20 rounded-full px-2 py-0.5 self-start mt-1 flex items-center gap-1">
                        <MapPin size={8} /> Firenze, Italia
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                      {/* WiFi Section Card */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <Wifi size={16} />
                          <h4 className="text-xs font-bold uppercase tracking-wider">Connessione Wi-Fi</h4>
                        </div>
                        <div className="text-xs space-y-1">
                          <div><span className="text-slate-400">Rete:</span> <span className="font-semibold text-slate-800">BellaVista_Guest</span></div>
                          <div><span className="text-slate-400">Password:</span> <span className="font-mono bg-slate-50 px-1 py-0.5 rounded font-semibold text-slate-800">firenze2026</span></div>
                        </div>
                      </div>

                      {/* Guide Section Card */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-rose-600">
                          <BookOpen size={16} />
                          <h4 className="text-xs font-bold uppercase tracking-wider">Regole della Casa</h4>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-1.5">
                          <p>• Checkout entro le 10:00</p>
                          <p>• Si prega di differenziare i rifiuti</p>
                          <p>• Silenzio dalle 22:00 alle 08:00</p>
                        </div>
                      </div>

                      {/* Map Section Card */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <MapPin size={16} />
                          <h4 className="text-xs font-bold uppercase tracking-wider">Consigli Locali</h4>
                        </div>
                        <div className="text-[11px] space-y-1.5">
                          <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg">
                            <span className="font-medium text-slate-800">Trattoria Mario</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded font-bold">150m</span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg">
                            <span className="font-medium text-slate-800">Farmacia Comunale</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded font-bold">400m</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav Bar of Phone */}
                    <div className="h-14 bg-white border-t border-slate-100 flex items-center justify-around px-4">
                      <div className="flex flex-col items-center gap-0.5 text-[#FF5A5F]">
                        <Home size={16} />
                        <span className="text-[9px] font-bold">Home</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 text-slate-400">
                        <MapPin size={16} />
                        <span className="text-[9px] font-medium">Mappa</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 text-slate-400">
                        <MessageSquare size={16} />
                        <span className="text-[9px] font-medium">Contatto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Before / After Comparison */}
        <section className="bg-slate-900 text-white py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                La differenza si vede al primo soggiorno
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Confronta la gestione degli ospiti tradizionale con quella ottimizzata di GuideHost.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="grid grid-cols-12 bg-slate-800 p-4 font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
                <div className="col-span-4">Aspetto</div>
                <div className="col-span-4 text-rose-400">Senza GuideHost</div>
                <div className="col-span-4 text-emerald-400">Con GuideHost</div>
              </div>
              
              <div className="divide-y divide-slate-800">
                {comparisons.map((c, i) => (
                  <div key={i} className="grid grid-cols-12 p-6 text-sm gap-4">
                    <div className="col-span-12 md:col-span-4 font-semibold text-slate-200">
                      {c.aspect}
                    </div>
                    <div className="col-span-12 md:col-span-4 text-slate-400 flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{c.withoutGH}</span>
                    </div>
                    <div className="col-span-12 md:col-span-4 text-slate-300 flex items-start gap-2 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{c.withGH}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-12 md:p-16 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF5A5F]/10 blur-[100px] rounded-full pointer-events-none" />
              
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                Pronto a fare il salto di qualità?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Niente carta, niente PDF persi. Solo recensioni eccellenti e ospiti felici. Crea la tua prima guida gratuita ora.
              </p>

              <Link 
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#FF5A5F] hover:bg-[#E04950] px-8 text-base font-semibold text-white shadow-lg shadow-[#FF5A5F]/20 transition-all hover:-translate-y-0.5 group"
              >
                Crea la tua guida gratis
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
