import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Globe, GlobeLock } from 'lucide-react'
import GuideEditorClient from './GuideEditorClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Editor Guida' }

export default async function GuideEditorPage(props: PageProps<'/dashboard/guides/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: guide } = await supabase
    .from('guides')
    .select('*, properties(*)')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!guide) notFound()

  const { data: sections } = await supabase
    .from('guide_sections')
    .select('*')
    .eq('guide_id', id)
    .order('order', { ascending: true })

  const property = guide.properties as { name: string; slug: string } | null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height))' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.5rem',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard/guides" className="btn btn-ghost btn-sm btn-icon">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{guide.title}</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {property?.name ?? 'Proprietà'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge ${guide.published ? 'badge-success' : 'badge-neutral'}`}>
            {guide.published ? <><Globe size={10} />Pubblicata</> : <><GlobeLock size={10} />Bozza</>}
          </span>
          {guide.published && property?.slug && (
            <Link href={`/g/${property.slug}`} target="_blank" className="btn btn-secondary btn-sm">
              <Eye size={14} />
              Anteprima
            </Link>
          )}
        </div>
      </div>

      <GuideEditorClient
        guide={{ id: guide.id, published: guide.published, theme: guide.theme, accent_color: guide.accent_color, title: guide.title }}
        sections={sections ?? []}
        propertySlug={property?.slug ?? ''}
      />
    </div>
  )
}
