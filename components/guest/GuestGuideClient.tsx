'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, ExternalLink, Wifi, ChevronDown, ChevronUp, Copy, Check, Phone, HelpCircle, FileText, CheckSquare, Compass, Info, Home } from 'lucide-react'
import type { Property, Guide, GuideSection } from '@/types'
import { usePostHog } from 'posthog-js/react'

const TRANSLATIONS = {
  it: {
    welcome: 'Benvenuto',
    wifi: 'Connessione WiFi',
    tapToCopy: 'Tocca per copiare',
    copied: 'Copiato!',
    network: 'Nome Rete',
    password: 'Password',
    openMaps: 'Apri in Google Maps',
    checkin: 'Orario Check-in',
    checkout: 'Orario Check-out',
    faq: 'Domande Frequenti',
    emergency: 'Contatti di Emergenza',
    rules: 'Regole della Casa',
    recommendations: 'Consigli Locali',
    poweredBy: 'Creata con ❤️ su',
    checklist: 'Check-out Checklist',
    instructions: 'Istruzioni',
  },
  en: {
    welcome: 'Welcome',
    wifi: 'WiFi Connection',
    tapToCopy: 'Tap to copy',
    copied: 'Copied!',
    network: 'Network Name',
    password: 'Password',
    openMaps: 'Open in Google Maps',
    checkin: 'Check-in Time',
    checkout: 'Check-out Time',
    faq: 'Frequently Asked Questions',
    emergency: 'Emergency Contacts',
    rules: 'House Rules',
    recommendations: 'Local Tips',
    poweredBy: 'Created with ❤️ on',
    checklist: 'Check-out Checklist',
    instructions: 'Instructions',
  },
  es: {
    welcome: 'Bienvenido',
    wifi: 'Conexión WiFi',
    tapToCopy: 'Toca para copiar',
    copied: '¡Copiado!',
    network: 'Nombre de Red',
    password: 'Contraseña',
    openMaps: 'Abrir in Google Maps',
    checkin: 'Hora de Entrada',
    checkout: 'Hora de Salida',
    faq: 'Preguntas Frecuentes',
    emergency: 'Contactos de Emergencia',
    rules: 'Reglas de la Casa',
    recommendations: 'Consejos Locales',
    poweredBy: 'Creado con ❤️ en',
    checklist: 'Check-out Checklist',
    instructions: 'Instrucciones',
  },
  fr: {
    welcome: 'Bienvenue',
    wifi: 'Connexion WiFi',
    tapToCopy: 'Appuyer pour copier',
    copied: 'Copié !',
    network: 'Nom du Réseau',
    password: 'Mot de passe',
    openMaps: 'Ouvrir dans Google Maps',
    checkin: 'Heure d\'Arrivée',
    checkout: 'Heure de Départ',
    faq: 'Questions Fréquentes',
    emergency: 'Contacts d\'Urgence',
    rules: 'Règles de la Maison',
    recommendations: 'Recommandations',
    poweredBy: 'Créé avec ❤️ sur',
    checklist: 'Check-out Checklist',
    instructions: 'Instructions',
  },
  de: {
    welcome: 'Willkommen',
    wifi: 'WiFi Verbindung',
    tapToCopy: 'Tippen zum Kopieren',
    copied: 'Kopiert!',
    network: 'Netzwerkname',
    password: 'Passwort',
    openMaps: 'In Google Maps öffnen',
    checkin: 'Check-in Zeit',
    checkout: 'Check-out Zeit',
    faq: 'Häufig gestellte Fragen',
    emergency: 'Notfallkontakte',
    rules: 'Hausregeln',
    recommendations: 'Empfehlungen',
    poweredBy: 'Erstellt mit ❤️ auf',
    checklist: 'Check-out Checklist',
    instructions: 'Anleitung',
  }
}

type Lang = 'it' | 'en' | 'es' | 'fr' | 'de'

interface Props {
  property: Property
  guide: Guide
  sections: GuideSection[]
  initialLang?: Lang
}

