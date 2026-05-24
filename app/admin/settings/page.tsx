import AdminSettingsClient from '@/components/admin/AdminSettingsClient'
import { getAdminSettings } from '@/app/actions/admin'

export const metadata = {
  title: 'Impostazioni Platform - Admin Dashboard',
  description: 'Configura i parametri generali della piattaforma',
}

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings()

  return <AdminSettingsClient initialSettings={settings} />
}
