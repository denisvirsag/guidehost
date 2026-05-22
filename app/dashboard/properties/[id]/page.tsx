import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, ExternalLink, Trash2 } from 'lucide-react'
import type { Metadata } from 'next'
import PropertyDetailClient from './PropertyDetailClient'

export const metadata: Metadata = { title: 'Dettaglio Proprietà' }

export default async function PropertyDetailPage(props: PageProps<'/dashboard/properties/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!property) notFound()

  // Find the associated guide
  const { data: guide } = await supabase
    .from('guides')
    .select('id, published, title')
    .eq('property_id', id)
    .single()

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/dashboard/properties"
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '1rem', paddingLeft: '0' }}
        >
          <ArrowLeft size={15} />
          Torna alle proprietà
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              {property.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {property.address ?? 'Nessun indirizzo specificato'} · /g/{property.slug}
            </p>
          </div>
          {guide && (
            <Link href={`/dashboard/guides/${guide.id}`} className="btn btn-primary">
              <BookOpen size={15} />
              Modifica guida
            </Link>
          )}
        </div>
      </div>

      {/* Guide status banner */}
      {guide ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.25rem',
            background: guide.published
              ? 'rgba(52,211,153,0.06)'
              : 'rgba(100,116,139,0.06)',
            border: `1px solid ${guide.published ? 'rgba(52,211,153,0.2)' : 'var(--border)'}`,
            borderRadius: '12px',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
              {guide.published ? '🟢 Guida pubblicata' : '⚪ Guida in bozza'}
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {guide.published
                ? `Gli ospiti possono accedere a: ${process.env.NEXT_PUBLIC_APP_URL ?? ''}/g/${property.slug}`
                : 'La guida non è ancora visibile agli ospiti.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {guide.published && (
              <a
                href={`/g/${property.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <ExternalLink size={13} />
                Apri guida
              </a>
            )}
            <Link href={`/dashboard/guides/${guide.id}`} className="btn btn-secondary btn-sm">
              <BookOpen size={13} />
              Editor
            </Link>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'rgba(255,90,95,0.05)',
            border: '1px solid rgba(255,90,95,0.15)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          ⚠️ Nessuna guida associata. Contatta il supporto.
        </div>
      )}

      {/* Edit form */}
      <PropertyDetailClient property={property} propertyId={id} />
    </div>
  )
}
