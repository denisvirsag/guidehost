'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Bentornato 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Accedi al tuo account GuideHost
        </p>
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
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            placeholder="••••••••"
            required
            autoComplete="current-password"
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
              Accesso in corso...
            </>
          ) : (
            'Accedi'
          )}
        </button>
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
          Non hai un account?
        </span>
        <div className="divider" />
      </div>

      <Link
        href="/signup"
        className="btn btn-secondary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Registrati gratis
      </Link>
    </div>
  )
}
