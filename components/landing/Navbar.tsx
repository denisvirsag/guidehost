import Link from 'next/link'
import { Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-50',
        'bg-white/70 backdrop-blur-md border-b border-black/5',
        'transition-all duration-300'
      )}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF5A5F] to-[#ff8c8f] flex items-center justify-center shadow-lg shadow-[#FF5A5F]/20 group-hover:scale-105 transition-transform">
            <Home size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">GuideHost</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Accedi
          </Link>
          <Link 
            href="/signup" 
            className={cn(
              'relative inline-flex h-9 items-center justify-center rounded-full px-5 text-sm font-medium text-white shadow-sm',
              'bg-slate-900 hover:bg-slate-800 transition-colors',
              'overflow-hidden group'
            )}
          >
            <span className="relative z-10">Inizia gratis</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
