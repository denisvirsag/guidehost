import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Initialize OpenAI client if API key is present
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key'
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

// Initialize Supabase admin client to bypass RLS and insert translations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = supabaseUrl && supabaseServiceKey && supabaseServiceKey !== 'your_supabase_service_role_key'
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Map language codes to full names for the AI prompt
const LANG_MAP: Record<string, string> = {
  it: 'Italian',
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German'
}

export async function getOrTranslateSection(
  sectionId: string,
  sectionTitle: string,
  sectionContent: any,
  sectionType: string,
  targetLang: string
): Promise<{ title: string; content: any }> {
  // If target language is Italian (assuming it's the base language) or not supported, return original
  if (targetLang === 'it') {
    return { title: sectionTitle, content: sectionContent }
  }

  // 1. Check if we have a cached translation in the database
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('guide_section_translations')
        .select('translated_title, translated_content')
        .eq('section_id', sectionId)
        .eq('language', targetLang)
        .single()

      if (data && !error) {
        return {
          title: data.translated_title || sectionTitle,
          content: data.translated_content || sectionContent
        }
      }
    } catch (dbErr) {
      console.error('Error querying translation cache:', dbErr)
    }
  }

  // 2. If not cached, perform translation
  let translatedTitle = sectionTitle
  let translatedContent = sectionContent

  const targetLangName = LANG_MAP[targetLang] || targetLang

  if (openai) {
    try {
      const payload = {
        title: sectionTitle,
        content: sectionContent
      }

      const prompt = `You are a professional translator for vacation rental and Airbnb guides. 
Translate the following JSON object representing a guide section into ${targetLangName}.

Translate all user-facing strings, including the "title" and text values inside "content".
Ensure the translation sounds natural, warm, and welcoming for a guest.

CRITICAL RULES:
- Do NOT translate JSON keys. Only translate values that are user-facing strings.
- Do NOT translate wifi passwords or wifi network names.
- Do NOT translate links, URLs, images, or placeholders.
- Do NOT translate phone numbers, emergency numbers, or numeric values.
- Do NOT translate specific times (e.g. "10:00", "15:00").
- Keep the exact same JSON structure as the input.

Return ONLY the valid raw JSON object. Do not wrap it in markdown code blocks (\`\`\`json ... \`\`\`).`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a JSON translation assistant. Return only valid JSON without markdown wrapping.' },
          { role: 'user', content: `${prompt}\n\nJSON to translate:\n${JSON.stringify(payload, null, 2)}` }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })

      const responseText = completion.choices[0]?.message?.content
      if (responseText) {
        const result = JSON.parse(responseText)
        if (result.title) translatedTitle = result.title
        if (result.content) translatedContent = result.content
      }
    } catch (apiErr) {
      console.error(`Failed to translate section ${sectionId} to ${targetLang} via OpenAI:`, apiErr)
    }
  } else {
    // Mock translation fallback for local testing without OpenAI key
    console.warn(`OPENAI_API_KEY not configured. Mocking translation for section ${sectionId} to ${targetLang}`)
    translatedTitle = `[${targetLang.toUpperCase()}] ${sectionTitle}`
    translatedContent = mockTranslateContent(sectionContent, targetLang)
  }

  // 3. Cache the translation in the database for future requests
  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from('guide_section_translations')
        .upsert({
          section_id: sectionId,
          language: targetLang,
          translated_title: translatedTitle,
          translated_content: translatedContent
        }, { onConflict: 'section_id,language' })
    } catch (cacheErr) {
      console.error('Error saving translation to cache:', cacheErr)
    }
  }

  return { title: translatedTitle, content: translatedContent }
}

// Simple helper to mock translation for testing purposes
function mockTranslateContent(content: any, lang: string): any {
  if (!content) return content
  const prefix = `[${lang.toUpperCase()}] `

  if (typeof content === 'string') {
    return content.startsWith('http') || content.match(/^\d+$/) ? content : `${prefix}${content}`
  }

  if (Array.isArray(content)) {
    return content.map(item => mockTranslateContent(item, lang))
  }

  if (typeof content === 'object') {
    const newObj: any = {}
    for (const key in content) {
      // Skip fields we shouldn't translate
      if (['password', 'network', 'link', 'url', 'number', 'images', 'image', 'time', 'checkin', 'checkout'].includes(key.toLowerCase())) {
        newObj[key] = content[key]
      } else {
        newObj[key] = mockTranslateContent(content[key], lang)
      }
    }
    return newObj
  }

  return content
}
