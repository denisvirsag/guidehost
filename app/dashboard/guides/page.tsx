import { createClient } from '@/lib/supabase/server'
import GuidesClient from '@/components/dashboard/GuidesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Guide' }

export default async function GuidesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: guides } = await supabase
    .from('guides')
    .select('*, properties(name, slug)')
    .eq('owner_id', user!.id)
    .order('updated_at', { ascending: false })

  return <GuidesClient guides={(guides as any) ?? []} />
}
