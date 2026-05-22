'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF5A5F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          {/* 404 Number with gradient */}
          <span className="text-9xl font-black tracking-tighter bg-gradient-to-br from-[#FF5A5F] via-[#ff787b] to-violet-500 bg-clip-text text-transparent select-none">
            404
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', duration: 0.8 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Pagina non trovata
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            La pagina che stai cercando non esiste più, oppure l'indirizzo inserito è errato.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Torna indietro
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FF5A5F] px-5 text-xs font-semibold text-white shadow-md shadow-[#FF5A5F]/15 hover:bg-[#E04950] transition-colors"
          >
            <Home size={14} />
            Vai alla Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
