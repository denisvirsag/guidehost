'use client'

import Link from 'next/link'
import { BookOpen, Globe, GlobeLock, ArrowRight, Plus } from 'lucide-react'

interface Property {
  name: string
  slug: string
}

interface Guide {
  id: string
  title: string
  published: boolean
  updated_at: string
  properties: Property | Property[] | null
}

interface GuidesClientProps {
  guides: Guide[]
}

export default function GuidesClient({ guides }: GuidesClientProps) {
  return (
    <div
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Guide
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {guides?.length ?? 0} {guides?.length === 1 ? 'guida creata' : 'guide create'}
          </p>
        </div>
        <Link 
          href="/dashboard/properties/new" 
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 text-xs font-semibold text-slate-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Nuova proprietà
        </Link>
      </div>

      {/* Guides List / Empty State */}
      {guides && guides.length > 0 ? (
        <div
          className="space-y-3"
        >
          {guides.map((guide) => {
            const rawProperty = guide.properties
            const property = Array.isArray(rawProperty)
              ? (rawProperty[0] as unknown as Property | undefined)
              : (rawProperty as unknown as Property | null)
            
            return (
              <div key={guide.id}>
                <Link
                  href={`/dashboard/guides/${guide.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl hover:border-slate-200/80 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF5A5F]/5 border border-[#FF5A5F]/10 text-[#FF5A5F] shrink-0">
                      <BookOpen size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#FF5A5F] transition-colors leading-snug truncate">
                        {guide.title}
                      </h3>
                      {property && (
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          {property.name} <span className="text-slate-300 mx-1.5">·</span> /g/{property.slug}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t border-slate-50 sm:border-0 pt-3 sm:pt-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      guide.published 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' 
                        : 'bg-slate-50 text-slate-500 border border-slate-100'
                    }`}>
                      {guide.published ? (
                        <>
                          <Globe size={11} className="shrink-0" />
                          <span>Pubblicata</span>
                        </>
                      ) : (
                        <>
                          <GlobeLock size={11} className="shrink-0" />
                          <span>Bozza</span>
                        </>
                      )}
                    </span>
                    
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg group-hover:bg-slate-50 text-slate-400 group-hover:text-slate-600 transition-colors">
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-slate-200 rounded-2xl text-center max-w-lg mx-auto"
        >
          <div className="h-16 w-16 rounded-full bg-[#FF5A5F]/5 flex items-center justify-center text-2xl mb-5 border border-[#FF5A5F]/10">
            <BookOpen size={26} className="text-[#FF5A5F]" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Nessuna guida ancora</h2>
          <p className="text-sm text-slate-500 max-w-xs mt-2 leading-relaxed">
            Le guide vengono create automaticamente quando aggiungi una proprietà. Aggiungine una per iniziare.
          </p>
          <Link 
            href="/dashboard/properties/new" 
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FF5A5F] px-5 text-xs font-semibold text-white shadow-md shadow-[#FF5A5F]/15 hover:bg-[#E04950] transition-colors mt-6"
          >
            <Plus size={14} />
            Aggiungi proprietà
          </Link>
        </div>
      )}
    </div>
  )
}
