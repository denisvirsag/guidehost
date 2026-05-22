import { createClient } from '@/lib/supabase/server'
import QrCodesClient from '@/components/dashboard/QrCodesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'QR Code' }

export default async function QrCodesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: guides } = await supabase
    .from('guides')
    .select('id, title, published, properties(name, slug)')
    .eq('owner_id', user!.id)
    .eq('published', true)
    .order('created_at', { ascending: false })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  return <QrCodesClient guides={(guides as any) ?? []} appUrl={appUrl} />
}
