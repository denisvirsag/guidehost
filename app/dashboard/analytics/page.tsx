import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TrendingUp, Eye } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user!.id)
    .single()

  if (profile?.plan === 'free') {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '560px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Scopri come i tuoi ospiti interagiscono con le guide.
        </p>
        <div
          style={{
            padding: '3rem 2rem',
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,90,95,0.2)',
            borderRadius: '16px',
            textAlign: 'center',
          }}
        >
          <TrendingUp size={48} color="var(--brand)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Analytics disponibili da Piano Pro</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            Visualizza visite per guida, sezioni più lette e provenienza degli ospiti.
          </p>
          <Link href="/dashboard/settings/billing" className="btn btn-primary">
            Passa a Pro — €9/mese
          </Link>
        </div>
      </div>
    )
  }

  // Fetch analytics data
  const { data: guides } = await supabase
    .from('guides')
    .select('id, title, views_count, published, properties(name, slug)')
    .eq('owner_id', user!.id)
    .order('views_count', { ascending: false })

  const totalViews = guides?.reduce((acc, g) => acc + (g.views_count ?? 0), 0) ?? 0

  // Last 7 days views per day
  const { data: recentViews } = await supabase
    .from('guide_views')
    .select('viewed_at, guide_id')
    .in('guide_id', guides?.map(g => g.id) ?? [])
    .gte('viewed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('viewed_at', { ascending: true })

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Statistiche di visualizzazione delle tue guide
        </p>
      </div>

      {/* Total views stat */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,90,95,0.12)' }}>
            <Eye size={18} color="var(--brand)" />
          </div>
          <div>
            <p className="stat-value">{totalViews.toLocaleString()}</p>
            <p className="stat-label">Visite totali</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52,211,153,0.12)' }}>
            <TrendingUp size={18} color="#34d399" />
          </div>
          <div>
            <p className="stat-value">{recentViews?.length ?? 0}</p>
            <p className="stat-label">Ultimi 7 giorni</p>
          </div>
        </div>
      </div>

      {/* Per-guide breakdown */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Visite per guida</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {guides?.map(guide => {
            const rawProperty = guide.properties
            const property = Array.isArray(rawProperty)
              ? (rawProperty[0] as unknown as { name: string; slug: string } | undefined)
              : (rawProperty as unknown as { name: string; slug: string } | null)
            const pct = totalViews > 0 ? Math.round((guide.views_count / totalViews) * 100) : 0
            return (
              <div
                key={guide.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, marginBottom: '0.125rem' }}>{guide.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/g/{property?.slug}</p>
                  <div style={{ marginTop: '0.5rem', background: 'var(--bg-input)', borderRadius: '4px', height: '6px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--brand)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{guide.views_count}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pct}%</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
