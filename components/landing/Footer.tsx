import Link from 'next/link'
import { Home } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/60 py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Home size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">GuideHost</span>
        </div>
        
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} GuideHost. Tutti i diritti riservati.
        </p>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
          <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-900 transition-colors">Termini</Link>
        </div>
      </div>
    </footer>
  )
}
