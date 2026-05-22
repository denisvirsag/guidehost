import { createClient, getUser } from '@/lib/supabase/server'
import GuidesClient from '@/components/dashboard/GuidesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Guide' }

export default async function GuidesPage() {
  const [user, supabase] = await Promise.all([getUser(), createClient()])

  const { data: guides } = await supabase
    .from('guides')
    .select('*, properties(name, slug)')
    .eq('owner_id', user!.id)
    .order('updated_at', { ascending: false })

  return <GuidesClient guides={(guides as any) ?? []} />
}
