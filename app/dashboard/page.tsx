import { createClient, getUser } from '@/lib/supabase/server'
import OverviewClient from '@/components/dashboard/OverviewClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Overview' }

export default async function DashboardPage() {
  const [user, supabase] = await Promise.all([getUser(), createClient()])

  // Fetch all data in parallel — single roundtrip batch
  const [propertiesRes, guidesRes, profileRes, recentPropertiesRes] = await Promise.all([
    supabase.from('properties').select('id, name, cover_image_url, slug, created_at', { count: 'exact' }).eq('owner_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('guides').select('id, published', { count: 'exact' }).eq('owner_id', user!.id),
    supabase.from('profiles').select('full_name, plan').eq('id', user!.id).single(),
    supabase.from('properties').select('id, name, cover_image_url, slug, created_at').eq('owner_id', user!.id).order('created_at', { ascending: false }).limit(3),
  ])

  // Weekly views — needs guide IDs first, but we can derive from guidesRes
  const guideIds = guidesRes.data?.map(g => g.id) ?? []
  let weeklyViews = 0
  if (guideIds.length > 0) {
    const { count } = await supabase
      .from('guide_views')
      .select('id', { count: 'exact', head: true })
      .in('guide_id', guideIds)
      .gte('viewed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    weeklyViews = count ?? 0
  }

  const propertyCount = propertiesRes.count ?? 0
  const guideCount = guidesRes.count ?? 0
  const publishedCount = guidesRes.data?.filter(g => g.published).length ?? 0
  const firstName = profileRes.data?.full_name?.split(' ')[0] ?? 'Host'
  const plan = profileRes.data?.plan ?? 'free'

  const mappedProperties = (recentPropertiesRes.data ?? []).map(p => ({
    id: p.id,
    name: p.name,
    cover_image_url: p.cover_image_url,
    slug: p.slug,
    created_at: p.created_at,
  }))

  return (
    <OverviewClient
      firstName={firstName}
      plan={plan}
      propertyCount={propertyCount}
      guideCount={guideCount}
      publishedCount={publishedCount}
      weeklyViews={weeklyViews}
      recentProperties={mappedProperties}
    />
  )
}
