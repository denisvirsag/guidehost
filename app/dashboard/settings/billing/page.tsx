import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import BillingClient from '@/components/dashboard/settings/BillingClient'

export const metadata: Metadata = { title: 'Piano e Fatture' }

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_status, stripe_customer_id')
    .eq('id', user!.id)
    .single()

  const currentPlan = profile?.plan ?? 'free'
  const status = profile?.plan_status

  return <BillingClient currentPlan={currentPlan} status={status} />
}

