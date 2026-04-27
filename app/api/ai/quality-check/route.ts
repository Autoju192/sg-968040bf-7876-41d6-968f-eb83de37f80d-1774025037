import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkQuality } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { questionText, responseText, wordLimit, scoringCriteria } = await req.json()

    if (!questionText || !responseText) {
      return NextResponse.json({ error: 'questionText and responseText are required' }, { status: 400 })
    }

    const result = await checkQuality(questionText, responseText, wordLimit, scoringCriteria)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[Quality Check]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Quality check failed' },
      { status: 500 }
    )
  }
}
