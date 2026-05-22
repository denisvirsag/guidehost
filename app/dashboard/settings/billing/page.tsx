import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CreditCard, Check, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Piano e Fatture' }

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    features: ['1 proprietà', '5 sezioni per guida', 'QR code', 'Link condivisibile'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 9,
    features: ['5 proprietà', 'Sezioni illimitate', 'QR code', 'Analytics base', 'Temi personalizzati'],
  },
  {
    key: 'business',
    name: 'Business',
    price: 29,
    features: ['Proprietà illimitate', 'Sezioni illimitate', 'Analytics avanzati', 'Nessun branding'],
  },
]

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_status, stripe_customer_id')
    .eq('id', user!.id)
    .single()

  const currentPlan = profile?.plan ?? 'free'
  const status = profile?.plan_status

  return (
    <div className="animate-fade-in billing-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Piano e Fatture</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Gestisci il tuo abbonamento GuideHost.
        </p>
      </div>

      {/* Current plan */}
      <div
        className="card"
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', background: 'rgba(255,90,95,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={20} color="var(--brand)" />
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Piano attivo</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, textTransform: 'capitalize' }}>
              {currentPlan}
              {status && status !== 'active' && (
                <span className="badge badge-warning" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }}>
                  {status}
                </span>
              )}
            </p>
          </div>
        </div>
        {currentPlan !== 'free' && (
          <a
            href="/api/stripe/portal"
            className="btn btn-secondary"
          >
            Gestisci abbonamento
          </a>
        )}
      </div>

      {/* Plan cards */}
      <div className="billing-grid">
        {PLANS.map(plan => {
          const isCurrent = plan.key === currentPlan
          const isUpgrade = ['free', 'pro'].indexOf(plan.key) > ['free', 'pro'].indexOf(currentPlan)
          return (
            <div
              key={plan.key}
              className="card pricing-card"
              style={{
                border: isCurrent ? '1px solid rgba(255,90,95,0.4)' : '1px solid var(--border)',
                boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none',
                position: 'relative',
              }}
            >
              {isCurrent && (
                <div className="badge badge-brand" style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}>
                  Piano attuale
                </div>
              )}
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{plan.name}</h3>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                €{plan.price}
                <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/mese</span>
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <Check size={13} color="#34d399" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="pricing-card-footer">
                {!isCurrent && isUpgrade ? (
                  <a
                    href={`/api/stripe/checkout?plan=${plan.key}`}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Zap size={13} />
                    Passa a {plan.name}
                  </a>
                ) : !isCurrent ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Downgrade disponibile dal portale
                  </p>
                ) : (
                  <div className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', opacity: 0.5, cursor: 'default' }}>
                    Piano attuale
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
