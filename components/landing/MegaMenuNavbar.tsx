'use client'

import Link from 'next/link'
import { Home, Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function MegaMenuNavbar() {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Funzionalità', href: '/funzionalita' },
    { label: 'Prezzi', href: '/prezzi' },
    { label: 'Supporto', href: '/supporto' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        (hasScrolled || !isHome)
          ? 'bg-white/80 backdrop-blur-md border-b border-black/5 shadow-sm h-16'
          : 'bg-transparent h-20'
      )}
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
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 transition-all"
            >
              {item.label}
            </Link>
          ))}
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
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-semibold text-slate-900 py-3 border-b border-slate-100/80"
                >
                  {item.label}
                </Link>
              ))}
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
