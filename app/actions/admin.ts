'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// MOCK data fallback for Replays
const MOCK_REPLAYS = [
  { id: '1', user: 'Anonimo', device: 'mobile', country: 'Italia', countryCode: 'IT', duration: '2m 14s', events: 142, timeAgo: '2 min fa', avatarColor: 'bg-emerald-100 text-emerald-600', replayUrl: '#' },
  { id: '2', user: 'host_84@email.com', device: 'desktop', country: 'Spagna', countryCode: 'ES', duration: '14m 05s', events: 890, timeAgo: '12 min fa', avatarColor: 'bg-blue-100 text-blue-600', replayUrl: '#' },
  { id: '3', user: 'Anonimo', device: 'mobile', country: 'Stati Uniti', countryCode: 'US', duration: '0m 45s', events: 34, timeAgo: '1 ora fa', avatarColor: 'bg-orange-100 text-orange-600', replayUrl: '#' },
  { id: '4', user: 'marco.rossi@gmail.com', device: 'desktop', country: 'Italia', countryCode: 'IT', duration: '5m 20s', events: 412, timeAgo: '3 ore fa', avatarColor: 'bg-purple-100 text-purple-600', replayUrl: '#' },
]

export async function getTotalUsers(): Promise<number> {
  // If the admin key isn't provided in .env, we gracefully return a fallback
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key') {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing or invalid. Returning fallback user count.')
    return 4892 // Fallback mock number
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://puefhutexocnsxahdhze.supabase.co'
    const supabase = createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // We fetch the count using the admin API
    const { data, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Error fetching users from Supabase Admin:', error)
      return 0
    }

    return data.users.length
  } catch (error) {
    console.error('Exception fetching total users:', error)
    return 0
  }
}

export async function getLiveUsers(): Promise<number> {
  const projectId = process.env.POSTHOG_PROJECT_ID
  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY
  
  if (!projectId || !personalApiKey || projectId === 'your_posthog_project_id' || personalApiKey === 'your_posthog_personal_api_key') {
    console.warn('PostHog Server keys missing. Returning fallback live user count.')
    return 12 // Fallback mock
  }

  try {
    const url = `https://eu.posthog.com/api/projects/${projectId}/query/`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${personalApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
            kind: "HogQLQuery",
            query: "SELECT count(DISTINCT distinct_id) FROM events WHERE timestamp >= now() - INTERVAL 5 MINUTE"
        }
      }),
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      console.error('Failed to fetch live users from PostHog API', res.status)
      return 0
    }

    const data = await res.json()
    // HogQL query results come as an array of rows, where each row is an array of columns.
    return data.results?.[0]?.[0] || 0
  } catch (e) {
    console.error('Exception fetching live users from Posthog:', e)
    return 0
  }
}

export async function getDailySessions() {
  const projectId = process.env.POSTHOG_PROJECT_ID
  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY
  
  if (!projectId || !personalApiKey || projectId === 'your_posthog_project_id' || personalApiKey === 'your_posthog_personal_api_key') {
    return { today: 842, deltaPercent: 5 } // Fallback mock
  }

  try {
    const url = `https://eu.posthog.com/api/projects/${projectId}/query/`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${personalApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
            kind: "HogQLQuery",
            query: `SELECT countIf(timestamp >= toStartOfDay(now())) AS today, countIf(timestamp >= toStartOfDay(now() - INTERVAL 1 DAY) AND timestamp < toStartOfDay(now())) AS yesterday FROM events WHERE event = '$pageview' AND timestamp >= toStartOfDay(now() - INTERVAL 1 DAY)`
        }
      }),
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      console.error('Failed to fetch daily sessions from PostHog API', res.status)
      return { today: 0, deltaPercent: 0 }
    }

    const data = await res.json()
    const today = data.results?.[0]?.[0] || 0
    const yesterday = data.results?.[0]?.[1] || 0
    
    let deltaPercent = 0
    if (yesterday > 0) {
      deltaPercent = Math.round(((today - yesterday) / yesterday) * 100)
    } else if (today > 0) {
      deltaPercent = 100
    }

    return { today, deltaPercent }
  } catch (e) {
    console.error('Exception fetching daily sessions from Posthog:', e)
    return { today: 0, deltaPercent: 0 }
  }
}

