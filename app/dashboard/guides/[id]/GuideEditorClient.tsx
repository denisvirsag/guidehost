'use client'

import { useState, useTransition, useRef, useCallback } from 'react'
import { Plus, GripVertical, Eye, EyeOff, Trash2, Globe, GlobeLock, Loader2, Palette, RefreshCw } from 'lucide-react'
import { publishGuide, addSection, deleteSection, updateSection, reorderSections, updateGuideTheme } from '@/app/actions/guides'
import { getSectionIcon, getSectionLabel } from '@/lib/utils'
import type { GuideSection, SectionType } from '@/types'
import posthog from 'posthog-js'

const SECTION_TYPES: SectionType[] = [
  'welcome', 'wifi', 'checkin', 'rules', 'how_to',
  'map', 'recommendations', 'emergency', 'faq',
  'gallery', 'checkout_checklist', 'custom',
]

interface Props {
  guide: { id: string; published: boolean; theme: string; accent_color: string; title: string }
  sections: GuideSection[]
  propertySlug: string
}

export default function GuideEditorClient({ guide, sections: initialSections, propertySlug }: Props) {
  const [sections, setSections] = useState<GuideSection[]>(initialSections)
  const [activeId, setActiveId] = useState<string | null>(initialSections[0]?.id ?? null)
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [showThemePanel, setShowThemePanel] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [published, setPublished] = useState(guide.published)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [previewKey, setPreviewKey] = useState(0)
  const [accent, setAccent] = useState(guide.accent_color || '#FF5A5F')
  const [theme, setTheme] = useState(guide.theme || 'light')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const refreshPreview = useCallback(() => {
    setPreviewKey(k => k + 1)
  }, [])

  const activeSection = sections.find(s => s.id === activeId) ?? null

  function handlePublish() {
    const nextPublished = !published
    startTransition(async () => {
      await publishGuide(guide.id, nextPublished)
      setPublished(nextPublished)
      posthog.capture('guide_published', { guide_id: guide.id, published: nextPublished })
    })
  }

  function handleAddSection(type: SectionType) {
    startTransition(async () => {
      const newSection = await addSection(guide.id, type)
      if (newSection) {
        setSections(prev => [...prev, newSection as GuideSection])
        setActiveId(newSection.id)
        posthog.capture('guide_section_added', { guide_id: guide.id, section_type: type })
      }
      setShowAddPanel(false)
    })
  }

  function handleDeleteSection(sectionId: string) {
    if (!confirm('Eliminare questa sezione?')) return
    const section = sections.find(s => s.id === sectionId)
    startTransition(async () => {
      await deleteSection(sectionId, guide.id)
      const remaining = sections.filter(s => s.id !== sectionId)
      setSections(remaining)
      if (activeId === sectionId) setActiveId(remaining[0]?.id ?? null)
      posthog.capture('guide_section_deleted', { guide_id: guide.id, section_id: sectionId, section_type: section?.type })
    })
  }

  function handleToggleVisible(section: GuideSection) {
    startTransition(async () => {
      await updateSection(section.id, guide.id, { visible: !section.visible })
      setSections(prev => prev.map(s => s.id === section.id ? { ...s, visible: !s.visible } : s))
      posthog.capture('guide_section_visibility_toggled', { guide_id: guide.id, section_id: section.id, section_type: section.type, visible: !section.visible })
    })
  }

  // Simple drag-and-drop reorder
  function handleDragStart(id: string) { setDragging(id) }
  function handleDragOver(e: React.DragEvent, id: string) { e.preventDefault(); setDragOver(id) }
  function handleDrop(targetId: string) {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return }
    const newOrder = [...sections]
    const fromIdx = newOrder.findIndex(s => s.id === dragging)
    const toIdx = newOrder.findIndex(s => s.id === targetId)
    const [moved] = newOrder.splice(fromIdx, 1)
    newOrder.splice(toIdx, 0, moved)
    setSections(newOrder)
    setDragging(null)
    setDragOver(null)
    startTransition(async () => { await reorderSections(guide.id, newOrder.map(s => s.id)) })
  }

  function handleSaveTheme() {
    startTransition(async () => {
      await updateGuideTheme(guide.id, theme, accent)
      refreshPreview()
      posthog.capture('guide_theme_saved', { guide_id: guide.id, theme, accent_color: accent })
    })
  }

  return (
    <div className="editor-layout">
      {/* Left panel: sections list */}
      <div className="editor-sidebar">
        {/* Publish toggle */}
        <div style={{ padding: '0.875rem', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={handlePublish}
            disabled={isPending}
            className={`btn ${published ? 'btn-secondary' : 'btn-primary'}`}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : published ? <GlobeLock size={14} /> : <Globe size={14} />}
            {published ? 'Nascondi guida' : 'Pubblica guida'}
          </button>
          {published && (
            <a
              href={`/g/${propertySlug}`}
              target="_blank"
              style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', color: 'var(--brand)', marginTop: '0.375rem' }}
            >
              /g/{propertySlug} ↗
            </a>
          )}
        </div>

        {/* Sections */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.625rem' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.375rem 0.5rem', marginBottom: '0.25rem' }}>
            Sezioni ({sections.length})
          </p>

          {sections.length === 0 && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '1rem 0.5rem', textAlign: 'center' }}>
              Nessuna sezione. Aggiungine una!
            </p>
          )}

          {sections.map(section => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(section.id)}
              onDragOver={e => handleDragOver(e, section.id)}
              onDrop={() => handleDrop(section.id)}
              onDragEnd={() => { setDragging(null); setDragOver(null) }}
              className={`section-item ${activeId === section.id ? 'active' : ''}`}
              style={{
                marginBottom: '0.25rem',
                opacity: dragging === section.id ? 0.5 : 1,
                outline: dragOver === section.id && dragging !== section.id ? '2px solid var(--brand)' : 'none',
              }}
              onClick={() => setActiveId(section.id)}
            >
              <GripVertical size={14} className="section-drag-handle" />
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{section.icon ?? getSectionIcon(section.type)}</span>
              <span style={{ flex: 1, fontSize: '0.8125rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {section.title}
              </span>
              <div style={{ display: 'flex', gap: '0.125rem', flexShrink: 0 }}>
                <button
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={e => { e.stopPropagation(); handleToggleVisible(section) }}
                  title={section.visible ? 'Nascondi' : 'Mostra'}
                  style={{ padding: '0.25rem', opacity: section.visible ? 1 : 0.4 }}
                >
                  {section.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={e => { e.stopPropagation(); handleDeleteSection(section.id) }}
                  title="Elimina sezione"
                  style={{ padding: '0.25rem', color: '#f87171' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add section + Theme */}
        <div style={{ padding: '0.625rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => { setShowAddPanel(!showAddPanel); setShowThemePanel(false) }}
          >
            <Plus size={14} />
            Aggiungi sezione
          </button>

          <button
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8125rem' }}
            onClick={() => { setShowThemePanel(!showThemePanel); setShowAddPanel(false) }}
          >
            <Palette size={13} />
            Tema e colori
          </button>

          {showAddPanel && (
            <div
              style={{
                position: 'absolute',
                bottom: '120px',
                left: '10px',
                width: '260px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '0.625rem',
                boxShadow: 'var(--shadow-card)',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', padding: '0.25rem 0.375rem', marginBottom: '0.25rem' }}>
                Scegli tipo sezione
              </p>
              {SECTION_TYPES.map(type => (
                <button
                  key={type}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', gap: '0.625rem', padding: '0.5rem 0.625rem' }}
                  onClick={() => handleAddSection(type)}
                  disabled={isPending}
                >
                  <span>{getSectionIcon(type)}</span>
                  <span style={{ fontSize: '0.8125rem' }}>{getSectionLabel(type)}</span>
                </button>
              ))}
            </div>
          )}

          {showThemePanel && (
            <div
              style={{
                position: 'absolute',
                bottom: '120px',
                left: '10px',
                width: '260px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '1rem',
                boxShadow: 'var(--shadow-card)',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}
            >
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                Tema guida
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['light', 'dark'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: theme === t ? '2px solid var(--brand)' : '1px solid var(--border)',
                      background: t === 'dark' ? '#0a0a0f' : '#f8f8fc',
                      color: t === 'dark' ? '#f4f4f8' : '#1a1a2e',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {t === 'light' ? '☀️ Chiaro' : '🌙 Scuro'}
                  </button>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>Colore accento</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['#FF5A5F', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'].map(color => (
                    <button
                      key={color}
                      onClick={() => setAccent(color)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: color,
                        border: accent === color ? '3px solid var(--text-primary)' : '2px solid transparent',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={accent}
                    onChange={e => setAccent(e.target.value)}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer' }}
                    title="Colore personalizzato"
                  />
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSaveTheme}
                disabled={isPending}
                style={{ justifyContent: 'center' }}
              >
                {isPending ? <Loader2 size={13} className="animate-spin" /> : null}
                Salva tema
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: section editor */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: 'var(--bg-primary)' }}>
        {activeSection ? (
          <SectionEditorPanel
            section={activeSection}
            guideId={guide.id}
            onUpdate={updated => {
              setSections(prev => prev.map(s => s.id === updated.id ? updated : s))
              refreshPreview()
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', textAlign: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '3rem' }}>📝</span>
            <p>Seleziona una sezione dalla lista per modificarla</p>
          </div>
        )}
      </div>

      {/* Right: mobile preview */}
      <div className="editor-preview">
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Anteprima mobile
            </p>
            <button
              onClick={refreshPreview}
              title="Aggiorna anteprima"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.125rem' }}
            >
              <RefreshCw size={12} />
            </button>
          </div>
          <div className="phone-frame">
            <div className="phone-notch" />
            <iframe
              key={previewKey}
              ref={iframeRef}
              src={`/g/${propertySlug}?preview=1`}
              style={{ width: '100%', height: '100%', border: 'none', paddingTop: '20px' }}
              title="Anteprima guida"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Section editor panel ─────────────────────────────────────────────────────

function SectionEditorPanel({
  section,
  guideId,
  onUpdate,
}: {
  section: GuideSection
  guideId: string
  onUpdate: (updated: GuideSection) => void
}) {
  const [title, setTitle] = useState(section.title)
  const [content, setContent] = useState(section.content)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    startTransition(async () => {
      await updateSection(section.id, guideId, { title, content })
      onUpdate({ ...section, title, content })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      posthog.capture('guide_section_saved', { guide_id: guideId, section_id: section.id, section_type: section.type })
    })
  }

  return (
    <div style={{ maxWidth: '540px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{section.icon ?? getSectionIcon(section.type)}</span>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>{getSectionLabel(section.type)}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Modifica contenuto sezione</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Title */}
        <div className="form-group">
          <label className="label">Titolo sezione</label>
          <input
            type="text"
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* Content by type */}
        <SectionContentEditor type={section.type} content={content} onChange={setContent} />

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? <><Loader2 size={14} className="animate-spin" />Salvataggio...</> : saved ? '✓ Salvato!' : 'Salva sezione'}
        </button>
      </div>
    </div>
  )
}

function SectionContentEditor({
  type,
  content,
  onChange,
}: {
  type: string
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  switch (type) {
    case 'wifi':
      return (
        <>
          <div className="form-group">
            <label className="label">Nome rete (SSID)</label>
            <input type="text" className="input" value={(content.network as string) ?? ''} onChange={e => onChange({ ...content, network: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input type="text" className="input" value={(content.password as string) ?? ''} onChange={e => onChange({ ...content, password: e.target.value })} />
          </div>
        </>
      )

    case 'checkin':
      return (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="label">Check-in</label>
              <input type="text" className="input" placeholder="es. 15:00" value={(content.checkin as string) ?? ''} onChange={e => onChange({ ...content, checkin: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Check-out</label>
              <input type="text" className="input" placeholder="es. 11:00" value={(content.checkout as string) ?? ''} onChange={e => onChange({ ...content, checkout: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Istruzioni accesso</label>
            <textarea className="textarea" rows={4} value={(content.instructions as string) ?? ''} onChange={e => onChange({ ...content, instructions: e.target.value })} />
          </div>
        </>
      )

    case 'map':
      return (
        <>
          <div className="form-group">
            <label className="label">Indirizzo</label>
            <input type="text" className="input" value={(content.address as string) ?? ''} onChange={e => onChange({ ...content, address: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Link Google Maps</label>
            <input type="url" className="input" placeholder="https://maps.google.com/..." value={(content.link as string) ?? ''} onChange={e => onChange({ ...content, link: e.target.value })} />
          </div>
        </>
      )

    case 'rules':
    case 'checkout_checklist': {
      const key = type === 'rules' ? 'rules' : 'items'
      const items = ((content[key] ?? []) as string[])
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <label className="label">Elementi (uno per riga)</label>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                className="input"
                value={item}
                placeholder={type === 'rules' ? 'es. Vietato fumare' : 'es. Chiudere le finestre'}
                onChange={e => {
                  const newItems = [...items]
                  newItems[idx] = e.target.value
                  onChange({ ...content, [key]: newItems })
                }}
              />
              <button type="button" className="btn btn-ghost btn-sm btn-icon" onClick={() => onChange({ ...content, [key]: items.filter((_, i) => i !== idx) })} style={{ color: '#f87171', flexShrink: 0 }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange({ ...content, [key]: [...items, ''] })} style={{ alignSelf: 'flex-start' }}>
            <Plus size={13} /> Aggiungi elemento
          </button>
        </div>
      )
    }

    case 'emergency': {
      const contacts = (content.contacts as Array<{ label: string; number: string }>) ?? []
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label className="label">Numeri di emergenza / Contatti utili</label>
          {contacts.map((contact, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                className="input"
                placeholder="es. Polizia, Taxi, Host"
                value={contact.label}
                onChange={e => {
                  const newContacts = [...contacts]
                  newContacts[index] = { ...contact, label: e.target.value }
                  onChange({ ...content, contacts: newContacts })
                }}
                style={{ flex: 1 }}
              />
              <input
                type="text"
                className="input"
                placeholder="+39 ..."
                value={contact.number}
                onChange={e => {
                  const newContacts = [...contacts]
                  newContacts[index] = { ...contact, number: e.target.value }
                  onChange({ ...content, contacts: newContacts })
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-icon"
                onClick={() => onChange({ ...content, contacts: contacts.filter((_, i) => i !== index) })}
                style={{ color: '#f87171', flexShrink: 0 }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onChange({ ...content, contacts: [...contacts, { label: '', number: '' }] })}
            style={{ alignSelf: 'flex-start' }}
          >
            <Plus size={13} /> Aggiungi contatto
          </button>
        </div>
      )
    }

    case 'faq': {
      const items = (content.items as Array<{ q: string; a: string }>) ?? []
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <label className="label">Domande e risposte</label>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.875rem', background: 'var(--bg-input)', borderRadius: '8px', position: 'relative' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-icon"
                onClick={() => onChange({ ...content, items: items.filter((_, i) => i !== idx) })}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: '#f87171' }}
              >
                <Trash2 size={12} />
              </button>
              <input
                type="text"
                className="input"
                placeholder="Domanda..."
                value={item.q}
                onChange={e => {
                  const newItems = [...items]; newItems[idx] = { ...item, q: e.target.value }
                  onChange({ ...content, items: newItems })
                }}
              />
              <textarea
                className="textarea"
                rows={2}
                placeholder="Risposta..."
                value={item.a}
                onChange={e => {
                  const newItems = [...items]; newItems[idx] = { ...item, a: e.target.value }
                  onChange({ ...content, items: newItems })
                }}
              />
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange({ ...content, items: [...items, { q: '', a: '' }] })} style={{ alignSelf: 'flex-start' }}>
            <Plus size={13} /> Aggiungi domanda
          </button>
        </div>
      )
    }

    case 'recommendations': {
      const items = (content.items as Array<{ name: string; description: string; type: string }>) ?? []
      const categories = ['Ristorante', 'Bar', 'Supermercato', 'Attrattiva', 'Trasporto', 'Farmacia', 'Altro']
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <label className="label">Consigli locali</label>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.875rem', background: 'var(--bg-input)', borderRadius: '8px', position: 'relative' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-icon"
                onClick={() => onChange({ ...content, items: items.filter((_, i) => i !== idx) })}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: '#f87171' }}
              >
                <Trash2 size={12} />
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', paddingRight: '2rem' }}>
                <input type="text" className="input" placeholder="Nome posto" value={item.name} onChange={e => { const n = [...items]; n[idx] = { ...item, name: e.target.value }; onChange({ ...content, items: n }) }} />
                <select className="input" value={item.type || ''} onChange={e => { const n = [...items]; n[idx] = { ...item, type: e.target.value }; onChange({ ...content, items: n }) }} style={{ width: 'auto', minWidth: '130px' }}>
                  <option value="">Categoria</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <textarea className="textarea" rows={2} placeholder="Breve descrizione..." value={item.description} onChange={e => { const n = [...items]; n[idx] = { ...item, description: e.target.value }; onChange({ ...content, items: n }) }} />
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange({ ...content, items: [...items, { name: '', description: '', type: '' }] })} style={{ alignSelf: 'flex-start' }}>
            <Plus size={13} /> Aggiungi consiglio
          </button>
        </div>
      )
    }

    case 'how_to': {
      const steps = (content.steps as string[]) ?? []
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div className="form-group">
            <label className="label">Nome dispositivo / sistema</label>
            <input type="text" className="input" placeholder="es. Lavatrice, Riscaldamento, TV..." value={(content.device as string) ?? ''} onChange={e => onChange({ ...content, device: e.target.value })} />
          </div>
          <div>
            <label className="label" style={{ marginBottom: '0.625rem', display: 'block' }}>Passaggi</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {steps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)', width: '20px', flexShrink: 0, textAlign: 'center' }}>{idx + 1}</span>
                  <input type="text" className="input" value={step} placeholder={`Passo ${idx + 1}...`} onChange={e => { const n = [...steps]; n[idx] = e.target.value; onChange({ ...content, steps: n }) }} />
                  <button type="button" className="btn btn-ghost btn-sm btn-icon" onClick={() => onChange({ ...content, steps: steps.filter((_, i) => i !== idx) })} style={{ color: '#f87171', flexShrink: 0 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange({ ...content, steps: [...steps, ''] })} style={{ alignSelf: 'flex-start' }}>
                <Plus size={13} /> Aggiungi passo
              </button>
            </div>
          </div>
        </div>
      )
    }

    case 'gallery': {
      const images = (content.images as string[]) ?? []
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <label className="label">URL immagini</label>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Inserisci gli URL delle immagini (JPG, PNG, WebP). Usa servizi come Imgur, Cloudinary o Supabase Storage.</p>
          {images.map((url, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {url && <img src={url} alt={`img-${idx}`} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, background: 'var(--bg-input)' }} />}
              <input type="url" className="input" placeholder="https://..." value={url} onChange={e => { const n = [...images]; n[idx] = e.target.value; onChange({ ...content, images: n }) }} />
              <button type="button" className="btn btn-ghost btn-sm btn-icon" onClick={() => onChange({ ...content, images: images.filter((_, i) => i !== idx) })} style={{ color: '#f87171', flexShrink: 0 }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange({ ...content, images: [...images, ''] })} style={{ alignSelf: 'flex-start' }}>
            <Plus size={13} /> Aggiungi immagine
          </button>
        </div>
      )
    }

    case 'welcome':
    case 'custom':
    default:
      return (
        <div className="form-group">
          <label className="label">Testo della sezione</label>
          <textarea
            className="textarea"
            rows={10}
            value={(content.text as string) ?? ''}
            onChange={e => onChange({ ...content, text: e.target.value })}
            placeholder="Scrivi qui i dettagli di questa sezione..."
          />
        </div>
      )
  }
}
