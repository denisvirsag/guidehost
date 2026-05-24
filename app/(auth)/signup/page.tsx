'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'
import { Loader2, Check } from 'lucide-react'
import { usePostHog } from 'posthog-js/react'

export default function SignupPage() {
  const posthog = usePostHog()
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Inizia gratis 🚀
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Crea il tuo account GuideHost
        </p>
      </div>

      {/* Trial badge */}
      <div
        style={{
          background: 'rgba(52,211,153,0.08)',
          border: '1px solid rgba(52,211,153,0.15)',
          borderRadius: '8px',
          padding: '0.625rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8125rem',
          color: '#34d399',
        }}
      >
        <Check size={14} strokeWidth={2.5} />
        14 giorni di prova Pro inclusi — nessuna carta richiesta
      </div>

      {/* Error */}
      {state?.error && (
        <div
          style={{
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            color: '#f87171',
            marginBottom: '1.25rem',
          }}
        >
          {state.error}
        </div>
      )}

      {/* Form */}
      <form
        action={action}
        onSubmit={(e) => {
          const formData = new FormData(e.currentTarget)
          const email = formData.get('email') as string
          const full_name = formData.get('full_name') as string
          if (email) {
            posthog.identify(email, { email, name: full_name })
            posthog.capture('user_signed_up', { email, name: full_name })
          }
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div className="form-group">
          <label className="label" htmlFor="full_name">Nome completo</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            className="input"
            placeholder="Mario Rossi"
            required
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            placeholder="tu@esempio.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            placeholder="Min. 8 caratteri"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={pending}
          style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
        >
          {pending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creazione account...
            </>
          ) : (
            'Crea account gratuito'
          )}
        </button>

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}
        >
          Registrandoti accetti i nostri{' '}
          <Link href="/terms" style={{ color: 'var(--text-secondary)' }}>Termini di servizio</Link>
          {' '}e la{' '}
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>.
        </p>
      </form>

      {/* Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          margin: '1.5rem 0',
        }}
      >
        <div className="divider" />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Hai già un account?
        </span>
        <div className="divider" />
      </div>

      <Link
        href="/login"
        className="btn btn-secondary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Accedi
      </Link>
    </div>
  )
}