export async function getRecentReplays() {
  const projectId = process.env.POSTHOG_PROJECT_ID
  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY
  
  if (!projectId || !personalApiKey || projectId === 'your_posthog_project_id' || personalApiKey === 'your_posthog_personal_api_key') {
    console.warn('PostHog Server keys missing. Returning mock session replays.')
    return MOCK_REPLAYS
  }

  try {
    const url = `https://eu.posthog.com/api/projects/${projectId}/session_recordings?limit=10`
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${personalApiKey}`
      },
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      console.error('Failed to fetch session recordings', res.status)
      return MOCK_REPLAYS
    }

    const data = await res.json()
    if (!data.results || !Array.isArray(data.results)) {
      return MOCK_REPLAYS
    }

    // Fetch HogQL query to enrich recordings with real device, country, browser, and email
    const queryUrl = `https://eu.posthog.com/api/projects/${projectId}/query/`
    let sessionPropertiesMap = new Map<string, any>()
    
    try {
      const queryRes = await fetch(queryUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${personalApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: {
            kind: "HogQLQuery",
            query: `
              SELECT 
                $session_id,
                any(properties.$geoip_country_name) as country,
                any(properties.$geoip_country_code) as country_code,
                any(properties.$geoip_city_name) as city,
                any(properties.$geoip_subdivision_1_name) as region,
                any(properties.$device_type) as device_type,
                any(properties.$os) as os,
                any(properties.$browser) as browser,
                any(distinct_id) as distinct_id,
                any(person.properties.email) as email,
                any(person.properties.name) as name,
                any(properties.$email) as event_email,
                any(properties.email) as custom_email,
                any(properties.$host) as host
              FROM events
              WHERE timestamp >= now() - INTERVAL 30 DAY AND $session_id IS NOT NULL AND $session_id != ''
              GROUP BY $session_id
              LIMIT 100
            `
          }
        }),
        next: { revalidate: 60 }
      })

      if (queryRes.ok) {
        const queryData = await queryRes.json()
        if (queryData.results && Array.isArray(queryData.results)) {
          for (const row of queryData.results) {
            const [sessionId, country, countryCode, city, region, deviceType, os, browser, distinctId, email, name, eventEmail, customEmail, host] = row
            
            // Format user dynamically: prioritize email fields, fall back to name, then distinct_id if it's an email
            let userStr = 'Anonimo'
            if (email) userStr = email
            else if (name) userStr = name
            else if (eventEmail) userStr = eventEmail
            else if (customEmail) userStr = customEmail
            else if (distinctId && distinctId.includes('@')) userStr = distinctId

            // Format location: show the country name directly, or fall back to Italia for local development tests
            let locationStr = country || 'Sconosciuto'
            let resolvedCountryCode = countryCode || 'XX'

            if (!country && host && (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('192.168.') || host.includes('10.'))) {
              locationStr = 'Italia'
              resolvedCountryCode = 'IT'
            }

            sessionPropertiesMap.set(sessionId, {
              country: locationStr,
              countryCode: resolvedCountryCode,
              deviceType: deviceType ? deviceType.toLowerCase() : 'desktop',
              os,
              browser,
              distinctId,
              user: userStr
            })
          }
        }
      } else {
        console.error('Failed to fetch HogQL query for replays properties:', queryRes.status)
      }
    } catch (queryErr) {
      console.error('Exception fetching HogQL query for replays properties:', queryErr)
    }

    const colors = [
      'bg-emerald-100 text-emerald-600',
      'bg-blue-100 text-blue-600',
      'bg-orange-100 text-orange-600',
      'bg-purple-100 text-purple-600'
    ]

    return data.results.map((rec: any, idx: number) => {
      const startTime = new Date(rec.start_time)
      const diffMs = Date.now() - startTime.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHrs = Math.floor(diffMins / 60)
      const timeAgo = diffHrs > 0 ? `${diffHrs} ore fa` : `${diffMins} min fa`
      
      const duration = Math.round(rec.recording_duration || 0)
      const min = Math.floor(duration / 60)
      const sec = duration % 60
      const durationStr = `${min}m ${sec}s`

      const props = sessionPropertiesMap.get(rec.id) || {}

      return {
        id: rec.id,
        user: props.user || rec.person?.properties?.email || rec.person?.properties?.name || 'Anonimo',
        device: props.deviceType || 'desktop', 
        country: props.country || 'Sconosciuto', 
        countryCode: props.countryCode || 'XX',
        browser: props.browser || null,
        os: props.os || null,
        duration: durationStr,
        events: rec.activity_score || 0,
        timeAgo: timeAgo,
        avatarColor: colors[idx % colors.length],
        replayUrl: `https://eu.posthog.com/project/${projectId}/replay/${rec.id}`
      }
    })

  } catch (e) {
    console.error('Exception fetching replays from Posthog:', e)
    return MOCK_REPLAYS
  }
}

