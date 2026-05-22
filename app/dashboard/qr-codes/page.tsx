import { createClient, getUser } from '@/lib/supabase/server'
import QrCodesClient from '@/components/dashboard/QrCodesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'QR Code' }

export default async function QrCodesPage() {
  const [user, supabase] = await Promise.all([getUser(), createClient()])

  const { data: guides } = await supabase
    .from('guides')
    .select('id, title, published, properties(name, slug)')
    .eq('owner_id', user!.id)
    .eq('published', true)
    .order('created_at', { ascending: false })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  return <QrCodesClient guides={(guides as any) ?? []} appUrl={appUrl} />
}
