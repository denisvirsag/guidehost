import AdminReplaysClient from '@/components/admin/AdminReplaysClient'
import { getRecentReplays } from '@/app/actions/admin'

export const metadata = {
  title: 'Session Replays - Admin Dashboard',
  description: 'Analizza le registrazioni delle sessioni utente',
}

export default async function AdminReplaysPage() {
  const replays = await getRecentReplays()

  return <AdminReplaysClient initialReplays={replays} />
}
