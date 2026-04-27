import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createEmbedding, generateAnswer, improveAnswer } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const body = await req.json()
    const {
      action,
      questionText,
      wordLimit,
      scoringCriteria,
      currentContent,
      organisationId,
      instruction,
    } = body

    const admin = createAdminClient()

    // Fetch company profile
    const { data: companyProfile } = await admin
      .from('company_profiles')
      .select('*')
      .eq('organisation_id', organisationId)
      .single()

    // Generate embedding for the question
    const questionEmbedding = await createEmbedding(questionText)

    // Vector search: evidence items
    const { data: evidenceItems } = await admin.rpc('search_evidence', {
      query_embedding: questionEmbedding,
      org_id: organisationId,
      match_count: 5,
    })

    // Vector search: bid library
    const { data: bidLibraryItems } = await admin
      .from('bid_library_items')
      .select('*')
      .eq('organisation_id', organisationId)
      .eq('status', 'approved')
      .limit(3)

    // Vector search: winning bids (own + public)
    const { data: winningBidMatches } = await admin.rpc('search_winning_bids', {
      query_embedding: questionEmbedding,
      org_id: organisationId,
      match_count: 3,
    })

    // Also search public bids (source: 'public') — these are stored in previous_bids with source='public'
    // The search_winning_bids function already handles this as it queries all won bids for the org

    const ctx = {
      questionText,
      wordLimit,
      scoringCriteria,
      companyProfile,
      evidenceItems: evidenceItems ?? [],
      bidLibraryItems: bidLibraryItems ?? [],
      winningBids: winningBidMatches ?? [],
    }

    let content: string

    if (action === 'generate' || action === 'use_company_profile' || action === 'use_winning_bid') {
      content = await generateAnswer(ctx)
    } else if (action === 'improve' || action === 'expand' || action === 'rewrite_for_score' || action === 'check_compliance') {
      content = await improveAnswer({
        ...ctx,
        currentAnswer: currentContent ?? '',
        instruction: instruction ?? getInstructionForAction(action),
      })
    } else if (action === 'shorten') {
      content = await improveAnswer({
        ...ctx,
        currentAnswer: currentContent ?? '',
        instruction: `Shorten this response to fit within ${wordLimit ?? 'the'} word limit while retaining all key evidence, named roles, and specific outcomes. Do not remove substantive content — cut filler and redundancy.`,
      })
    } else if (action === 'add_evidence' || action === 'add_kpis') {
      content = await improveAnswer({
        ...ctx,
        currentAnswer: currentContent ?? '',
        instruction: action === 'add_kpis'
          ? 'Add the most relevant KPIs and measurable outcomes from the evidence bank into this answer. Cite them specifically with dates and values.'
          : 'Add the most relevant evidence items from the evidence bank into this answer. Be specific — include metrics, dates, and sources.',
      })
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    return NextResponse.json({
      content,
      contextUsed: {
        companyProfile: !!companyProfile,
        evidenceItems: (evidenceItems ?? []).map((e: { id: string }) => e.id),
        bidLibraryItems: (bidLibraryItems ?? []).map((b: { id: string }) => b.id),
        winningBids: (winningBidMatches ?? []).map((w: { tender_name: string; outcome: string; similarity: number; source: string }) => ({
          tenderName: w.tender_name,
          outcome: w.outcome,
          similarity: w.similarity,
          source: w.source,
        })),
      },
      winningBids: (winningBidMatches ?? []).slice(0, 3),
    })
  } catch (err) {
    console.error('[AI Generate]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'AI generation failed' },
      { status: 500 }
    )
  }
}

function getInstructionForAction(action: string): string {
  switch (action) {
    case 'improve': return 'Improve this answer — add specificity, stronger evidence, and clearer structure.'
    case 'expand': return 'Expand this answer to add more depth, evidence, and specificity. Use more of the available word count.'
    case 'rewrite_for_score': return 'Rewrite this answer to maximise the score. Address every element of the scoring criteria explicitly. Add named roles, specific timescales, and measurable outcomes.'
    case 'check_compliance': return 'Review this answer against the question requirements. Ensure every mandatory element is explicitly addressed. Add any missing required elements.'
    default: return 'Improve this answer.'
  }
}
