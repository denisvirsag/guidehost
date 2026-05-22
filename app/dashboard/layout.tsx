import { createClient, getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s — Dashboard | GuideHost',
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use cached getUser — shared with middleware, no extra round-trip
  const [user, supabase] = await Promise.all([getUser(), createClient()])

  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan')
    .eq('id', user.id)
    .single()

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      <DashboardLayoutWrapper
        plan={profile?.plan ?? 'free'}
        userName={profile?.full_name ?? user.email?.split('@')[0]}
      >
        {children}
      </DashboardLayoutWrapper>
    </div>
  )
}
