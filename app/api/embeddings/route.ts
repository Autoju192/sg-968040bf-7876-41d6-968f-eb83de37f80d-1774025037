import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createEmbedding } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { type, id } = await req.json()
    const admin = createAdminClient()

    if (type === 'evidence') {
      const { data: item } = await admin
        .from('evidence_items')
        .select('title, content, type')
        .eq('id', id)
        .single()
      if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      const text = `${item.type}: ${item.title}. ${item.content}`
      const embedding = await createEmbedding(text)
      await admin.from('evidence_items').update({ embedding }).eq('id', id)

    } else if (type === 'bid_library') {
      const { data: item } = await admin
        .from('bid_library_items')
        .select('title, category, content')
        .eq('id', id)
        .single()
      if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      const text = `${item.category}: ${item.title}. ${item.content}`
      const embedding = await createEmbedding(text)
      await admin.from('bid_library_items').update({ embedding }).eq('id', id)

    } else if (type === 'previous_bid_section') {
      const { data: section } = await admin
        .from('previous_bid_sections')
        .select('question_text, response_text')
        .eq('id', id)
        .single()
      if (!section) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      const [qEmbedding, rEmbedding] = await Promise.all([
        createEmbedding(section.question_text),
        createEmbedding(section.response_text),
      ])
      await admin
        .from('previous_bid_sections')
        .update({ question_embedding: qEmbedding, response_embedding: rEmbedding })
        .eq('id', id)

    } else {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Embeddings]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Embedding generation failed' },
      { status: 500 }
    )
  }
}
