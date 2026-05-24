import AdminOverviewClient from '@/components/admin/AdminOverviewClient'
import { getTotalUsers, getLiveUsers, getRecentReplays, getDailySessions } from '@/app/actions/admin'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Gestione e monitoraggio della piattaforma',
}

export default async function AdminDashboardPage() {
  const [totalUsers, liveUsers, replays, dailySessions] = await Promise.all([
    getTotalUsers(),
    getLiveUsers(),
    getRecentReplays(),
    getDailySessions(),
  ])

  return (
    <AdminOverviewClient 
      initialTotalUsers={totalUsers} 
      initialLiveUsers={liveUsers}
      initialReplays={replays}
      initialDailySessions={dailySessions.today}
      initialDailyDelta={dailySessions.deltaPercent}
    />
  )
}
