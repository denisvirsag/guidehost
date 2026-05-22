import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { GuideSection } from '@/types'

export async function generateMetadata(props: PageProps<'/g/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('name, address')
    .eq('slug', slug)
    .single()

  if (!property) return { title: 'Guida' }

  return {
    title: `Guida — ${property.name}`,
    description: `Guida interattiva per gli ospiti di ${property.name}${property.address ? ` — ${property.address}` : ''}`,
  }
}

export default async function GuestGuidePage(props: PageProps<'/g/[slug]'>) {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*, guides(*, guide_sections(*))')
    .eq('slug', slug)
    .single()

  if (!property) notFound()

  const guides = property.guides as Array<{
    id: string
    published: boolean
    title: string
    theme: string
    accent_color: string
    guide_sections: GuideSection[]
  }>

  const guide = guides?.find(g => g.published)
  if (!guide) notFound()

  const sections = (guide.guide_sections ?? [])
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)

  // Track view (fire and forget)
  supabase.from('guide_views').insert({ guide_id: guide.id }).then(() => { })
  supabase.rpc('increment_guide_views', { guide_id_param: guide.id }).then(() => { })

  const isDark = guide.theme === 'dark'
  const accent = guide.accent_color || '#FF5A5F'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark ? '#0a0a0f' : '#f8f8fc',
        color: isDark ? '#f4f4f8' : '#1a1a2e',
        fontFamily: "'Inter', sans-serif",
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(160deg, ${accent}22 0%, transparent 60%)`,
          borderBottom: `3px solid ${accent}`,
          padding: '2.5rem 1.5rem 1.75rem',
          textAlign: 'center',
        }}
      >
        {property.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.cover_image_url}
            alt={property.name}
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', border: `3px solid ${accent}` }}
          />
        ) : (
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏠</div>
        )}
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {property.name}
        </h1>
        {property.address && (
          <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>{property.address}</p>
        )}
      </div>

      {/* Sections */}
      <div style={{ padding: '1rem 0' }}>
        {sections.map(section => (
          <GuestSection key={section.id} section={section} accent={accent} isDark={isDark} />
        ))}
      </div>

      {/* Powered by */}
      <div style={{ textAlign: 'center', padding: '2rem 1rem 3rem', opacity: 0.4, fontSize: '0.75rem' }}>
        Creata con ❤️ su{' '}
        <a href="/" style={{ color: accent }}>GuideHost</a>
      </div>
    </div>
  )
}

function GuestSection({ section, accent, isDark }: { section: GuideSection; accent: string; isDark: boolean }) {
  const bg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'

  return (
    <div
      style={{
        margin: '0 1rem 0.875rem',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '14px',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.375rem' }}>{section.icon ?? '📄'}</span>
        <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>{section.title}</h2>
      </div>

      <div style={{ padding: '0 1.25rem 1.25rem', fontSize: '0.9375rem', lineHeight: 1.7, color: textMuted }}>
        <SectionContent section={section} accent={accent} isDark={isDark} bg={bg} border={border} />
      </div>
    </div>
  )
}

function SectionContent({ section, accent, isDark, bg, border }: { section: GuideSection; accent: string; isDark: boolean; bg: string; border: string }) {
  const c = section.content as Record<string, unknown>

  switch (section.type) {
    case 'wifi':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.6, fontSize: '0.8125rem' }}>Rete</span>
            <strong>{(c.network as string) || '—'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.6, fontSize: '0.8125rem' }}>Password</span>
            <strong style={{ fontFamily: 'monospace', fontSize: '0.9375rem' }}>{(c.password as string) || '—'}</strong>
          </div>
        </div>
      )

    case 'checkin':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: `${accent}15`, borderRadius: '10px' }}>
              <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Check-in</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: accent }}>{(c.checkin as string) || '—'}</p>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: `${accent}15`, borderRadius: '10px' }}>
              <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Check-out</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: accent }}>{(c.checkout as string) || '—'}</p>
            </div>
          </div>
          {typeof c.instructions === 'string' && c.instructions && (
            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {c.instructions}
            </p>
          )}
        </div>
      )

    case 'rules':
    case 'checkout_checklist': {
      const items = ((c.rules ?? c.items) as string[]) ?? []
      return (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
              <span style={{ color: accent, flexShrink: 0 }}>
                {section.type === 'checkout_checklist' ? '☐' : '•'}
              </span>
              {item}
            </li>
          ))}
        </ul>
      )
    }

    case 'map':
      return (
        <div>
          <p style={{ marginBottom: '0.75rem' }}>{(c.address as string) || ''}</p>
          {typeof c.link === 'string' && c.link && (
            <a
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: accent, fontWeight: 500, fontSize: '0.875rem' }}
            >
              📍 Apri su Google Maps
            </a>
          )}
        </div>
      )

    case 'emergency': {
      const contacts = (c.contacts as Array<{ label: string; number: string }>) ?? []
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {contacts.map((contact, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ opacity: 0.6, fontSize: '0.875rem' }}>{contact.label}</span>
              <a href={`tel:${contact.number}`} style={{ color: accent, fontWeight: 600 }}>{contact.number}</a>
            </div>
          ))}
        </div>
      )
    }

    case 'faq': {
      const items = (c.items as Array<{ q: string; a: string }>) ?? []
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item, i) => (
            <details key={i} style={{ borderRadius: '10px', border: `1px solid ${border}`, overflow: 'hidden' }}>
              <summary style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.9375rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {item.q}
                <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>＋</span>
              </summary>
              <p style={{ padding: '0 1rem 0.875rem', fontSize: '0.875rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{item.a}</p>
            </details>
          ))}
        </div>
      )
    }

    case 'recommendations': {
      const items = (c.items as Array<{ name: string; description: string; type: string }>) ?? []
      const categoryEmoji: Record<string, string> = {
        'Ristorante': '🍽️', 'Bar': '☕', 'Supermercato': '🛒', 'Attrattiva': '🏛️',
        'Trasporto': '🚌', 'Farmacia': '💊', 'Altro': '📍'
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.875rem', padding: '0.875rem', background: bg, borderRadius: '10px' }}>
              <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>{categoryEmoji[item.type] ?? '📍'}</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{item.name}</p>
                {item.type && <p style={{ fontSize: '0.75rem', color: accent, marginBottom: '0.25rem' }}>{item.type}</p>}
                {item.description && <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'how_to': {
      const steps = (c.steps as string[]) ?? []
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {typeof c.device === 'string' && c.device && <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{c.device}</p>}
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: accent, color: '#fff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.125rem' }}>
                {i + 1}
              </span>
              <p style={{ fontSize: '0.9375rem', lineHeight: '1.5' }}>{step}</p>
            </div>
          ))}
        </div>
      )
    }

    case 'gallery': {
      const images = (c.images as string[]).filter(Boolean) ?? []
      if (!images.length) return null
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {images.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`gallery-${i}`} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px' }} />
            </a>
          ))}
        </div>
      )
    }

    default:
      return (
        <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          {(c.text as string) ?? ''}
        </p>
      )
  }
}
