'use client'

import { useActionState, useTransition, useState } from 'react'
import { updateProperty, deleteProperty } from '@/app/actions/properties'
import { Loader2, Trash2, Save } from 'lucide-react'
import type { Property } from '@/types'
import AddressInput from '@/components/AddressInput'

interface Props {
  property: Property
  propertyId: string
}

export default function PropertyDetailClient({ property, propertyId }: Props) {
  const updatePropertyBound = updateProperty.bind(null, propertyId)
  const [state, action, pending] = useActionState(updatePropertyBound, undefined)
  const [deleteTransition, startDeleteTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    startDeleteTransition(async () => {
      await deleteProperty(propertyId)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Success banner */}
      {state?.error === undefined && state !== undefined && (
        <div
          style={{
            background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            color: '#34d399',
          }}
        >
          ✓ Modifiche salvate con successo.
        </div>
      )}

      {/* Error banner */}
      {state?.error && (
        <div
          style={{
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            color: '#f87171',
          }}
        >
          {state.error}
        </div>
      )}

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Section: Info base */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              defaultValue={property.name}
              required
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="address">Indirizzo</label>
            <AddressInput
              id="address"
              name="address"
              defaultValue={property.address ?? ''}
            />
          </div>
        </div>

        {/* Section: Check-in/out */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Check-in &amp; Check-out</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="label" htmlFor="check_in_time">Orario check-in</label>
              <input
                id="check_in_time"
                name="check_in_time"
                type="text"
                className="input"
                defaultValue={property.check_in_time ?? ''}
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
                defaultValue={property.check_out_time ?? ''}
                placeholder="es. 11:00"
              />
            </div>
          </div>
        </div>

        {/* Section: Wi-Fi */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>📶 Wi-Fi</h2>

          <div className="form-group">
            <label className="label" htmlFor="wifi_name">Nome rete (SSID)</label>
            <input
              id="wifi_name"
              name="wifi_name"
              type="text"
              className="input"
              defaultValue={property.wifi_name ?? ''}
              placeholder="es. CasaMia_5G"
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="wifi_password">Password Wi-Fi</label>
            <input
              id="wifi_password"
              name="wifi_password"
              type="text"
              className="input"
              defaultValue={property.wifi_password ?? ''}
              placeholder="es. casabella2024"
            />
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.8125rem' }}>
              Visibile solo nella guida privata degli ospiti.
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={pending}
          style={{ alignSelf: 'flex-start' }}
        >
          {pending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Salvataggio...
            </>
          ) : (
            <>
              <Save size={15} />
              Salva modifiche
            </>
          )}
        </button>
      </form>

      {/* Danger zone */}
      <div
        className="card"
        style={{
          borderColor: 'rgba(248,113,113,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f87171' }}>Zona pericolosa</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Eliminando la proprietà, verranno eliminate anche tutte le guide e le sezioni associate. Questa azione è irreversibile.
        </p>

        {confirmDelete && (
          <div
            style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              color: '#f87171',
            }}
          >
            ⚠️ Sei sicuro? Clicca di nuovo per confermare l'eliminazione definitiva.
          </div>
        )}

        <button
          type="button"
          className="btn btn-sm"
          onClick={handleDelete}
          disabled={deleteTransition}
          style={{
            alignSelf: 'flex-start',
            background: 'rgba(248,113,113,0.1)',
            color: '#f87171',
            border: '1px solid rgba(248,113,113,0.2)',
          }}
        >
          {deleteTransition ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          {confirmDelete ? 'Conferma eliminazione' : 'Elimina proprietà'}
        </button>
      </div>
    </div>
  )
}