export interface ReplayEmbedResult {
  success: boolean
  url?: string
  errorType?: 'AUTH_ERROR' | 'POSTHOG_RESTRICTION' | 'UNKNOWN'
}

export async function getReplayEmbedUrl(recordingId: string): Promise<ReplayEmbedResult> {
  const projectId = process.env.POSTHOG_PROJECT_ID
  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY
  
  if (!projectId || !personalApiKey || projectId === 'your_posthog_project_id' || personalApiKey === 'your_posthog_personal_api_key') {
    console.warn('PostHog Server keys missing or placeholder in getReplayEmbedUrl.')
    return { success: false, errorType: 'AUTH_ERROR' }
  }

  try {
    const url = `https://eu.posthog.com/api/projects/${projectId}/session_recordings/${recordingId}/sharing/`
    
    // First check if it is already enabled
    let res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${personalApiKey}`
      },
      next: { revalidate: 0 }
    })

    if (res.status === 401 || res.status === 403) {
      // If we get an auth error on GET, the key itself is unauthorized
      console.warn('PostHog returned auth error on sharing GET:', res.status)
      return { success: false, errorType: 'AUTH_ERROR' }
    }

    let data = null
    if (res.ok) {
      try {
        data = await res.json()
      } catch (err) {
        // ignore JSON parse error
      }
    }

    // If already enabled and has token, return it immediately
    if (data && data.enabled && (data.access_token || data.token)) {
      const token = data.access_token || data.token
      return { success: true, url: `https://eu.posthog.com/embedded/${token}` }
    }

    // If not enabled, attempt to enable it using PATCH (standard DRF method)
    let patchRes = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${personalApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ enabled: true })
    })

    if (patchRes.ok) {
      const patchData = await patchRes.json()
      const token = patchData?.access_token || patchData?.token
      if (token) {
        return { success: true, url: `https://eu.posthog.com/embedded/${token}` }
      }
    }

    // If PATCH failed (e.g. 403 or 405), fallback to POST
    console.warn(`PostHog PATCH sharing returned ${patchRes.status}. Trying POST fallback...`)
    const postRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${personalApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ enabled: true })
    })

    if (postRes.ok) {
      const postData = await postRes.json()
      const token = postData?.access_token || postData?.token
      if (token) {
        return { success: true, url: `https://eu.posthog.com/embedded/${token}` }
      }
    }

    if (postRes.status === 403 || patchRes.status === 403) {
      // The personal API key doesn't support writing sharing configurations
      console.warn('PostHog returned 403 on sharing write (restriction on personal API keys)')
      return { success: false, errorType: 'POSTHOG_RESTRICTION' }
    }

    console.error('Failed to enable sharing for recording', recordingId, 'PATCH status:', patchRes.status, 'POST status:', postRes.status)
    return { success: false, errorType: 'UNKNOWN' }
  } catch (e) {
    console.error('Exception enabling/fetching sharing url:', e)
    return { success: false, errorType: 'UNKNOWN' }
  }
}

export interface AdminUser {
  id: string
  email?: string
  name: string
  plan: string
  createdAt: string
  lastSignInAt?: string
  confirmed: boolean
}

