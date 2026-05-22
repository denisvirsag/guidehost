import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
})

export const STRIPE_PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRICE_PRO!,
    name: 'Pro',
    amount: 900, // €9.00 in cents
  },
  business: {
    priceId: process.env.STRIPE_PRICE_BUSINESS!,
    name: 'Business',
    amount: 2900, // €29.00 in cents
  },
}
