import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewPropertyClient from '@/components/dashboard/NewPropertyClient'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuova Proprietà - GuideHost',
}

export default async function NewPropertyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check plan limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const { count } = await supabase
    .from('properties')
    .select('id', { count: 'exact' })
    .eq('owner_id', user.id)

  const limits: Record<string, number> = { free: 1, pro: 5, business: Infinity }
  const limit = limits[profile?.plan ?? 'free']
  const reachedLimit = (count ?? 0) >= limit

  if (reachedLimit) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        <Link
          href="/dashboard/properties"
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '2rem', paddingLeft: '0' }}
        >
          <ArrowLeft size={15} />
          Torna alle proprietà
        </Link>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <AlertTriangle size={32} color="#ef4444" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Hai raggiunto il limite
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
            Il tuo piano <strong style={{ textTransform: 'capitalize' }}>{profile?.plan ?? 'Free'}</strong> ti permette di gestire un massimo di <strong>{limit}</strong> {limit === 1 ? 'proprietà' : 'proprietà'}.
            Passa a un piano superiore per aggiungere nuove strutture.
          </p>
          <Link 
            href="/dashboard/settings/billing" 
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            Aggiorna il piano
          </Link>
        </div>
      </div>
    )
  }

  return <NewPropertyClient />
}
