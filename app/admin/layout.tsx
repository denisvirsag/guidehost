import { redirect } from 'next/navigation'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    // If authenticated but not an admin, redirect to the normal dashboard or home
    redirect('/dashboard')
  }

  return (
    <AdminLayoutWrapper adminName={profile.full_name || "Admin"}>
      {children}
    </AdminLayoutWrapper>
  )
}
