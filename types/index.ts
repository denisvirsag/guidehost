export type Plan = 'free' | 'pro' | 'business'
export type PlanStatus = 'active' | 'canceled' | 'past_due' | 'trialing'
export type GuideTheme = 'light' | 'dark'

export type SectionType =
  | 'welcome'
  | 'wifi'
  | 'checkin'
  | 'rules'
  | 'how_to'
  | 'map'
  | 'recommendations'
  | 'emergency'
  | 'faq'
  | 'gallery'
  | 'checkout_checklist'
  | 'custom'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  stripe_customer_id: string | null
  plan: Plan
  plan_status: PlanStatus | null
  created_at: string
}

export interface Property {
  id: string
  owner_id: string
  name: string
  address: string | null
  cover_image_url: string | null
  slug: string
  wifi_name: string | null
  wifi_password: string | null
  check_in_time: string | null
  check_out_time: string | null
  created_at: string
}

export interface Guide {
  id: string
  property_id: string
  owner_id: string
  title: string
  published: boolean
  theme: GuideTheme
  accent_color: string
  views_count: number
  created_at: string
  updated_at: string
  // Relations
  property?: Property
}

export interface GuideSection {
  id: string
  guide_id: string
  type: SectionType
  title: string
  content: Record<string, unknown>
  icon: string | null
  order: number
  visible: boolean
}

export interface GuideView {
  id: string
  guide_id: string
  viewed_at: string
  country: string | null
}

// Plan limits
export const PLAN_LIMITS: Record<Plan, { properties: number; sections: number; analytics: boolean }> = {
  free: { properties: 1, sections: 5, analytics: false },
  pro: { properties: 5, sections: Infinity, analytics: true },
  business: { properties: Infinity, sections: Infinity, analytics: true },
}

export const PLAN_PRICES: Record<Plan, number> = {
  free: 0,
  pro: 9,
  business: 29,
}
