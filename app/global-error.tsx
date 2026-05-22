'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, AlertCircle } from 'lucide-react'
import './globals.css' // Import styles for global-error since it replaces layout

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Unhandled global layout error:', error)
  }, [error])

  return (
    <html lang="it" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF5A5F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="flex justify-center"
          >
            {/* Error Icon badge */}
            <div className="h-16 w-16 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 flex items-center justify-center text-[#FF5A5F]">
              <AlertCircle size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', duration: 0.8 }}
            className="space-y-2"
          >
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Errore fatale di caricamento
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              Si è verificato un errore fatale nel caricamento del layout dell'applicazione.
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-slate-400 bg-slate-100/80 px-2 py-1 rounded inline-block mt-2">
                ID errore: {error.digest}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
            className="flex items-center justify-center pt-2"
          >
            <button
              onClick={() => reset()}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FF5A5F] px-6 text-xs font-semibold text-white shadow-md shadow-[#FF5A5F]/15 hover:bg-[#E04950] transition-colors"
            >
              <RotateCcw size={14} />
              Ricarica applicazione
            </button>
          </motion.div>
        </div>
      </body>
    </html>
  )
}
