import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { getPostHogClient } from '@/lib/posthog-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const plan = searchParams.get('plan') as 'pro' | 'business' | null

  if (!plan || !['pro', 'business'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, plan')
    .eq('id', user.id)
    .single()

  const priceId = plan === 'pro'
    ? process.env.STRIPE_PRICE_PRO!
    : process.env.STRIPE_PRICE_BUSINESS!

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: profile?.stripe_customer_id || undefined,
      customer_email: !profile?.stripe_customer_id ? user.email : undefined,
      metadata: { user_id: user.id },
      success_url: `${appUrl}/dashboard/settings/billing?success=1`,
      cancel_url: `${appUrl}/dashboard/settings/billing?canceled=1`,
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: plan === 'pro' ? 14 : undefined,
      },
    })

    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: user.id,
      event: 'checkout_initiated',
      properties: { plan, current_plan: profile?.plan },
    })

    return NextResponse.redirect(session.url!)
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.redirect(
      new URL(`/dashboard/settings/billing?error=${encodeURIComponent(error.message)}`, req.url)
    )
  }
}
