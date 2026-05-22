'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import {
  Home,
  Building2,
  BookOpen,
  QrCode,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
  ChevronUp,
  Zap,
} from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: Home, exact: true },
  { href: '/dashboard/properties', label: 'Proprietà', icon: Building2 },
  { href: '/dashboard/guides', label: 'Guide', icon: BookOpen },
  { href: '/dashboard/qr-codes', label: 'QR Code', icon: QrCode },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
]

const BOTTOM_ITEMS = [
  { href: '/dashboard/settings', label: 'Impostazioni', icon: Settings, exact: true },
  { href: '/dashboard/settings/billing', label: 'Piano & Fatture', icon: CreditCard },
]

interface SidebarProps {
  plan?: string
  userName?: string
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ plan = 'free', userName, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Native touchstart on the close button to prevent Safari zoom and click delay
  useEffect(() => {
    const btn = closeBtnRef.current
    if (!btn) return
    function handleTouch(e: TouchEvent) {
      e.preventDefault()
      e.stopPropagation()
      onClose?.()
    }
    btn.addEventListener('touchstart', handleTouch, { passive: false })
    return () => btn.removeEventListener('touchstart', handleTouch)
  }, [onClose])
  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return (pathname.startsWith(href) && href !== '/dashboard')
      || (href === '/dashboard' && pathname === '/dashboard')
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 flex h-[100dvh] w-64 flex-col border-r border-slate-200/60 bg-white transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo / Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF5A5F] to-[#ff8c8f] text-white shadow-lg shadow-[#FF5A5F]/20">
            <Home size={16} />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-base">GuideHost</span>
        </Link>

        {/* Mobile close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose} // Fallback for standard clicks
          type="button"
          className="flex md:hidden items-center justify-center text-slate-500 w-10 h-10 rounded-xl"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Group */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Principale
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                  active
                    ? "bg-[#FF5A5F]/5 text-[#FF5A5F] border-[#FF5A5F]/15 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                )}
              >
                <item.icon
                  size={17}
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-[#FF5A5F]" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Account Group */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Account
          </p>
          {BOTTOM_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                  active
                    ? "bg-[#FF5A5F]/5 text-[#FF5A5F] border-[#FF5A5F]/15 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                )}
              >
                <item.icon
                  size={17}
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-[#FF5A5F]" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/50">
        {plan === 'free' && (
          <Link
            href="/dashboard/settings/billing"
            className="group flex items-center gap-3 p-3 bg-gradient-to-br from-[#FF5A5F]/5 to-[#ff8c8f]/10 border border-[#FF5A5F]/10 rounded-xl hover:border-[#FF5A5F]/20 transition-all duration-300"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
              <Zap size={13} className="fill-white/20" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#FF5A5F]">Passa a Pro</p>
              <p className="text-[10px] text-slate-500 truncate">Sblocca tutto a €9/mese</p>
            </div>
            <ChevronUp size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform rotate-90" />
          </Link>
        )}

        <div className="flex items-center gap-3 px-1">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF5A5F] to-[#ff8c8f] flex items-center justify-center font-bold text-white text-xs shadow-sm ring-2 ring-white/50 shrink-0">
            {userName ? userName[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate leading-none mb-1">{userName ?? 'Utente'}</p>
            <p className="text-[10px] text-slate-400 font-medium capitalize leading-none">Piano {plan}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Esci"
            >
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
