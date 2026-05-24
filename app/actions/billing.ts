'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function changePlan(newPlan: 'free' | 'pro' | 'business') {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non autorizzato' }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ plan: newPlan, plan_status: 'active' })
      .eq('id', user.id)

    if (error) {
      console.error('Error changing plan:', error)
      return { success: false, error: 'Errore durante il cambio piano' }
    }

    revalidatePath('/dashboard/settings/billing')
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (err: any) {
    console.error('Exception changing plan:', err)
    return { success: false, error: err.message || 'Errore imprevisto' }
  }
}
