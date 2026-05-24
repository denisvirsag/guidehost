'use client'

import Link from 'next/link'
import {
  Building2,
  BookOpen,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import NewPropertyButton from './NewPropertyButton'
import { cn } from '@/lib/utils'

interface Property {
  id: string
  name: string
  cover_image_url: string | null
  slug: string
  created_at: string
}

interface OverviewClientProps {
  firstName: string
  plan: string
  propertyCount: number
  guideCount: number
  publishedCount: number
  weeklyViews: number
  recentProperties: Property[]
}

export default function OverviewClient({
  firstName,
  plan,
  propertyCount,
  guideCount,
  publishedCount,
  weeklyViews,
  recentProperties
}: OverviewClientProps) {

  const stats = [
    {
      label: 'Proprietà totali',
      value: propertyCount,
      icon: Building2,
      color: 'bg-violet-50 text-violet-500 border-violet-100/50',
      href: '/dashboard/properties',
    },
    {
      label: 'Guide create',
      value: guideCount,
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-500 border-blue-100/50',
      href: '/dashboard/guides',
    },
    {
      label: 'Guide pubblicate',
      value: publishedCount,
      icon: Eye,
      color: 'bg-emerald-50 text-emerald-500 border-emerald-100/50',
      href: '/dashboard/guides',
    },
    {
      label: 'Visite (7 giorni)',
      value: weeklyViews,
      icon: TrendingUp,
      color: 'bg-[#FF5A5F]/5 text-[#FF5A5F] border-[#FF5A5F]/10',
      href: '/dashboard/analytics',
    },
  ]

  return (
    <div
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ciao, {firstName}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ecco un riepilogo della tua attività su GuideHost.
          </p>
        </div>
      </div>

      {/* Premium Upgrade Banner */}
      {plan === 'free' && (
        <div 
          className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-[#FF5A5F] via-[#FF5A5F] to-[#ff8c8f] text-white shadow-xl shadow-[#FF5A5F]/15 border border-[#FF5A5F]/20"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/25 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                Offerta Pro
              </span>
              <h2 className="text-lg font-bold">Passa a Pro e sblocca tutte le funzionalità</h2>
              <p className="text-white/80 text-xs mt-1 max-w-xl">
                Aggiungi fino a 5 proprietà, crea sezioni illimitate per le tue guide, accedi ad analytics avanzati e rimuovi il branding GuideHost a soli €9 al mese.
              </p>
            </div>
            <Link
              href="/dashboard/settings/billing"
              className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-white text-slate-900 hover:bg-slate-50 font-semibold text-xs shadow-md transition-colors shrink-0 group self-start md:self-center"
            >
              Passa a Pro
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {stats.map((stat) => (
          <div key={stat.label}>
            <Link
              href={stat.href}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-300 h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl border shrink-0", stat.color)}>
                  <stat.icon size={16} />
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 leading-none mb-1.5">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-slate-400">
                  {stat.label}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Main Grid Layout: Recent properties + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Recent properties */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Proprietà Recenti
            </h2>
            <Link 
              href="/dashboard/properties" 
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF5A5F] hover:text-[#E04950] transition-colors"
            >
              Vedi tutte
              <ArrowRight size={12} />
            </Link>
          </div>

          {recentProperties && recentProperties.length > 0 ? (
            <div 
              className="space-y-3"
            >
              {recentProperties.map((p) => (
                <div key={p.id}>
                  <Link
                    href={`/dashboard/properties/${p.id}`}
                    className="group flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200/80 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="relative h-11 w-11 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                      {p.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.cover_image_url}
                          alt={p.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-lg">🏠</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-[#FF5A5F] transition-colors">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        /g/{p.slug}
                      </p>
                    </div>
                    <div className="shrink-0 p-1.5 rounded-lg group-hover:bg-slate-50 transition-colors">
                      <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-slate-200 rounded-2xl text-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl mb-4 border border-slate-100">
                🏠
              </div>
              <h3 className="text-sm font-bold text-slate-800">Nessuna proprietà ancora</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Aggiungi la tua prima casa e crea la guida interattiva per i tuoi ospiti.
              </p>
              <NewPropertyButton variant="empty" label="Aggiungi proprietà" />
            </div>
          )}
        </div>

        {/* Right Side: Quick Actions */}
        <div className="space-y-3.5">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Azioni Rapide
          </h2>
          <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2.5">
            <NewPropertyButton 
              variant="custom"
              className="group flex items-center gap-3 w-full p-2.5 rounded-xl border border-slate-100 hover:border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all text-left"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-600 group-hover:text-[#FF5A5F] group-hover:border-[#FF5A5F]/20 transition-all shrink-0">
                <Plus size={14} />
              </div>
              <span className="text-xs font-semibold text-slate-700">Nuova proprietà</span>
            </NewPropertyButton>

            <Link 
              href="/dashboard/guides" 
              className="group flex items-center gap-3 w-full p-2.5 rounded-xl border border-slate-100 hover:border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all text-left"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-600 group-hover:text-[#FF5A5F] group-hover:border-[#FF5A5F]/20 transition-all shrink-0">
                <BookOpen size={14} />
              </div>
              <span className="text-xs font-semibold text-slate-700">Le mie guide</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
