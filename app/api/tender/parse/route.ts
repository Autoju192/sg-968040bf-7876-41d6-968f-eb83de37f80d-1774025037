import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { extractTextFromPdf } from '@/lib/parsers/pdf'
import { extractTextFromDocx } from '@/lib/parsers/docx-import'
import { extractQuestionsFromText, createEmbedding } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File
    const tenderId = formData.get('tenderId') as string
    const documentId = formData.get('documentId') as string

    if (!file || !tenderId) {
      return NextResponse.json({ error: 'file and tenderId are required' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Update document status to processing
    if (documentId) {
      await admin
        .from('tender_documents')
        .update({ parse_status: 'processing' })
        .eq('id', documentId)
    }

    // Extract text
    const buffer = Buffer.from(await file.arrayBuffer())
    let rawText: string

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      rawText = await extractTextFromPdf(buffer)
    } else {
      rawText = await extractTextFromDocx(buffer)
    }

    // Extract questions via AI
    const questions = await extractQuestionsFromText(rawText)

    if (!questions.length) {
      if (documentId) {
        await admin
          .from('tender_documents')
          .update({ parse_status: 'failed', raw_text: rawText })
          .eq('id', documentId)
      }
      return NextResponse.json({ error: 'No questions could be extracted from this document' }, { status: 422 })
    }

    // Save raw text and update status
    if (documentId) {
      await admin
        .from('tender_documents')
        .update({ parse_status: 'complete', raw_text: rawText })
        .eq('id', documentId)
    }

    // Insert questions and generate embeddings
    const questionRows = []
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      let embedding: number[] | null = null
      try {
        embedding = await createEmbedding(q.question_text)
      } catch {
        // Non-fatal — embeddings can be regenerated
      }

      questionRows.push({
        tender_id: tenderId,
        document_id: documentId ?? null,
        question_number: q.question_number,
        question_text: q.question_text,
        word_limit: q.word_limit,
        scoring_weight: q.scoring_weight,
        scoring_criteria: q.scoring_criteria,
        required_evidence: q.required_evidence,
        order_index: i,
        question_embedding: embedding,
      })
    }

    const { data: savedQuestions, error } = await admin
      .from('tender_questions')
      .insert(questionRows)
      .select()

    if (error) throw error

    return NextResponse.json({ questions: savedQuestions, count: savedQuestions?.length })
  } catch (err) {
    console.error('[Tender Parse]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Parse failed' },
      { status: 500 }
    )
  }
}
