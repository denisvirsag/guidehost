'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { cn } from '@/lib/utils'

interface DashboardLayoutWrapperProps {
  children: React.ReactNode
  plan: string
  userName: string
}

export default function DashboardLayoutWrapper({ children, plan, userName }: DashboardLayoutWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), [])
  const openMenu = useCallback(() => setIsMobileMenuOpen(true), [])

  const isGuideEditor = pathname.startsWith('/dashboard/guides/') && pathname.split('/').length === 4

  return (
    <div className="flex min-h-[100dvh] w-full bg-slate-50/50">
      {/* Sidebar Navigation */}
      <Sidebar
        plan={plan}
        userName={userName}
        isOpen={isMobileMenuOpen}
        onClose={closeMenu}
      />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden touch-none"
          onPointerDown={closeMenu}
        />
      )}

      {/* BRUTAL TEST OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-red-500 z-[9999] flex items-center justify-center flex-col gap-4">
          <h1 className="text-white text-4xl font-bold">MENU APERTO!</h1>
          <button onClick={closeMenu} className="bg-white text-red-500 px-6 py-3 rounded-xl font-bold">CHIUDI</button>
        </div>
      )}

      {/* Main Dashboard Container */}
      <div className="flex flex-col flex-1 min-w-0 md:pl-64 min-h-[100dvh]">
        <Topbar
          breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }]}
          onMenuClick={openMenu}
        />
        <main className={cn(
          "p-4 pb-24 md:p-8 flex-1",
          isGuideEditor && "p-0 h-[calc(100dvh-64px)] overflow-hidden flex flex-col"
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}
