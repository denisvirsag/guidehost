'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { generateSlug } from '@/lib/utils'

export async function createProperty(
  state: { error?: string } | undefined,
  formData: FormData
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const name = (formData.get('name') as string)?.trim()
  const address = (formData.get('address') as string)?.trim()
  const wifiName = (formData.get('wifi_name') as string)?.trim()
  const wifiPassword = (formData.get('wifi_password') as string)?.trim()
  const checkIn = (formData.get('check_in_time') as string)?.trim()
  const checkOut = (formData.get('check_out_time') as string)?.trim()

  if (!name) return { error: 'Il nome della proprietà è obbligatorio.' }

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

  if ((count ?? 0) >= limit) {
    return {
      error: `Hai raggiunto il limite di ${limit} propr${limit === 1 ? 'ietà' : 'ietà'} per il piano ${profile?.plan ?? 'free'}. Passa a un piano superiore.`,
    }
  }

  const slug = generateSlug(name)

  const { data: property, error } = await supabase
    .from('properties')
    .insert({
      owner_id: user.id,
      name,
      address: address || null,
      wifi_name: wifiName || null,
      wifi_password: wifiPassword || null,
      check_in_time: checkIn || null,
      check_out_time: checkOut || null,
      slug,
    })
    .select()
    .single()

  if (error) {
    console.error('createProperty Supabase error:', JSON.stringify(error, null, 2))
    return { error: 'Errore durante la creazione della proprietà. Riprova.' }
  }

  // Auto-create a guide for the property
  const { data: guide } = await supabase.from('guides').insert({
    property_id: property.id,
    owner_id: user.id,
    title: `Guida — ${name}`,
  }).select().single()

  // Auto-create default sections for the new guide
  if (guide) {
    await supabase.from('guide_sections').insert([
      {
        guide_id: guide.id,
        type: 'welcome',
        title: 'Benvenuto',
        icon: '👋',
        content: { text: `Benvenuto nella nostra casa!\n\nSiamo felici di ospitarti e speriamo che il tuo soggiorno sia piacevole. In questa guida trovi tutte le informazioni utili per vivere al meglio la tua permanenza.\n\nPer qualsiasi necessità non esitare a contattarci.` },
        order: 0,
        visible: true,
      },
      {
        guide_id: guide.id,
        type: 'wifi',
        title: 'Wi-Fi',
        icon: '📶',
        content: { network: wifiName || '', password: wifiPassword || '' },
        order: 1,
        visible: true,
      },
      {
        guide_id: guide.id,
        type: 'checkin',
        title: 'Check-in / Check-out',
        icon: '🔑',
        content: { checkin: checkIn || '', checkout: checkOut || '', instructions: '' },
        order: 2,
        visible: true,
      },
      {
        guide_id: guide.id,
        type: 'rules',
        title: 'Regole della casa',
        icon: '📋',
        content: { rules: ['Vietato fumare all\'interno (penale €150)', 'Vietato organizzare feste (penale €200)', 'Rispettare il silenzio dopo le 22:00', 'Tenere la casa in ordine'] },
        order: 3,
        visible: true,
      },
    ])
  }

  redirect(`/dashboard/properties/${property.id}`)
}

export async function updateProperty(
  propertyId: string,
  state: { error?: string } | undefined,
  formData: FormData
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const name = (formData.get('name') as string)?.trim()
  const address = (formData.get('address') as string)?.trim()
  const wifiName = (formData.get('wifi_name') as string)?.trim()
  const wifiPassword = (formData.get('wifi_password') as string)?.trim()
  const checkIn = (formData.get('check_in_time') as string)?.trim()
  const checkOut = (formData.get('check_out_time') as string)?.trim()

  if (!name) return { error: 'Il nome della proprietà è obbligatorio.' }

  const { error } = await supabase
    .from('properties')
    .update({
      name,
      address: address || null,
      wifi_name: wifiName || null,
      wifi_password: wifiPassword || null,
      check_in_time: checkIn || null,
      check_out_time: checkOut || null,
    })
    .eq('id', propertyId)
    .eq('owner_id', user.id)

  if (error) return { error: 'Errore durante il salvataggio.' }

  redirect(`/dashboard/properties/${propertyId}`)
}

export async function deleteProperty(propertyId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .eq('owner_id', user.id)

  redirect('/dashboard/properties')
}
