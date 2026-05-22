import { createClient } from '@/lib/supabase/server'
import OverviewClient from '@/components/dashboard/OverviewClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Overview' }

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch stats in parallel
  const [propertiesRes, guidesRes, viewsRes, profileRes] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact' }).eq('owner_id', user!.id),
    supabase.from('guides').select('id, published', { count: 'exact' }).eq('owner_id', user!.id),
    supabase.from('guide_views')
      .select('id', { count: 'exact' })
      .in(
        'guide_id',
        (await supabase.from('guides').select('id').eq('owner_id', user!.id)).data?.map(g => g.id) ?? []
      )
      .gte('viewed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('profiles').select('full_name, plan').eq('id', user!.id).single(),
  ])

  const propertyCount = propertiesRes.count ?? 0
  const guideCount = guidesRes.count ?? 0
  const publishedCount = guidesRes.data?.filter(g => g.published).length ?? 0
  const weeklyViews = viewsRes.count ?? 0
  const firstName = profileRes.data?.full_name?.split(' ')[0] ?? 'Host'
  const plan = profileRes.data?.plan ?? 'free'

  // Recent properties
  const { data: recentProperties } = await supabase
    .from('properties')
    .select('id, name, cover_image_url, slug, created_at')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // Map properties to fit the expected prop type safely
  const mappedProperties = (recentProperties ?? []).map(p => ({
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
