import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchContractsFinder } from '@/lib/discover/contracts-finder'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const keyword = req.nextUrl.searchParams.get('keyword') ?? 'domiciliary care'
    const results = await searchContractsFinder({ keyword })

    return NextResponse.json({ results })
  } catch (err) {
    console.error('[Discover]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Search failed' },
      { status: 500 }
    )
  }
}
