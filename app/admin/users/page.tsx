import AdminUsersClient from '@/components/admin/AdminUsersClient'
import { getAllUsers } from '@/app/actions/admin'

export const metadata = {
  title: 'Gestione Utenti - Admin Dashboard',
  description: 'Visualizza e gestisci tutti gli utenti registrati',
}

export default async function AdminUsersPage() {
  const users = await getAllUsers()

  return <AdminUsersClient initialUsers={users} />
}
