'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { createProperty } from '@/app/actions/properties'
import { ArrowLeft, Loader2 } from 'lucide-react'
import AddressInput from '@/components/AddressInput'
import { usePostHog } from 'posthog-js/react'

export default function NewPropertyClient() {
  const posthog = usePostHog()
  const [state, action, pending] = useActionState(createProperty, undefined)

  // States for live preview
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [wifiName, setWifiName] = useState('')

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Nuova proprietà
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Compila i dettagli della tua proprietà. Potrai modificarli in qualsiasi momento.
        </p>
      </div>

      {/* Grid wrapper */}
      <div className="property-new-grid">
        {/* Left Column: Form */}
        <div>
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
                marginBottom: '1.5rem',
              }}
            >
              {state.error}
            </div>
          )}

          <form 
            action={(formData) => {
              posthog.capture('property_created', { name: formData.get('name') })
              action(formData)
            }} 
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Section: Info base */}
            <div
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Informazioni base</h2>

              <div className="form-group">
                <label className="label" htmlFor="name">
                  Nome della proprietà <span style={{ color: 'var(--brand)' }}>*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input"
                  placeholder="es. Appartamento Milano Centro"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="address">Indirizzo</label>
                <AddressInput
                  id="address"
                  name="address"
                  defaultValue={address}
                  onChange={setAddress}
                />
              </div>
            </div>

            {/* Section: Check-in/out */}
            <div
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Check-in & Check-out</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label" htmlFor="check_in_time">Orario check-in</label>
                  <input
                    id="check_in_time"
                    name="check_in_time"
                    type="text"
                    className="input"
                    placeholder="es. 15:00"
                  />
                </div>
                <div className="form-group">
                  <label className="label" htmlFor="check_out_time">Orario check-out</label>
                  <input
                    id="check_out_time"
                    name="check_out_time"
                    type="text"
                    className="input"
                    placeholder="es. 11:00"
                  />
                </div>
              </div>
            </div>

            {/* Section: Wi-Fi */}
            <div
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>📶 Wi-Fi</h2>

              <div className="form-group">
                <label className="label" htmlFor="wifi_name">Nome rete (SSID)</label>
                <input
                  id="wifi_name"
                  name="wifi_name"
                  type="text"
                  className="input"
                  placeholder="es. CasaMia_5G"
                  value={wifiName}
                  onChange={(e) => setWifiName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="wifi_password">Password Wi-Fi</label>
                <input
                  id="wifi_password"
                  name="wifi_password"
                  type="text"
                  className="input"
                  placeholder="es. casabella2024"
                />
                <p className="field-error" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Visibile solo nella guida privata degli ospiti.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={pending}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {pending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creazione in corso...
                  </>
                ) : (
                  'Crea proprietà e guida'
                )}
              </button>
              <Link href="/dashboard/properties" className="btn btn-secondary">
                Annulla
              </Link>
            </div>
          </form>
        </div>

        {/* Right Column: Premium Help/Info Sidebar & Live Preview */}
        <div className="property-preview-sidebar">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.375rem' }}>
            Anteprima Guida Digitale
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
            Ecco un'anteprima di come i tuoi ospiti visualizzeranno la guida interattiva sui loro smartphone.
          </p>

          {/* Smartphone Mockup */}
          <div
            style={{
              border: '10px solid #212529',
              borderRadius: '36px',
              background: 'var(--bg-primary)',
              height: '460px',
              width: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-card), 0 20px 40px rgba(0,0,0,0.06)',
              position: 'relative',
            }}
          >
            {/* Speaker & Camera Notch */}
            <div
              style={{
                width: '110px',
                height: '18px',
                background: '#212529',
                borderRadius: '0 0 12px 12px',
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
              }}
            />

            {/* Phone Screen Container */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                paddingTop: '20px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Cover Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--brand) 0%, #ff7e82 100%)',
                  padding: '1.25rem 1rem',
                  color: '#ffffff',
                }}
              >
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    opacity: 0.85,
                  }}
                >
                  Benvenuto a
                </span>
                <h4
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    margin: '0.125rem 0 0.25rem 0',
                    lineHeight: '1.3',
                    wordBreak: 'break-word',
                  }}
                >
                  {name || 'La tua proprietà'}
                </h4>
                <p
                  style={{
                    fontSize: '0.75rem',
                    opacity: 0.9,
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    wordBreak: 'break-all',
                  }}
                >
                  📍 {address || 'Indirizzo della proprietà'}
                </p>
              </div>

              {/* Sections list inside simulator */}
              <div
                style={{
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                }}
              >
                {/* Section: Welcome */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                  }}
                >
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand)', margin: '0 0 0.25rem 0' }}>
                    👋 Benvenuto
                  </p>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                    Siamo felici di ospitarti! In questa guida digitale troverai tutte le informazioni utili per il tuo soggiorno.
                  </p>
                </div>

                {/* Section: Wi-Fi */}
                {wifiName && (
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                    }}
                  >
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', margin: '0 0 0.25rem 0' }}>
                      📶 Connessione Wi-Fi
                    </p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', margin: '0 0 0.125rem 0' }}>
                      <strong>Rete:</strong> {wifiName}
                    </p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0 }}>
                      <strong>Password:</strong> ••••••••
                    </p>
                  </div>
                )}

                {/* Section: Info Check-in */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                  }}
                >
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', margin: '0 0 0.25rem 0' }}>
                    🔑 Check-in & Check-out
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                      fontSize: '0.6875rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <div>
                      <strong>Check-in:</strong> 15:00
                    </div>
                    <div>
                      <strong>Check-out:</strong> 11:00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
