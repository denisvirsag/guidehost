import { createClient } from '@/lib/supabase/server'
import PropertiesClient from '@/components/dashboard/PropertiesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Proprietà' }

export default async function PropertiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: properties } = await supabase
    .from('properties')
    .select('*, guides(id, published)')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  return <PropertiesClient properties={properties ?? []} />
}
