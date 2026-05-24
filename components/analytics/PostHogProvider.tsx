'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { createClient } from '@/lib/supabase/client'

// Inizializzazione sicura solo lato client
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    person_profiles: 'always',
    capture_pageview: false // Disabilitiamo il tracciamento automatico per gestirlo manualmente in Next.js
  })
}

// Componente dedicato per il tracciamento dei cambi pagina (Instrumentation)
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])
  
  return null
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient()
    
    // Recupera la sessione corrente all'avvio dell'app per identificare l'utente
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Controlla se l'utente è un amministratore
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()

        if (profile?.is_admin) {
          posthog.opt_out_capturing()
        } else if (session.user.email) {
          posthog.opt_in_capturing()
          posthog.identify(session.user.email, {
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name
          })
        }
      }
    })

    // Ascolta le variazioni dello stato di autenticazione Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        // Controlla se l'utente è un amministratore
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()

        if (profile?.is_admin) {
          posthog.opt_out_capturing()
        } else if (session.user.email) {
          posthog.opt_in_capturing()
          posthog.identify(session.user.email, {
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name
          })
        }
      } else if (event === 'SIGNED_OUT') {
        posthog.opt_in_capturing() // Ripristina il tracciamento per utenti anonimi
        posthog.reset()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
