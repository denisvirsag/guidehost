'use client'

import { useState } from 'react'
import {
  PlaySquare,
  Monitor,
  Smartphone,
  Clock,
  ArrowRight,
  X,
  ExternalLink,
  Lock,
  RefreshCw,
  AlertTriangle,
  Key,
  Video
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionReplay } from '@/components/admin/AdminOverviewClient'

interface AdminReplaysClientProps {
  initialReplays: SessionReplay[]
}

export default function AdminReplaysClient({ initialReplays }: AdminReplaysClientProps) {
  const [replays, setReplays] = useState<SessionReplay[]>(initialReplays)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReplay, setSelectedReplay] = useState<SessionReplay | null>(null)
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [loadingReplay, setLoadingReplay] = useState(false)
  const [replayError, setReplayError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<'AUTH_ERROR' | 'POSTHOG_RESTRICTION' | 'UNKNOWN' | null>(null)

  const handleWatchReplay = async (replay: SessionReplay) => {
    setIsModalOpen(true)
    setSelectedReplay(replay)
    setLoadingReplay(true)
    setReplayError(null)
    setErrorType(null)
    setEmbedUrl(null)
    
    try {
      const { getReplayEmbedUrl } = await import('@/app/actions/admin')
      const result = await getReplayEmbedUrl(replay.id)
      if (result.success && result.url) {
        setEmbedUrl(result.url)
      } else {
        setErrorType(result.errorType || 'UNKNOWN')
        if (result.errorType === 'AUTH_ERROR') {
          setReplayError('Credenziali PostHog non valide o non configurate.')
        } else if (result.errorType === 'POSTHOG_RESTRICTION') {
          setReplayError('Restrizione API PostHog: Condivisione automatica disabilitata.')
        } else {
          setReplayError('Impossibile generare il link per il replay.')
        }
      }
    } catch (err) {
      console.error(err)
      setReplayError('Errore durante il caricamento del replay.')
      setErrorType('UNKNOWN')
    } finally {
      setLoadingReplay(false)
    }
  }

  const handleRetry = () => {
    if (selectedReplay) {
      handleWatchReplay(selectedReplay)
    }
  }

  const getFlagEmoji = (countryCode?: string) => {
    if (!countryCode || countryCode === 'XX' || countryCode === 'Sconosciuto') return '🏳️'
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0))
      return String.fromCodePoint(...codePoints)
    } catch (e) {
      return '🏳️'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Session Replay
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Analizza il comportamento degli utenti registrati e anonimi tramite le registrazioni delle sessioni.
        </p>
      </div>

      {/* Replays Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <Video size={18} className="text-indigo-500" />
            <span className="font-bold text-sm">Tutte le Registrazioni Recenti</span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{replays.length} Registrazioni trovate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-white text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="p-4 font-semibold">Utente</th>
                <th className="p-4 font-semibold">Località</th>
                <th className="p-4 font-semibold">Dispositivo</th>
                <th className="p-4 font-semibold">Dettagli</th>
                <th className="p-4 font-semibold text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {replays.length > 0 ? (
                replays.map((replay) => (
                  <tr key={replay.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0", replay.avatarColor)}>
                          {replay.user === 'Anonimo' ? '?' : replay.user.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-slate-800 truncate">{replay.user}</span>
                          <span className="text-xs text-slate-400">{replay.timeAgo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none" title={replay.countryCode}>
                          {getFlagEmoji(replay.countryCode)}
                        </span>
                        <span className="text-sm text-slate-600">{replay.country}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600" title={replay.browser && replay.os ? `${replay.browser} su ${replay.os}` : undefined}>
                        {replay.device === 'desktop' ? <Monitor size={16} className="shrink-0" /> : <Smartphone size={16} className="shrink-0" />}
                        <div className="flex flex-col">
                          <span className="text-sm capitalize leading-none">{replay.device}</span>
                          {replay.browser && (
                            <span className="text-[10px] text-slate-400 font-medium leading-none mt-1">
                              {replay.browser} {replay.os ? `(${replay.os})` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-400" />
                          {replay.duration}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5">{replay.events} eventi</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleWatchReplay(replay)}
                        disabled={replay.replayUrl === '#'}
                        className={cn(
                          "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                          replay.replayUrl !== '#' 
                            ? "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        )}
                      >
                        <PlaySquare size={14} className={replay.replayUrl !== '#' ? "fill-indigo-200" : "fill-slate-200"} />
                        Guarda Replay
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    Nessuna registrazione disponibile. Assicurati che PostHog catturi le sessioni.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Replay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => {
              setIsModalOpen(false)
              setSelectedReplay(null)
              setEmbedUrl(null)
            }}
          />
          
          {/* Modal Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col z-10">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0", selectedReplay?.avatarColor)}>
                  {selectedReplay?.user === 'Anonimo' ? '?' : selectedReplay?.user.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Replay Sessione: {selectedReplay?.user}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedReplay?.duration} • {selectedReplay?.events} eventi • {selectedReplay?.timeAgo}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedReplay(null)
                  setEmbedUrl(null)
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Player Container */}
            <div className="bg-slate-950 flex-1 relative flex items-center justify-center min-h-[500px]">
              {loadingReplay && (
                <div className="flex flex-col items-center gap-4 text-slate-400">
                  <div className="relative flex h-12 w-12 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500/30 opacity-75"></span>
                    <div className="relative inline-flex rounded-full h-10 w-10 bg-indigo-600/90 items-center justify-center shadow-lg shadow-indigo-500/50">
                      <RefreshCw className="animate-spin text-white" size={20} />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-sm font-semibold text-white tracking-wide block">Recupero del replay...</span>
                    <span className="text-xs text-slate-400 block">Abilitazione del link di condivisione sicuro in corso</span>
                  </div>
                </div>
              )}
              
              {!loadingReplay && replayError && (
                <div className="w-full max-w-2xl px-6 py-8 text-slate-200">
                  {errorType === 'POSTHOG_RESTRICTION' ? (
                    <div className="space-y-6">
                      {/* Badge / Icon */}
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/5">
                          <Lock size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">
                            Condivisione Esterna Necessaria (PostHog Restrizione)
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            PostHog vieta l'attivazione automatica della condivisione via API per le chiavi personali.
                          </p>
                        </div>
                      </div>

                      {/* Instructions Card */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 backdrop-blur-md">
                        <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                          Segui questi passaggi rapidi per visualizzare il replay qui:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                              <span className="h-5 w-5 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                1
                              </span>
                              <p className="text-slate-300 leading-relaxed">
                                Clicca su <strong className="text-white">Apri su PostHog</strong> per visualizzare la registrazione nel loro portale.
                              </p>
                            </div>
                            <div className="flex gap-3 items-start">
                              <span className="h-5 w-5 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                2
                              </span>
                              <p className="text-slate-300 leading-relaxed">
                                Nel player in alto a destra, fai clic sul pulsante <strong className="text-white">Share</strong> (Condividi).
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                              <span className="h-5 w-5 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                3
                              </span>
                              <p className="text-slate-300 leading-relaxed">
                                Attiva l'opzione <strong className="text-white">Public Link</strong> (Link Pubblico) impostandola su ON.
                              </p>
                            </div>
                            <div className="flex gap-3 items-start">
                              <span className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                4
                              </span>
                              <p className="text-slate-300 leading-relaxed">
                                Torna in questa schermata e clicca sul pulsante <strong className="text-indigo-400">Verifica e Riproduci</strong>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        {selectedReplay?.replayUrl && (
                          <a
                            href={selectedReplay.replayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
                          >
                            <ExternalLink size={14} />
                            1. Apri Registrazione su PostHog
                          </a>
                        )}
                        <button
                          onClick={handleRetry}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all cursor-pointer"
                        >
                          <RefreshCw size={14} />
                          2. Verifica e Riproduci
                        </button>
                      </div>
                    </div>
                  ) : errorType === 'AUTH_ERROR' ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/5">
                          <Key size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">
                            Configurazione PostHog Incompleta o Errata
                          </h4>
                          <p className="text-xs text-rose-400 mt-0.5">
                            Le credenziali fornite non consentono di dialogare con l'API di PostHog.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3 backdrop-blur-md text-xs text-slate-300">
                        <p className="font-semibold text-rose-400">Verifica i seguenti parametri nel tuo file d'ambiente (.env.local):</p>
                        <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                          <li>
                            <strong className="text-white">POSTHOG_PROJECT_ID</strong>: Assicurati che coincida con l'ID del tuo progetto PostHog.
                          </li>
                          <li>
                            <strong className="text-white">POSTHOG_PERSONAL_API_KEY</strong>: Controlla che la chiave inizi con <code className="bg-white/10 px-1 py-0.5 rounded text-white">phx_</code> e sia valida.
                          </li>
                          <li>
                            <strong className="text-white">Ambito (Scope)</strong>: Assicurati che la chiave API personale creata su PostHog abbia i permessi di lettura per <code className="bg-white/10 px-1 py-0.5 rounded text-white">session_recording:read</code>.
                          </li>
                        </ul>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={handleRetry}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20"
                        >
                          <RefreshCw size={14} />
                          Riprova caricamento
                        </button>
                        {selectedReplay?.replayUrl && (
                          <a
                            href={selectedReplay.replayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
                          >
                            <ExternalLink size={14} />
                            Apri comunque su PostHog
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 text-center py-6">
                      <div className="mx-auto h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/5">
                        <AlertTriangle size={24} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-base font-bold text-white">
                          Errore di Caricamento
                        </h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          {replayError || 'Si è verificato un errore imprevisto durante il recupero del replay.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 pt-4">
                        <button
                          onClick={handleRetry}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20"
                        >
                          <RefreshCw size={14} />
                          Riprova
                        </button>
                        {selectedReplay?.replayUrl && (
                          <a
                            href={selectedReplay.replayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
                          >
                            <ExternalLink size={14} />
                            Apri su PostHog
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {embedUrl && !loadingReplay && !replayError && (
                <iframe 
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                />
              )}
            </div>
            
            {/* Footer */}
            {selectedReplay && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <span className="text-slate-500 font-medium">
                  Nota: per motivi di sicurezza, PostHog potrebbe richiedere l'accesso in alcune sessioni.
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  {selectedReplay.replayUrl && selectedReplay.replayUrl !== '#' && (
                    <a 
                      href={selectedReplay.replayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:underline animate-pulse"
                    >
                      Apri in PostHog <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
