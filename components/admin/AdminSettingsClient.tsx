'use client'

import { useState } from 'react'
import {
  Save,
  Key,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Layers,
  Settings,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Database
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdminSettings } from '@/app/actions/admin'

interface AdminSettingsClientProps {
  initialSettings: AdminSettings
}

export default function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const [settings, setSettings] = useState<AdminSettings>(initialSettings)
  const [originalSettings, setOriginalSettings] = useState<AdminSettings>(initialSettings)
  const [activeTab, setActiveTab] = useState<'general' | 'limits' | 'integrations'>('general')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  const isChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings)

  const handleInputChange = (field: keyof AdminSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const { saveAdminSettings } = await import('@/app/actions/admin')
      const res = await saveAdminSettings(settings)
      
      if (res.success) {
        setSuccessMessage('Impostazioni salvate correttamente nel database Supabase.')
        setOriginalSettings(settings)
        setTimeout(() => setSuccessMessage(null), 4000)
      } else {
        setErrorMessage(res.error || 'Impossibile salvare le impostazioni.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Errore imprevisto durante il salvataggio.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSettings(originalSettings)
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Impostazioni Piattaforma
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestisci le variabili globali, i limiti degli account e le chiavi delle integrazioni esterne.
          </p>
        </div>

        {isChanged && (
          <div className="flex items-center gap-2 shrink-0 animate-fade-in">
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 transition-colors cursor-pointer"
            >
              <Save size={14} />
              {loading ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm animate-slide-up">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm animate-slide-up">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Tabbed Settings Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[400px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-60 border-r border-slate-100 bg-slate-50/50 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all",
              activeTab === 'general'
                ? "bg-white text-indigo-600 shadow-sm border border-slate-100/60"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
            )}
          >
            <Sliders size={15} />
            Configurazione Generale
          </button>
          <button
            onClick={() => setActiveTab('limits')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all",
              activeTab === 'limits'
                ? "bg-white text-indigo-600 shadow-sm border border-slate-100/60"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
            )}
          >
            <Layers size={15} />
            Limiti & Piani (Stripe)
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all",
              activeTab === 'integrations'
                ? "bg-white text-indigo-600 shadow-sm border border-slate-100/60"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
            )}
          >
            <Database size={15} />
            Integrazioni (PostHog)
          </button>
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSave} className="flex-1 p-6 space-y-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Configurazione Generale</h3>
                <p className="text-xs text-slate-400 mt-0.5">Parametri base dell'applicazione visualizzati dagli host.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="appName" className="text-xs font-bold text-slate-700">
                    Nome dell'Applicazione
                  </label>
                  <input
                    type="text"
                    id="appName"
                    value={settings.appName}
                    onChange={(e) => handleInputChange('appName', e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50"
                    placeholder="E.g. GuideHost"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="supportEmail" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail size={12} className="text-slate-400" />
                    Email di Supporto
                  </label>
                  <input
                    type="email"
                    id="supportEmail"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50"
                    placeholder="E.g. supporto@guidehost.com"
                    required
                  />
                  <p className="text-[10px] text-slate-400">Utilizzata per inviare email di supporto ed avvisi di sistema.</p>
                </div>
              </div>
            </div>
          )}

          {/* Limits Tab */}
          {activeTab === 'limits' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Limiti & Piani Tariffari</h3>
                <p className="text-xs text-slate-400 mt-0.5">Controlla i vincoli degli account e i codici prezzo per la fatturazione Stripe.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="freeGuideLimit" className="text-xs font-bold text-slate-700">
                    Limite Guide (Piano Gratuito)
                  </label>
                  <input
                    type="number"
                    id="freeGuideLimit"
                    value={settings.freeGuideLimit}
                    onChange={(e) => handleInputChange('freeGuideLimit', parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50"
                    required
                  />
                  <p className="text-[10px] text-slate-400">Numero massimo di guide digitali che un host free può creare.</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="maxPhotosPerGuide" className="text-xs font-bold text-slate-700">
                    Limite Foto per Guida
                  </label>
                  <input
                    type="number"
                    id="maxPhotosPerGuide"
                    value={settings.maxPhotosPerGuide}
                    onChange={(e) => handleInputChange('maxPhotosPerGuide', parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50"
                    required
                  />
                  <p className="text-[10px] text-slate-400">Numero massimo di immagini consentito in ciascuna guida.</p>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="stripePremiumPriceId" className="text-xs font-bold text-slate-700">
                    ID Prezzo Stripe Premium (Pro Plan)
                  </label>
                  <input
                    type="text"
                    id="stripePremiumPriceId"
                    value={settings.stripePremiumPriceId}
                    onChange={(e) => handleInputChange('stripePremiumPriceId', e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50 font-mono"
                    placeholder="E.g. price_1O..."
                    required
                  />
                  <p className="text-[10px] text-slate-400">L'ID del prezzo ricorrente creato nel portale Stripe per l'abbonamento Pro.</p>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Chiavi di Integrazione PostHog</h3>
                <p className="text-xs text-slate-400 mt-0.5">Credenziali necessarie per connettersi a PostHog per i replay e statistiche.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="posthogProjectId" className="text-xs font-bold text-slate-700">
                      PostHog Project ID
                    </label>
                    <input
                      type="text"
                      id="posthogProjectId"
                      value={settings.posthogProjectId}
                      onChange={(e) => handleInputChange('posthogProjectId', e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50 font-mono"
                      placeholder="E.g. 185383"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="posthogHost" className="text-xs font-bold text-slate-700">
                      PostHog Host URL
                    </label>
                    <input
                      type="url"
                      id="posthogHost"
                      value={settings.posthogHost}
                      onChange={(e) => handleInputChange('posthogHost', e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50 font-mono"
                      placeholder="E.g. https://eu.posthog.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="posthogApiKey" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>PostHog Personal API Key (Chiave Privata)</span>
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-[10px] text-indigo-500 hover:text-indigo-600 font-bold flex items-center gap-1"
                    >
                      {showApiKey ? (
                        <>
                          <EyeOff size={10} /> Nascondi
                        </>
                      ) : (
                        <>
                          <Eye size={10} /> Mostra
                        </>
                      )}
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      id="posthogApiKey"
                      value={settings.posthogApiKey}
                      onChange={(e) => handleInputChange('posthogApiKey', e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 bg-slate-50/50 font-mono"
                      placeholder="phx_..."
                      required
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={14} />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">Questa chiave è salvata crittografata ed è utilizzata solo lato server.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Row for Tab Footer (hidden on larger layout if header buttons visible) */}
          {isChanged && (
            <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3 md:hidden">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 transition-colors"
              >
                <Save size={14} />
                {loading ? 'Salvataggio...' : 'Salva'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
