'use client'

import Link from 'next/link'
import { Plus, Building2, ArrowRight, Wifi, MapPin } from 'lucide-react'

interface Property {
  id: string
  name: string
  address: string | null
  wifi_name: string | null
  cover_image_url: string | null
  slug: string
  guides: any // Let the component handle it or cast it
}

interface PropertiesClientProps {
  properties: Property[]
}

export default function PropertiesClient({ properties }: PropertiesClientProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Proprietà
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {properties?.length ?? 0} {properties?.length === 1 ? 'proprietà gestita' : 'proprietà gestite'}
          </p>
        </div>
        <Link 
          href="/dashboard/properties/new" 
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FF5A5F] px-4 text-xs font-semibold text-white shadow-md shadow-[#FF5A5F]/15 hover:bg-[#E04950] transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Aggiungi proprietà
        </Link>
      </div>

      {/* Grid / Empty State */}
      {properties && properties.length > 0 ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {properties.map((property) => {
            const guidesArray = property.guides as { id: string; published: boolean }[] | undefined
            const guide = Array.isArray(guidesArray) ? guidesArray[0] : null
            
            return (
              <div key={property.id}>
                <Link
                  href={`/dashboard/properties/${property.id}`}
                  className="group flex flex-col h-full bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative h-44 w-full bg-slate-50 overflow-hidden shrink-0 border-b border-slate-100 flex items-center justify-center">
                    {property.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={property.cover_image_url}
                        alt={property.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-300">
                        <Building2 size={32} />
                        <span className="text-xs font-medium text-slate-400">Nessuna immagine</span>
                      </div>
                    )}
                    
                    {/* Status Badge Over Image */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                        guide?.published 
                          ? 'bg-emerald-500/90 text-white' 
                          : guide 
                            ? 'bg-amber-500/90 text-white' 
                            : 'bg-slate-500/90 text-white'
                      }`}>
                        {guide?.published ? 'Pubblicata' : guide ? 'Bozza' : 'Nessuna guida'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 group-hover:text-[#FF5A5F] transition-colors leading-snug line-clamp-1">
                        {property.name}
                      </h3>
                      
                      {property.address && (
                        <p className="flex items-start gap-1.5 text-xs text-slate-400 mt-2 line-clamp-1">
                          <MapPin size={13} className="shrink-0 mt-0.5" />
                          <span>{property.address}</span>
                        </p>
                      )}
                      
                      {property.wifi_name && (
                        <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                          <Wifi size={13} className="shrink-0 text-slate-400" />
                          <span className="font-medium text-slate-500 truncate">Wifi: {property.wifi_name}</span>
                        </p>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50 text-[11px] font-semibold text-slate-400">
                      <span className="font-mono tracking-tight truncate max-w-[180px]">
                        /g/{property.slug}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#FF5A5F] group-hover:translate-x-0.5 transition-transform shrink-0">
                        Gestisci
                        <ArrowRight size={12} />
                      </span>
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
            <Building2 size={28} className="text-[#FF5A5F]" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Nessuna proprietà ancora</h2>
          <p className="text-sm text-slate-500 max-w-xs mt-2 leading-relaxed">
            Aggiungi la tua prima proprietà per iniziare a creare guide interattive e digitali per i tuoi ospiti.
          </p>
          <Link 
            href="/dashboard/properties/new" 
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FF5A5F] px-5 text-xs font-semibold text-white shadow-md shadow-[#FF5A5F]/15 hover:bg-[#E04950] transition-colors mt-6"
          >
            <Plus size={14} />
            Aggiungi la prima proprietà
          </Link>
        </div>
      )}
    </div>
  )
}
