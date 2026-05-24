import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { GuideSection, Property, Guide } from '@/types'
import GuestGuideClient from '@/components/guest/GuestGuideClient'
import { headers } from 'next/headers'
import { getOrTranslateSection } from '@/lib/translate'

interface PageProps<T> {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: PageProps<'/g/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('name, address')
    .eq('slug', slug)
    .single()

  if (!property) return { title: 'Guida' }

  return {
    title: `Guida — ${property.name}`,
    description: `Guida interattiva per gli ospiti di ${property.name}${property.address ? ` — ${property.address}` : ''}`,
  }
}

export default async function GuestGuidePage(props: PageProps<'/g/[slug]'>) {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*, guides(*, guide_sections(*))')
    .eq('slug', slug)
    .single()

  if (!property) notFound()

  const guides = property.guides as Array<{
    id: string
    published: boolean
    title: string
    theme: string
    accent_color: string
    guide_sections: GuideSection[]
  }>

  const guide = guides?.find(g => g.published)
  if (!guide) notFound()

  // 1. Language Detection from URL param or HTTP Accept-Language header
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') || ''
  
  const supportedLangs = ['it', 'en', 'es', 'fr', 'de']
  let detectedLang: 'it' | 'en' | 'es' | 'fr' | 'de' = 'it'
  
  const resolvedSearchParams = await props.searchParams
  const forcedLang = resolvedSearchParams.lang as string
  if (supportedLangs.includes(forcedLang)) {
    detectedLang = forcedLang as any
  } else {
    const match = acceptLanguage.match(/([a-z]{2})/i)
    if (match && supportedLangs.includes(match[1].toLowerCase())) {
      detectedLang = match[1].toLowerCase() as any
    }
  }

  // 2. Translate Guide Title on-demand
  let translatedGuideTitle = guide.title
  if (detectedLang !== 'it') {
    const res = await getOrTranslateSection(
      `${guide.id}_title`,
      guide.title,
      null,
      'title',
      detectedLang
    )
    translatedGuideTitle = res.title
  }

  const rawSections = (guide.guide_sections ?? [])
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)

  // 3. Translate all Sections in parallel
  const translatedSections = await Promise.all(
    rawSections.map(async (section) => {
      const { title, content } = await getOrTranslateSection(
        section.id,
        section.title,
        section.content,
        section.type,
        detectedLang
      )
      return {
        ...section,
        title,
        content
      }
    })
  )

  // Track view (fire and forget)
  supabase.from('guide_views').insert({ guide_id: guide.id }).then(() => { })
  supabase.rpc('increment_guide_views', { guide_id_param: guide.id }).then(() => { })

  // Prepare safe types for the client component
  const typedProperty: Property = {
    id: property.id,
    owner_id: property.owner_id,
    name: property.name,
    address: property.address,
    cover_image_url: property.cover_image_url,
    slug: property.slug,
    wifi_name: property.wifi_name,
    wifi_password: property.wifi_password,
    check_in_time: property.check_in_time,
    check_out_time: property.check_out_time,
    created_at: property.created_at,
  }

  const typedGuide: Guide = {
    id: guide.id,
    property_id: guide.id,
    owner_id: '',
    title: translatedGuideTitle,
    published: guide.published,
    theme: guide.theme as 'light' | 'dark',
    accent_color: guide.accent_color,
    views_count: 0,
    created_at: '',
    updated_at: '',
  }

  return (
    <GuestGuideClient
      property={typedProperty}
      guide={typedGuide}
      sections={translatedSections}
      initialLang={detectedLang}
    />
  )
}

