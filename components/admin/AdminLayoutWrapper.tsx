'use client'

import { useEffect, useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

interface AdminLayoutWrapperProps {
  children: React.ReactNode
  adminName: string
}

export default function AdminLayoutWrapper({ children, adminName }: AdminLayoutWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), [])
  const openMenu = useCallback(() => setIsMobileMenuOpen(true), [])

  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Admin Dashboard', href: '/admin' }]
    if (pathname === '/admin/users') {
      crumbs.push({ label: 'Utenti', href: '/admin/users' })
    } else if (pathname === '/admin/replays') {
      crumbs.push({ label: 'Session Replay', href: '/admin/replays' })
    } else if (pathname === '/admin/settings') {
      crumbs.push({ label: 'Impostazioni', href: '/admin/settings' })
    }
    return crumbs
  }

  return (
    <div className="flex min-h-[100dvh] w-full bg-slate-50/50">
      {/* Sidebar Navigation */}
      <AdminSidebar
        adminName={adminName}
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

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 md:pl-64 min-h-[100dvh]">
        <AdminTopbar
          breadcrumb={getBreadcrumbs()}
          onMenuClick={openMenu}
        />
        <main className="p-4 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
