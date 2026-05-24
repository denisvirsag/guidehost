'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Plus, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { checkPropertyLimit } from '@/app/actions/properties'

interface NewPropertyButtonProps {
  label?: string
  className?: string
  variant?: 'primary' | 'outline' | 'empty' | 'custom'
  children?: React.ReactNode
}

export default function NewPropertyButton({
  label = 'Nuova proprietà',
  className = '',
  variant = 'primary',
  children,
}: NewPropertyButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [limitData, setLimitData] = useState({ plan: '', limit: 1 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = async () => {
    setLoading(true)
    const { reachedLimit, limit, plan } = await checkPropertyLimit()
    setLoading(false)

    if (reachedLimit) {
      setLimitData({ limit, plan })
      setShowLimitModal(true)
    } else {
      router.push('/dashboard/properties/new')
    }
  }

  let buttonClass = className
  if (!className && variant !== 'custom') {
    if (variant === 'primary') {
      buttonClass = "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FF5A5F] px-4 text-xs font-semibold text-white shadow-md shadow-[#FF5A5F]/15 hover:bg-[#E04950] transition-colors self-start sm:self-auto"
    } else if (variant === 'outline') {
      buttonClass = "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 text-xs font-semibold text-slate-700 shadow-sm transition-colors self-start sm:self-auto"
    } else if (variant === 'empty') {
      buttonClass = "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FF5A5F] px-5 text-xs font-semibold text-white shadow-md shadow-[#FF5A5F]/15 hover:bg-[#E04950] transition-colors mt-6"
    }
  }

  return (
    <>
      <button onClick={handleClick} disabled={loading} className={buttonClass}>
        {children ? children : (
          <>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {label}
          </>
        )}
      </button>

      {/* Modal */}
      {showLimitModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-4">
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
            style={{ animation: 'scaleIn 0.2s ease-out forwards' }}
          >
            <button 
              onClick={() => setShowLimitModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center text-center mt-2">
              <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Hai raggiunto il limite
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Il tuo piano <strong className="text-slate-700 capitalize">{limitData.plan}</strong> ti permette di gestire un massimo di <strong className="text-slate-700">{limitData.limit}</strong> {limitData.limit === 1 ? 'proprietà' : 'proprietà'}.
                Passa a un piano superiore per aggiungere nuove strutture.
              </p>
              
              <div className="flex flex-col w-full gap-2">
                <Link 
                  href="/dashboard/settings/billing" 
                  className="btn btn-primary w-full justify-center"
                  onClick={() => setShowLimitModal(false)}
                >
                  Aggiorna il piano
                </Link>
                <button 
                  onClick={() => setShowLimitModal(false)}
                  className="btn btn-ghost w-full justify-center"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
