import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const priceId = subscription.items.data[0]?.price.id
      const status = subscription.status

      let plan = 'free'
      if (priceId === process.env.STRIPE_PRICE_PRO) plan = 'pro'
      else if (priceId === process.env.STRIPE_PRICE_BUSINESS) plan = 'business'

      await supabase
        .from('profiles')
        .update({ plan, plan_status: status })
        .eq('stripe_customer_id', customerId)

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('profiles')
        .update({ plan: 'free', plan_status: 'canceled' })
        .eq('stripe_customer_id', subscription.customer as string)
      break
    }
  }

  return NextResponse.json({ received: true })
}
