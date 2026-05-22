'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { SectionType } from '@/types'
import { getSectionLabel, getSectionIcon } from '@/lib/utils'

export async function publishGuide(guideId: string, published: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('guides')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', guideId)
    .eq('owner_id', user.id)

  revalidatePath(`/dashboard/guides/${guideId}`)
}

export async function updateGuideTheme(
  guideId: string,
  theme: string,
  accentColor: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('guides')
    .update({ theme, accent_color: accentColor, updated_at: new Date().toISOString() })
    .eq('id', guideId)
    .eq('owner_id', user.id)

  revalidatePath(`/dashboard/guides/${guideId}`)
}

export async function addSection(guideId: string, type: SectionType) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get current max order
  const { data: sections } = await supabase
    .from('guide_sections')
    .select('order')
    .eq('guide_id', guideId)
    .order('order', { ascending: false })
    .limit(1)

  const maxOrder = sections?.[0]?.order ?? -1

  // Default content per type
  const defaultContent: Record<string, Record<string, unknown>> = {
    welcome: { text: 'Benvenuti nella nostra casa! Siamo felici di avervi qui.' },
    wifi: { network: '', password: '' },
    checkin: { checkin: '', checkout: '', instructions: '' },
    rules: { rules: ['Vietato fumare', 'Rispettare il silenzio dopo le 22:00'] },
    how_to: { device: '', steps: [] },
    map: { address: '', link: '' },
    recommendations: { items: [] },
    emergency: { contacts: [{ label: 'Host', number: '' }] },
    faq: { items: [] },
    gallery: { images: [] },
    checkout_checklist: { items: ['Chiudere le finestre', 'Lasciare le chiavi sul tavolo'] },
    custom: { text: '' },
  }

  const { data: newSection } = await supabase.from('guide_sections').insert({
    guide_id: guideId,
    type,
    title: getSectionLabel(type),
    icon: getSectionIcon(type),
    content: defaultContent[type] ?? {},
    order: maxOrder + 1,
    visible: true,
  }).select().single()

  revalidatePath(`/dashboard/guides/${guideId}`)

  // Return the new section so the client can update local state immediately
  return newSection
}

export async function updateSection(
  sectionId: string,
  guideId: string,
  updates: { title?: string; content?: Record<string, unknown>; visible?: boolean }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('guide_sections')
    .update(updates)
    .eq('id', sectionId)

  // Update guide updated_at
  await supabase
    .from('guides')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', guideId)
    .eq('owner_id', user.id)

  revalidatePath(`/dashboard/guides/${guideId}`)
}

export async function deleteSection(sectionId: string, guideId: string) {
  const supabase = await createClient()
  await supabase.from('guide_sections').delete().eq('id', sectionId)
  revalidatePath(`/dashboard/guides/${guideId}`)
}

export async function reorderSections(
  guideId: string,
  orderedIds: string[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Update order for each section
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from('guide_sections')
        .update({ order: index })
        .eq('id', id)
    )
  )

  revalidatePath(`/dashboard/guides/${guideId}`)
}
