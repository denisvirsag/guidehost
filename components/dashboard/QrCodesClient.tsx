'use client'

import Link from 'next/link'
import { QrCode, Download, ExternalLink } from 'lucide-react'

interface Property {
  name: string
  slug: string
}

interface Guide {
  id: string
  title: string
  published: boolean
  properties: Property | Property[] | null
}

interface QrCodesClientProps {
  guides: Guide[]
  appUrl: string
}

export default function QrCodesClient({ guides, appUrl }: QrCodesClientProps) {
  return (
    <div
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          QR Code
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Scarica il QR code per ogni guida pubblicata. Stampalo, incornicialo e posizionalo ben visibile in casa per permettere ai tuoi ospiti di accedere all'istante a tutte le informazioni.
        </p>
      </div>

      {/* Grid / Empty State */}
      {guides && guides.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {guides.map((guide) => {
            const rawProperty = guide.properties
            const property = Array.isArray(rawProperty)
              ? (rawProperty[0] as unknown as Property | undefined)
              : (rawProperty as unknown as Property | null)
            
            const guideUrl = `${appUrl}/g/${property?.slug}`
            
            return (
              <div key={guide.id}>
                <div className="group flex flex-col bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-slate-200/80 transition-all duration-300">
                  {/* QR Image Preview Container */}
                  <div className="relative flex items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden mb-4 group-hover:bg-slate-50/50 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/qr/${guide.id}?format=png`}
                      alt={`QR code per ${guide.title}`}
                      className="w-40 h-40 object-contain shadow-sm rounded-lg border border-white bg-white group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>

                  {/* Body Info */}
                  <div className="flex-1 min-w-0 mb-5">
                    <h3 className="text-sm font-bold text-slate-800 truncate">
                      {guide.title}
                    </h3>
                    {property && (
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {property.name}
                      </p>
                    )}
                  </div>

                  {/* Actions Grid */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`/api/qr/${guide.id}?format=png`}
                      download
                      className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
                    >
                      <Download size={13} />
                      PNG
                    </a>
                    <a
                      href={`/api/qr/${guide.id}?format=svg`}
                      download
                      className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
                    >
                      <Download size={13} />
                      SVG
                    </a>
                    <a
                      href={guideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5A5F]/5 border border-[#FF5A5F]/10 hover:bg-[#FF5A5F]/10 text-[#FF5A5F] hover:text-[#E04950] transition-colors shrink-0"
                      title="Apri guida"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-slate-200 rounded-2xl text-center max-w-lg mx-auto"
        >
          <div className="h-16 w-16 rounded-full bg-[#FF5A5F]/5 flex items-center justify-center text-2xl mb-5 border border-[#FF5A5F]/10">
            <QrCode size={26} className="text-[#FF5A5F]" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Nessuna guida pubblicata</h2>
          <p className="text-sm text-slate-500 max-w-xs mt-2 leading-relaxed">
            Pubblica almeno una guida per generare e scaricare il suo codice QR. Stampalo e lascialo in casa per i tuoi ospiti.
          </p>
          <Link 
            href="/dashboard/guides" 
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FF5A5F] px-5 text-xs font-semibold text-white shadow-md shadow-[#FF5A5F]/15 hover:bg-[#E04950] transition-colors mt-6"
          >
            Gestisci le guide
          </Link>
        </div>
      )}
    </div>
  )
}
