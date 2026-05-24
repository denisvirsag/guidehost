import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { getPostHogClient } from '@/lib/posthog-server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return NextResponse.redirect(new URL('/dashboard/settings/billing', req.url))
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/dashboard/settings/billing`,
    })

    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: user.id,
      event: 'billing_portal_accessed',
      properties: { stripe_customer_id: profile.stripe_customer_id },
    })

    return NextResponse.redirect(session.url)
  } catch (error: any) {
    console.error('Stripe portal error:', error)
    return NextResponse.redirect(
      new URL(`/dashboard/settings/billing?error=${encodeURIComponent(error.message)}`, req.url)
    )
  }
}