const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: 'u1', email: 'marco.rossi@gmail.com', name: 'Marco Rossi', plan: 'pro', createdAt: '2026-03-12T10:00:00Z', lastSignInAt: '2026-05-22T21:10:00Z', confirmed: true },
  { id: 'u2', email: 'laura.bianchi@yahoo.it', name: 'Laura Bianchi', plan: 'free', createdAt: '2026-04-01T15:30:00Z', lastSignInAt: '2026-05-20T18:45:00Z', confirmed: true },
  { id: 'u3', email: 'giuseppe.verdi@hotmail.com', name: 'Giuseppe Verdi', plan: 'business', createdAt: '2026-04-15T09:12:00Z', lastSignInAt: '2026-05-22T08:00:00Z', confirmed: false },
  { id: 'u4', email: 'sofia.neri@outlook.com', name: 'Sofia Neri', plan: 'free', createdAt: '2026-05-10T14:22:00Z', lastSignInAt: '2026-05-22T19:33:00Z', confirmed: true },
  { id: 'u5', email: 'host_84@email.com', name: 'Giovanni Silva', plan: 'pro', createdAt: '2026-02-28T11:45:00Z', lastSignInAt: '2026-05-22T23:14:00Z', confirmed: true }
]

export async function getAllUsers(): Promise<AdminUser[]> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key') {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing or invalid. Returning fallback mock users.')
    return MOCK_ADMIN_USERS
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://puefhutexocnsxahdhze.supabase.co'
    const supabase = createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Fetch auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) {
      console.error('Error fetching users from Supabase Admin:', authError)
      return MOCK_ADMIN_USERS
    }

    // Fetch profiles table
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id, full_name, plan')
    if (profilesError) {
      console.warn('Error fetching profiles from db, using auth metadata fallback:', profilesError)
    }

    const profilesMap = new Map(profiles?.map(p => [p.id, p]) || [])

    return authData.users.map((u: any) => {
      const p = profilesMap.get(u.id)
      const name = p?.full_name || u.user_metadata?.full_name || u.email?.split('@')[0] || 'Utente'
      const plan = p?.plan || u.user_metadata?.plan || 'free'
      return {
        id: u.id,
        email: u.email,
        name: name,
        plan: plan,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at,
        confirmed: !!u.email_confirmed_at
      }
    })
  } catch (error) {
    console.error('Exception fetching all users:', error)
    return MOCK_ADMIN_USERS
  }
}

export interface AdminSettings {
  appName: string
  supportEmail: string
  freeGuideLimit: number
  maxPhotosPerGuide: number
  stripePremiumPriceId: string
  posthogProjectId: string
  posthogApiKey: string
  posthogHost: string
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const defaultSettings: AdminSettings = {
    appName: 'GuideHost',
    supportEmail: 'supporto@guidehost.com',
    freeGuideLimit: 1,
    maxPhotosPerGuide: 10,
    stripePremiumPriceId: 'price_1Oplaceholder',
    posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
    posthogApiKey: process.env.POSTHOG_PERSONAL_API_KEY || '',
    posthogHost: 'https://eu.posthog.com'
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key') {
    return defaultSettings
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://puefhutexocnsxahdhze.supabase.co'
    const supabase = createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'general')
      .single()

    if (error || !data) {
      return defaultSettings
    }

    return {
      ...defaultSettings,
      ...data.value
    }
  } catch (error) {
    console.error('Exception fetching admin settings:', error)
    return defaultSettings
  }
}

export async function saveAdminSettings(settings: AdminSettings): Promise<{ success: boolean; error?: string }> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key') {
    return { success: false, error: 'Configurazione Supabase non disponibile.' }
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://puefhutexocnsxahdhze.supabase.co'
    const supabase = createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { error } = await supabase
      .from('admin_settings')
      .upsert({
        key: 'general',
        value: settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })

    if (error) {
      console.error('Error saving admin settings:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Exception saving admin settings:', error)
    return { success: false, error: error.message || 'Errore imprevisto.' }
  }
}


