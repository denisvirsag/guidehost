'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(state: { error?: string } | undefined, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('Login attempt for:', email)

  if (!email || !password) {
    return { error: 'Email e password sono obbligatori.' }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error('Login error from Supabase:', error.message)
      return { error: `Errore: ${error.message}` }
    }

    console.log('Login successful for user:', data.user?.id)
  } catch (e: any) {
    console.error('Unexpected login exception:', e)
    return { error: `Errore imprevisto: ${e.message || e}` }
  }

  redirect('/dashboard')
}

export async function signup(state: { error?: string } | undefined, formData: FormData) {
  const supabase = await createClient()

  const fullName = formData.get('full_name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('Signup attempt for:', email, 'Name:', fullName)

  if (!fullName || !email || !password) {
    return { error: 'Tutti i campi sono obbligatori.' }
  }

  if (password.length < 8) {
    return { error: 'La password deve essere di almeno 8 caratteri.' }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      console.error('Signup error from Supabase:', error.message)
      if (error.message.includes('already registered')) {
        return { error: 'Email già registrata. Prova ad accedere.' }
      }
      return { error: `Errore di registrazione: ${error.message}` }
    }

    console.log('Signup response:', {
      userId: data.user?.id,
      identities: data.user?.identities,
      session: !!data.session
    })

    if (data.user && !data.session) {
      console.log('User signed up but requires email confirmation.')
      return { error: 'Registrazione completata! Controlla la tua email per confermare l\'account prima di accedere.' }
    }
  } catch (e: any) {
    console.error('Unexpected signup exception:', e)
    return { error: `Errore imprevisto: ${e.message || e}` }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
