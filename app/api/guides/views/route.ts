import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/guides/views — increments view count (called from the public guide page)
export async function POST(req: NextRequest) {
  try {
    const { guide_id } = await req.json()
    if (!guide_id) return NextResponse.json({ error: 'guide_id required' }, { status: 400 })

    const supabase = await createClient()

    // Insert a view record
    await supabase.from('guide_views').insert({ guide_id })

    // Increment the denormalized counter
    await supabase.rpc('increment_guide_views', { guide_id_param: guide_id })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
