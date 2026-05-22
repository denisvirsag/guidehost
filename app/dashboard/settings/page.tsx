import { createClient, getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, ArrowRight, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Impostazioni' }

export default async function SettingsPage() {
  const [user, supabase] = await Promise.all([getUser(), createClient()])
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'free'
  const name = profile?.full_name ?? user.email?.split('@')[0] ?? 'Utente'

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Impostazioni</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Gestisci il tuo profilo e abbonamento.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Profile card */}
        <div
          className="card"
          style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand), #ff7e82)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.25rem',
              flexShrink: 0,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: '1rem' }}>{name}</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{user.email}</p>
          </div>
          <span className={`badge ${plan === 'free' ? 'badge-neutral' : 'badge-success'}`} style={{ textTransform: 'capitalize' }}>
            {plan}
          </span>
        </div>

        {/* Links */}
        <Link
          href="/dashboard/settings/billing"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.25rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ width: '38px', height: '38px', background: 'rgba(255,90,95,0.08)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={17} color="var(--brand)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 500, fontSize: '0.9375rem' }}>Piano e Fatture</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Gestisci il tuo abbonamento</p>
          </div>
          <ArrowRight size={15} color="var(--text-muted)" />
        </Link>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              color: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ width: '38px', height: '38px', background: 'rgba(248,113,113,0.08)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogOut size={17} color="#f87171" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 500, fontSize: '0.9375rem' }}>Esci dall'account</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Disconnetti sessione corrente</p>
            </div>
            <ArrowRight size={15} color="var(--text-muted)" />
          </button>
        </form>
      </div>
    </div>
  )
}
