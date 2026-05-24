import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(req: NextRequest, ctx: { params: Promise<{ guideId: string }> }) {
  const { guideId } = await ctx.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: guide } = await supabase
    .from('guides')
    .select('id, properties(slug)')
    .eq('id', guideId)
    .eq('owner_id', user.id)
    .single()

  if (!guide) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const rawProperty = guide.properties
  const property = Array.isArray(rawProperty)
    ? (rawProperty[0] as unknown as { slug: string } | undefined)
    : (rawProperty as unknown as { slug: string } | null)
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/g/${property?.slug}`

  const format = req.nextUrl.searchParams.get('format') ?? 'png'

  if (format === 'svg') {
    const svg = await QRCode.toString(url, { type: 'svg', margin: 2 })
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="qr-${property?.slug}.svg"`,
      },
    })
  }

  const buffer = await QRCode.toBuffer(url, {
    type: 'png',
    width: 512,
    margin: 2,
    color: { dark: '#0a0a0f', light: '#ffffff' },
  })

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="qr-${property?.slug}.png"`,
    },
  })
}