export default function GuestGuideClient({ property, guide, sections, initialLang = 'it' }: Props) {
  const posthog = usePostHog()
  const router = useRouter()
  const [lang, setLang] = useState<Lang>(initialLang)
  const [wifiExpanded, setWifiExpanded] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang)
    const params = new URLSearchParams(window.location.search)
    params.set('lang', newLang)
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  useEffect(() => {
    // Traccia la visualizzazione della guida quando il componente viene montato
    posthog.capture('guide_viewed', { 
      property_id: property.id, 
      property_name: property.name,
      guide_id: guide.id 
    })
  }, [posthog, property.id, property.name, guide.id])

  const isDark = guide.theme === 'dark'
  const accent = guide.accent_color || '#FF5A5F'
  const t = TRANSLATIONS[lang]

  // Separate the welcome section to show it as the main header description if it exists
  const welcomeSection = sections.find(s => s.type === 'welcome')
  const otherSections = sections.filter(s => s.type !== 'welcome')

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    posthog.capture('guest_wifi_copied', {
      field,
      guide_id: guide.id,
      property_id: property.id,
    })
    setTimeout(() => setCopiedField(null), 2000)
  }

  const toggleSection = (id: string) => {
    const isCurrentlyExpanded = !!expandedSections[id]
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }))
    if (!isCurrentlyExpanded) {
      const section = sections.find(s => s.id === id)
      posthog.capture('guest_section_expanded', {
        section_id: id,
        section_type: section?.type,
        section_title: section?.title,
        guide_id: guide.id,
        property_id: property.id,
      })
    }
  }

  // Theme-specific styles
  const bgClass = isDark ? 'bg-[#0D0D11] text-slate-100' : 'bg-slate-50 text-slate-900'
  const cardClass = isDark
    ? 'bg-slate-900/60 backdrop-blur-md border border-white/5 shadow-xl rounded-2xl'
    : 'bg-white border border-slate-200/80 shadow-sm rounded-2xl'
  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500'
  const dividerClass = isDark ? 'border-white/5' : 'border-slate-100'

  const flags: { code: Lang; flag: string; label: string }[] = [
    { code: 'it', flag: '🇮🇹', label: 'Italiano' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  ]

  return (
    <div className={`min-h-screen ${bgClass} font-sans pb-16`}>
      {/* Max Container - Split view on large screens, single column on mobile */}
      <div className="max-w-6xl mx-auto px-4 pt-4 md:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Hero, Welcome, Title, Address & Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className={`${cardClass} overflow-hidden`}>
              {/* Cover Image Banner */}
              <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-800">
                {property.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={property.cover_image_url}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-500/20 to-slate-800 flex items-center justify-center">
                    <Home className="w-16 h-16 opacity-30" style={{ color: accent }} />
                  </div>
                )}
                {/* Gradient overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                {/* Flags Language Selector - Top overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-10">
                  {flags.map((f) => (
                    <button
                      key={f.code}
                      onClick={() => handleLangChange(f.code)}
                      className={`text-lg transition-transform duration-200 hover:scale-125 ${
                        lang === f.code ? 'scale-110 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={f.label}
                    >
                      {f.flag}
                    </button>
                  ))}
                </div>

                {/* Welcome Capsule / Pill overlay */}
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white flex items-center gap-1">
                    🏠 {t.welcome}
                  </span>
                </div>

                {/* Title & Address Overlay at bottom of image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 drop-shadow-sm">
                    {property.name}
                  </h1>
                  {property.address && (
                    <p className="text-xs md:text-sm text-slate-200/90 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                      {property.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Welcome/Intro text (from Welcome section content if available) */}
              <div className="p-6">
                {welcomeSection ? (
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {(welcomeSection.content.text as string) || ''}
                  </p>
                ) : (
                  <p className="text-sm md:text-base leading-relaxed text-slate-400 italic">
                    Benvenuto nella nostra casa! Abbiamo preparato questa guida digitale per rendere il tuo soggiorno il più piacevole e confortevole possibile.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Map & WiFi (Highlighted / Quick Access) & Custom sections */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Map Section Card */}
            {sections.some(s => s.type === 'map') && (
              <div className={`${cardClass} p-5 space-y-4`}>
                {sections.filter(s => s.type === 'map').map(mapS => {
                  const c = mapS.content as { address?: string; link?: string }
                  return (
                    <div key={mapS.id} className="space-y-4">
                      {/* Stylized Grid Map Mockup */}
                      <div className="relative h-40 w-full rounded-xl bg-slate-900 overflow-hidden border border-white/5 flex items-center justify-center">
                        {/* Map Grid Pattern */}
                        <div className="absolute inset-0 opacity-15 pointer-events-none" 
                          style={{
                            backgroundImage: `
                              linear-gradient(to right, #475569 1px, transparent 1px),
                              linear-gradient(to bottom, #475569 1px, transparent 1px)
                            `,
                            backgroundSize: '24px 24px'
                          }}
                        />
                        {/* Decorative map streets and shapes */}
                        <div className="absolute top-1/4 left-0 w-full h-3 bg-slate-800/40 transform -rotate-12" />
                        <div className="absolute top-0 left-1/3 w-4 h-full bg-slate-800/40 transform rotate-12" />
                        <div className="absolute top-1/2 left-0 w-full h-4 bg-slate-800/30 transform rotate-45" />
                        <div className="absolute top-10 left-10 w-24 h-16 bg-blue-500/10 rounded-full blur-xl" />
                        <div className="absolute bottom-6 right-16 w-32 h-20 bg-emerald-500/10 rounded-full blur-xl" />

                        {/* Pinging Marker */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="absolute -top-1 w-8 h-8 rounded-full animate-ping opacity-35" style={{ backgroundColor: accent }} />
                          <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-slate-900">
                            <MapPin className="w-5 h-5" style={{ color: accent }} />
                          </div>
                        </div>
                      </div>

                      {/* Map info */}
                      <div className="flex flex-col gap-3">
                        <div className="text-sm font-medium">
                          {c.address || property.address || 'Posizione della struttura'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(c.link || c.address || property.address) && (
                            <a
                              href={c.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address || property.address || '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => posthog.capture('guest_map_opened', { provider: 'google', guide_id: guide.id, property_id: property.id })}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 text-center flex-1 sm:flex-none"
                              style={{ backgroundColor: accent }}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Google Maps
                            </a>
                          )}
                          {(c.address || property.address) && (
                            <a
                              href={`https://maps.apple.com/?q=${encodeURIComponent(c.address || property.address || '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => posthog.capture('guest_map_opened', { provider: 'apple', guide_id: guide.id, property_id: property.id })}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 text-center flex-1 sm:flex-none border"
                              style={{
                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                color: isDark ? '#fff' : '#1A1A24',
                                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                              }}
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              {lang === 'it' ? 'Mappe (Apple)' : 'Apple Maps'}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* WiFi Details Card */}
            {sections.some(s => s.type === 'wifi') && (
              <div className={`${cardClass} overflow-hidden`}>
                {sections.filter(s => s.type === 'wifi').map(wifiS => {
                  const c = wifiS.content as { network?: string; password?: string }
                  const net = c.network || ''
                  const pass = c.password || ''

                  return (
                    <div key={wifiS.id}>
                      {/* Accordion Header */}
                      <button
                        onClick={() => setWifiExpanded(!wifiExpanded)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-500/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}15` }}>
                            <Wifi className="w-5 h-5" style={{ color: accent }} />
                          </div>
                          <div>
                            <h3 className="font-bold text-base">{t.wifi}</h3>
                            <p className={`text-xs ${textMutedClass}`}>{t.tapToCopy}</p>
                          </div>
                        </div>
                        {wifiExpanded ? <ChevronUp className="w-5 h-5 opacity-60" /> : <ChevronDown className="w-5 h-5 opacity-60" />}
                      </button>

                      {/* Accordion Content */}
                      {wifiExpanded && (
                        <div className={`px-5 pb-5 pt-1 border-t ${dividerClass} space-y-3`}>
                          {/* Network Name Field */}
                          {net && (
                            <div
                              onClick={() => handleCopy(net, 'net')}
                              className="group p-3 rounded-xl bg-slate-500/5 hover:bg-slate-500/10 border border-slate-500/5 hover:border-slate-500/10 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
                            >
                              <div className="space-y-0.5">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${textMutedClass}`}>{t.network}</span>
                                <div className="font-semibold text-sm select-all">{net}</div>
                              </div>
                              <div className="w-7 h-7 rounded-lg bg-slate-500/10 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                                {copiedField === 'net' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          )}

                          {/* Network Password Field */}
                          {pass && (
                            <div
                              onClick={() => handleCopy(pass, 'pass')}
                              className="group p-3 rounded-xl bg-slate-500/5 hover:bg-slate-500/10 border border-slate-500/5 hover:border-slate-500/10 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
                            >
                              <div className="space-y-0.5">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${textMutedClass}`}>{t.password}</span>
                                <div className="font-mono font-bold text-sm select-all">{pass}</div>
                              </div>
                              <div className="w-7 h-7 rounded-lg bg-slate-500/10 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                                {copiedField === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          )}

                          {copiedField && (
                            <div className="text-center text-xs font-semibold text-emerald-500 animate-pulse">
                              {t.copied}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: Other guide cards in a responsive grid */}
        {otherSections.filter(s => s.type !== 'map' && s.type !== 'wifi').length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-bold px-1">{t.instructions}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherSections.filter(s => s.type !== 'map' && s.type !== 'wifi').map((section) => {
                const isExpanded = !!expandedSections[section.id]
                const icon = section.icon || getSectionIcon(section.type)
                
                return (
                  <div key={section.id} className={`${cardClass} overflow-hidden transition-all duration-200`}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-500/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl shrink-0">{icon}</span>
                        <h3 className="font-bold text-sm md:text-base leading-snug">{section.title}</h3>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 opacity-60" /> : <ChevronDown className="w-4 h-4 opacity-60" />}
                    </button>

                    {isExpanded && (
                      <div className={`p-5 pt-1 border-t ${dividerClass} text-sm leading-relaxed ${textMutedClass}`}>
                        <SectionContentDetail section={section} accent={accent} isDark={isDark} dividerClass={dividerClass} textMutedClass={textMutedClass} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Powered By Footer */}
        <footer className="text-center mt-12 py-6 border-t border-slate-500/10 text-xs opacity-50">
          {t.poweredBy}{' '}
          <a href="/" className="font-semibold hover:underline" style={{ color: accent }}>
            GuideHost
          </a>
        </footer>
      </div>
    </div>
  )
}

function getSectionIcon(type: string): string {
  switch (type) {
    case 'welcome': return '👋'
    case 'wifi': return '📶'
    case 'checkin': return '🔑'
    case 'rules': return '📋'
    case 'how_to': return '📖'
    case 'map': return '📍'
    case 'recommendations': return '🍽️'
    case 'emergency': return '🚨'
    case 'faq': return '❓'
    case 'gallery': return '🖼️'
    case 'checkout_checklist': return '☑️'
    default: return '📄'
  }
}

// Sub-component to render the details of each custom section
function SectionContentDetail({ section, accent, isDark, dividerClass, textMutedClass }: { 
  section: GuideSection; 
  accent: string; 
  isDark: boolean;
  dividerClass: string;
  textMutedClass: string;
}) {
  // Cast content to any to allow simple property access in JS/JSX
  const c = section.content as any

  switch (section.type) {
    case 'checkin':
      return (
        <div className="space-y-4">
          <div className="flex gap-4">
            {typeof c.checkin === 'string' && c.checkin && (
              <div className="flex-1 text-center p-3 rounded-xl border" style={{ borderColor: `${accent}20`, backgroundColor: `${accent}05` }}>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Check-in</p>
                <p className="text-lg font-bold mt-0.5" style={{ color: accent }}>{c.checkin}</p>
              </div>
            )}
            {typeof c.checkout === 'string' && c.checkout && (
              <div className="flex-1 text-center p-3 rounded-xl border" style={{ borderColor: `${accent}20`, backgroundColor: `${accent}05` }}>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Check-out</p>
                <p className="text-lg font-bold mt-0.5" style={{ color: accent }}>{c.checkout}</p>
              </div>
            )}
          </div>
          {typeof c.instructions === 'string' && c.instructions && (
            <div className="pt-2 text-xs leading-relaxed whitespace-pre-wrap">
              {c.instructions}
            </div>
          )}
        </div>
      )

    case 'rules':
    case 'checkout_checklist': {
      const items = (c.rules || c.items || []) as string[]
      if (!items.length) return <p className="italic opacity-50">Nessuna regola impostata.</p>
      return (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5 items-start">
              <span className="text-base shrink-0 select-none" style={{ color: accent }}>
                {section.type === 'checkout_checklist' ? '☐' : '•'}
              </span>
              <span className="text-xs md:text-sm">{item}</span>
            </li>
          ))}
        </ul>
      )
    }

    case 'emergency': {
      const contacts = (c.contacts || []) as Array<{ label: string; number: string }>
      if (!contacts.length) return <p className="italic opacity-50">Nessun contatto di emergenza.</p>
      return (
        <div className="space-y-2.5">
          {contacts.map((contact, i) => (
            <div key={i} className={`flex justify-between items-center p-2 rounded-lg bg-slate-500/5 border ${dividerClass}`}>
              <span className="text-xs font-semibold">{contact.label}</span>
              <a 
                href={`tel:${contact.number}`} 
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-white hover:scale-105 active:scale-95 transition-all"
                style={{ backgroundColor: accent }}
              >
                📞 {contact.number}
              </a>
            </div>
          ))}
        </div>
      )
    }

    case 'faq': {
      const items = (c.items || []) as Array<{ q: string; a: string }>
      if (!items.length) return <p className="italic opacity-50">Nessuna FAQ disponibile.</p>
      return (
        <div className="space-y-2.5">
          {items.map((item, i) => (
            <details key={i} className={`rounded-xl border ${dividerClass} overflow-hidden group`}>
              <summary className="p-3 font-semibold text-xs md:text-sm cursor-pointer list-none flex justify-between items-center bg-slate-500/5 hover:bg-slate-500/10 transition-colors">
                {item.q}
                <span className="text-base font-bold opacity-60 group-open:rotate-45 transition-transform duration-200">＋</span>
              </summary>
              <p className="p-3 text-xs md:text-sm leading-relaxed whitespace-pre-wrap border-t border-slate-500/5">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      )
    }

    case 'recommendations': {
      const items = (c.items || []) as Array<{ name: string; description: string; type: string }>
      const categoryEmoji: Record<string, string> = {
        'Ristorante': '🍽️', 'Bar': '☕', 'Supermercato': '🛒', 'Attrattiva': '🏛️',
        'Trasporto': '🚌', 'Farmacia': '💊', 'Altro': '📍'
      }
      if (!items.length) return <p className="italic opacity-50">Nessuna raccomandazione.</p>
      return (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className={`flex gap-3 p-3 rounded-xl bg-slate-500/5 border ${dividerClass}`}>
              <span className="text-xl shrink-0 select-none">{categoryEmoji[item.type] ?? '📍'}</span>
              <div className="space-y-1">
                <p className="font-bold text-xs md:text-sm">{item.name}</p>
                {item.type && <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accent}15`, color: accent }}>{item.type}</span>}
                {item.description && <p className="text-xs leading-relaxed mt-1">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'how_to': {
      const steps = (c.steps || []) as string[]
      if (!steps.length) return <p className="italic opacity-50">Nessuna istruzione.</p>
      return (
        <div className="space-y-3">
          {typeof c.device === 'string' && c.device && <p className="font-bold text-xs md:text-sm">{c.device}</p>}
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span 
                className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 text-white select-none mt-0.5" 
                style={{ backgroundColor: accent }}
              >
                {i + 1}
              </span>
              <p className="text-xs md:text-sm leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      )
    }

    case 'gallery': {
      const images = ((c.images || []) as string[]).filter(Boolean)
      if (!images.length) return null
      return (
        <div className="grid grid-cols-2 gap-2">
          {images.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden group rounded-xl border border-white/5 h-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={url} 
                alt={`gallery-${i}`} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            </a>
          ))}
        </div>
      )
    }

    default:
      return (
        <p className="whitespace-pre-wrap leading-relaxed text-xs md:text-sm">
          {c.text || ''}
        </p>
      )
  }
}
