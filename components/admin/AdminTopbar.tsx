'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface AdminTopbarProps {
  breadcrumb?: Array<{ label: string; href?: string }>
  onMenuClick?: () => void
}

export default function AdminTopbar({ breadcrumb, onMenuClick }: AdminTopbarProps) {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav || !onMenuClick) return

    function handleTouch(e: TouchEvent) {
      if (window.innerWidth >= 768) return
      const target = e.target as HTMLElement
      if (target.closest('a')) return
      e.preventDefault()
      e.stopPropagation()
      onMenuClick!()
    }

    nav.addEventListener('touchstart', handleTouch, { passive: false })
    return () => nav.removeEventListener('touchstart', handleTouch)
  }, [onMenuClick])

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/60 bg-white px-4 md:px-6">
      {/* Mobile Menu & Breadcrumb */}
      <nav ref={navRef} className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          type="button"
          className="flex md:hidden items-center justify-center text-slate-600 w-11 h-11 rounded-xl active:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-1.5 text-sm cursor-pointer md:cursor-auto active:opacity-70 md:active:opacity-100 transition-opacity" onClick={onMenuClick}>
          {breadcrumb?.map((item, i) => {
            const isLast = i === breadcrumb.length - 1
            return (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-300 select-none">/</span>}
                {item.href && !isLast ? (
                  <Link href={item.href} className="text-slate-400 hover:text-slate-700 transition-colors font-medium">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-800 font-semibold">{item.label}</span>
                )}
              </span>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
