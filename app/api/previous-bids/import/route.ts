import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { extractTextFromPdf } from '@/lib/parsers/pdf'
import { extractTextFromDocx } from '@/lib/parsers/docx-import'
import { extractQuestionsFromText, createEmbedding } from '@/lib/openai'
import { openai } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File
    const organisationId = formData.get('organisationId') as string

    if (!file || !organisationId) {
      return NextResponse.json({ error: 'file and organisationId required' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let rawText: string

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      rawText = await extractTextFromPdf(buffer)
    } else {
      rawText = await extractTextFromDocx(buffer)
    }

    // Extract metadata about the bid (name, commissioner, date) from the text
    const metaRes = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Extract metadata from this tender document. Return ONLY valid JSON.
Text (first 3000 chars): ${rawText.slice(0, 3000)}

Return: {"tender_name": "...", "commissioner": "...", "submission_date": "YYYY-MM-DD or null"}`,
      }],
      temperature: 0,
      response_format: { type: 'json_object' },
    })

    const meta = JSON.parse(metaRes.choices[0].message.content ?? '{}')

    const admin = createAdminClient()

    // Create the previous bid record
    const { data: bid, error: bidError } = await admin
      .from('previous_bids')
      .insert({
        organisation_id: organisationId,
        tender_name: meta.tender_name ?? file.name.replace(/\.[^.]+$/, ''),
        commissioner: meta.commissioner ?? null,
        submission_date: meta.submission_date ?? null,
        outcome: null,
        source: 'own',
      })
      .select()
      .single()

    if (bidError) throw bidError

    // Extract Q&A sections
    const questions = await extractQuestionsFromText(rawText)

    // For a previous bid, we also need the responses — extract them differently
    // Use the raw text to find Q&A pairs
    const qaRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Extract all question-answer pairs from this tender submission. Return ONLY valid JSON.

This is a SUBMITTED tender — it contains both questions AND written responses.
Extract pairs as: [{"question": "...", "answer": "..."}]
Only include pairs where there is a substantive written answer.

Document text:
${rawText.slice(0, 15000)}`,
      }],
      temperature: 0,
      response_format: { type: 'json_object' },
    })

    const qaRaw = JSON.parse(qaRes.choices[0].message.content ?? '{"pairs":[]}')
    const pairs: Array<{ question: string; answer: string }> = Array.isArray(qaRaw) ? qaRaw : (qaRaw.pairs ?? [])

    // Insert sections with embeddings
    const sectionInserts = []
    for (const pair of pairs.slice(0, 30)) {
      if (!pair.question || !pair.answer) continue
      let qEmbedding: number[] | null = null
      let rEmbedding: number[] | null = null
      try {
        ;[qEmbedding, rEmbedding] = await Promise.all([
          createEmbedding(pair.question),
          createEmbedding(pair.answer),
        ])
      } catch { /* non-fatal */ }

      sectionInserts.push({
        previous_bid_id: bid.id,
        question_text: pair.question,
        response_text: pair.answer,
        question_embedding: qEmbedding,
        response_embedding: rEmbedding,
      })
    }

    if (sectionInserts.length > 0) {
      await admin.from('previous_bid_sections').insert(sectionInserts)
    }

    return NextResponse.json({ bid, sectionsImported: sectionInserts.length })
  } catch (err) {
    console.error('[Previous Bid Import]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Import failed' },
      { status: 500 }
    )
  }
}
