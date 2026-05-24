'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import {
  ShieldAlert,
  Users,
  Video,
  Settings,
  LogOut,
  Activity
} from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: Activity, exact: true },
  { href: '/admin/users', label: 'Utenti', icon: Users },
  { href: '/admin/replays', label: 'Session Replay', icon: Video },
]

const BOTTOM_ITEMS = [
  { href: '/admin/settings', label: 'Impostazioni', icon: Settings, exact: true },
]

interface AdminSidebarProps {
  adminName?: string
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ adminName = 'Admin', isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const closeBtnRef = useRef<HTMLButtonElement>(null)

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
    return (pathname.startsWith(href) && href !== '/admin')
      || (href === '/admin' && pathname === '/admin')
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 flex h-[100dvh] w-64 flex-col border-r border-slate-200/60 bg-slate-900 transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo / Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        <Link href="/admin" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
            <ShieldAlert size={16} />
          </div>
          <span className="font-bold text-white tracking-tight text-base">Admin Panel</span>
        </Link>

        {/* Mobile close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          type="button"
          className="flex md:hidden items-center justify-center text-slate-400 w-10 h-10 rounded-xl"
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
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Gestione
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
                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800 border-transparent"
                )}
              >
                <item.icon
                  size={17}
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400"
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Sistema
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
                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800 border-transparent"
                )}
              >
                <item.icon
                  size={17}
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400"
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-slate-800 p-4 bg-slate-900/50">
        <div className="flex items-center gap-3 px-1">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0">
            {adminName ? adminName[0].toUpperCase() : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate leading-none mb-1">{adminName}</p>
            <p className="text-[10px] text-indigo-400 font-medium capitalize leading-none">Superadmin</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
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
