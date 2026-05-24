'use client'

import Link from 'next/link'
import { Home, Menu, X, ChevronDown, Smartphone, Key, QrCode, Map, Star, FileText, HelpCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function MegaMenuNavbar() {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on click outside or leave
  useEffect(() => {
    const handleMouseLeave = () => setActiveDropdown(null)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const navItems = [
    {
      id: 'project',
      label: 'Il Progetto',
      items: [
        { title: "Il Manifesto dell'Ospitalità", desc: "La nostra filosofia di accoglienza", href: "/manifesto", icon: Star, color: "text-amber-500", bg: "bg-amber-100" },
        { title: "La Nostra Storia", desc: "Creato da host per host", href: "/storia", icon: Home, color: "text-blue-500", bg: "bg-blue-100" },
      ]
    },
    {
      id: 'solution',
      label: 'La Soluzione',
      items: [
        { title: "Guestbook Digitale Interattivo", desc: "Guida ottimizzata per smartphone", href: "/funzionalita/guestbook", icon: Smartphone, color: "text-indigo-500", bg: "bg-indigo-100" },
        { title: "Check-in Autonomo Visivo", desc: "Istruzioni chiare con foto", href: "/funzionalita/self-check-in", icon: Key, color: "text-rose-500", bg: "bg-rose-100" },
        { title: "Smart QR Code Kit", desc: "Accesso immediato alla casa", href: "/funzionalita/qr-code", icon: QrCode, color: "text-slate-700", bg: "bg-slate-200" },
        { title: "Consigli Locali & Mappe", desc: "Ristoranti e servizi utili", href: "/funzionalita/mappe", icon: Map, color: "text-teal-500", bg: "bg-teal-100" },
      ]
    },
    {
      id: 'resources',
      label: 'Risorse & Academy',
      items: [
        { title: "Guida alle 5 Stelle", desc: "Ottimizza il tuo annuncio", href: "/risorse/guida-5-stelle", icon: Star, color: "text-amber-500", bg: "bg-amber-100" },
        { title: "Template Messaggi", desc: "Copia e incolla i migliori", href: "/risorse/template", icon: FileText, color: "text-blue-500", bg: "bg-blue-100" },
        { title: "Centro Supporto", desc: "Configura in 10 minuti", href: "/supporto", icon: HelpCircle, color: "text-purple-500", bg: "bg-purple-100" },
      ]
    }
  ]

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        hasScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-black/5 shadow-sm h-16'
          : 'bg-transparent h-20'
      )}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF5A5F] to-[#ff8c8f] flex items-center justify-center shadow-lg shadow-[#FF5A5F]/20 group-hover:scale-105 transition-transform">
            <Home size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">GuideHost</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setActiveDropdown(category.id)}
            >
              <button 
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  activeDropdown === category.id ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {category.label}
                <ChevronDown size={14} className={cn("transition-transform duration-200", activeDropdown === category.id ? "rotate-180" : "")} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === category.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden",
                      category.id === 'solution' ? "w-[560px]" : "w-[340px]"
                    )}
                  >
                    <div className={cn(
                      "p-4",
                      category.id === 'solution' ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"
                    )}>
                      {category.items.map((item, idx) => (
                        <Link 
                          key={idx} 
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className={cn("mt-0.5 p-2 rounded-lg transition-colors", item.bg)}>
                            <item.icon size={18} className={item.color} />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#FF5A5F] transition-colors">{item.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <Link href="/#pricing" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Tariffe
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 z-50">
          <Link 
            href="/login" 
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Accedi
          </Link>
          <Link 
            href="/signup" 
            className="relative inline-flex h-9 items-center justify-center rounded-full px-5 text-sm font-medium text-white shadow-sm bg-slate-900 hover:bg-slate-800 transition-all hover:-translate-y-0.5 group overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Inizia gratis
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 p-2 -mr-2 text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed inset-0 top-0 bg-white z-40 flex flex-col pt-20 px-6 overflow-y-auto pb-10"
          >
            <div className="flex flex-col gap-6 flex-1">
              {navItems.map((category) => (
                <div key={category.id} className="border-b border-slate-100 pb-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{category.label}</h3>
                  <div className="flex flex-col gap-4">
                    {category.items.map((item, idx) => (
                      <Link 
                        key={idx} 
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3"
                      >
                        <div className={cn("p-2 rounded-lg", item.bg)}>
                          <item.icon size={18} className={item.color} />
                        </div>
                        <span className="text-base font-semibold text-slate-900">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-900 py-2 border-b border-slate-100">
                Tariffe
              </Link>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center rounded-xl border border-slate-200 text-slate-700 font-semibold"
              >
                Accedi
              </Link>
              <Link 
                href="/signup" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-2"
              >
                Inizia gratis <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}
