import OpenAI from 'openai'
import type {
  CompanyProfile,
  EvidenceItem,
  BidLibraryItem,
  QualityBreakdown,
  QualityFlag,
  WinningBidMatch,
} from '@/types/database'

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ---- Embeddings ----

export async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000), // token safety
  })
  return response.data[0].embedding
}

// ---- Context assembly ----

interface GenerationContext {
  questionText: string
  wordLimit?: number | null
  scoringCriteria?: string | null
  companyProfile?: CompanyProfile | null
  evidenceItems?: EvidenceItem[]
  bidLibraryItems?: BidLibraryItem[]
  winningBids?: Array<{
    question_text: string
    response_text: string
    tender_name: string
    outcome: string
    source: string
    similarity: number
  }>
  existingDraft?: string
}

function buildSystemPrompt(ctx: GenerationContext): string {
  const parts: string[] = [
    'You are an expert bid writer specialising in UK public sector care contracts.',
    'You write compelling, specific, evidence-backed tender responses.',
    'CRITICAL RULES:',
    '- Use ONLY data provided in this context. Never invent statistics, names, or evidence.',
    '- Reference specific processes, named roles, and measurable outcomes.',
    '- Write for a commissioner scoring your submission, not for a general audience.',
    '- Avoid generic phrases like "we are committed to" without specific evidence.',
    '- Every claim must be backed by a specific example, KPI, or process.',
  ]

  if (ctx.companyProfile) {
    parts.push('\n=== COMPANY PROFILE ===')
    const cp = ctx.companyProfile
    if (cp.overview) parts.push(`Overview: ${cp.overview}`)
    if (cp.services_offered) parts.push(`Services: ${cp.services_offered}`)
    if (cp.safeguarding_approach) parts.push(`Safeguarding: ${cp.safeguarding_approach}`)
    if (cp.staffing_model) parts.push(`Staffing: ${cp.staffing_model}`)
    if (cp.training_model) parts.push(`Training: ${cp.training_model}`)
    if (cp.qa_processes) parts.push(`QA: ${cp.qa_processes}`)
    if (cp.compliance_details) parts.push(`Compliance: ${cp.compliance_details}`)
    if (cp.kpis) parts.push(`KPIs: ${cp.kpis}`)
    if (cp.case_studies) parts.push(`Case Studies: ${cp.case_studies}`)
  }

  if (ctx.evidenceItems?.length) {
    parts.push('\n=== EVIDENCE BANK (use these specific data points) ===')
    ctx.evidenceItems.forEach((e, i) => {
      parts.push(`${i + 1}. [${e.type.toUpperCase()}] ${e.title}: ${e.content}${e.metric_value ? ` (${e.metric_value})` : ''}`)
    })
  }

  if (ctx.bidLibraryItems?.length) {
    parts.push('\n=== BID LIBRARY (approved reusable content) ===')
    ctx.bidLibraryItems.forEach((b, i) => {
      parts.push(`${i + 1}. [${b.category}] ${b.title}: ${b.content.slice(0, 500)}`)
    })
  }

  if (ctx.winningBids?.length) {
    parts.push('\n=== WINNING BID PATTERNS (learn from these, do not copy verbatim) ===')
    ctx.winningBids.forEach((wb, i) => {
      const sourceLabel = wb.source === 'public' ? 'Public Record' : 'Your Winning Bid'
      parts.push(
        `${i + 1}. [${sourceLabel} — ${wb.outcome.toUpperCase()}] ${wb.tender_name} (${Math.round(wb.similarity * 100)}% match)`,
        `   Q: ${wb.question_text.slice(0, 200)}`,
        `   A: ${wb.response_text.slice(0, 400)}`
      )
    })
    parts.push('Extract the PATTERNS from winning bids (structure, evidence types, specificity level), not the content.')
  }

  return parts.join('\n')
}

// ---- Generate answer ----

export async function generateAnswer(ctx: GenerationContext): Promise<string> {
  const wordInstruction = ctx.wordLimit
    ? `Stay within ${ctx.wordLimit} words.`
    : 'Write a comprehensive response.'

  const scoringInstruction = ctx.scoringCriteria
    ? `Scoring criteria: ${ctx.scoringCriteria}. Structure your answer to explicitly address each criterion.`
    : ''

  const userPrompt = [
    `QUESTION: ${ctx.questionText}`,
    wordInstruction,
    scoringInstruction,
    ctx.existingDraft ? `\nExisting draft to improve:\n${ctx.existingDraft}` : '',
    '\nWrite a complete, specific, evidence-backed tender response:',
  ].filter(Boolean).join('\n')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: buildSystemPrompt(ctx) },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  })

  return response.choices[0].message.content ?? ''
}

// ---- Improve answer ----

export async function improveAnswer(
  ctx: GenerationContext & { currentAnswer: string; instruction?: string }
): Promise<string> {
  const userPrompt = [
    `QUESTION: ${ctx.questionText}`,
    ctx.wordLimit ? `Word limit: ${ctx.wordLimit} words.` : '',
    `\nCURRENT ANSWER:\n${ctx.currentAnswer}`,
    `\nIMPROVEMENT INSTRUCTION: ${ctx.instruction ?? 'Improve this answer — add specificity, stronger evidence, and clearer structure while staying within the word limit.'}`,
    '\nReturn the improved answer only (no commentary):',
  ].filter(Boolean).join('\n')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: buildSystemPrompt(ctx) },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  })

  return response.choices[0].message.content ?? ''
}

// ---- Quality check ----

interface QualityCheckResult {
  score: number
  breakdown: QualityBreakdown
  flags: QualityFlag[]
  suggestions: string[]
  band: 'excellent' | 'good' | 'needs_work' | 'at_risk'
}

export async function checkQuality(
  questionText: string,
  responseText: string,
  wordLimit?: number | null,
  scoringCriteria?: string | null
): Promise<QualityCheckResult> {
  const prompt = `You are a tender quality assessor. Score this tender response across 7 dimensions.

QUESTION: ${questionText}
${wordLimit ? `WORD LIMIT: ${wordLimit}` : ''}
${scoringCriteria ? `SCORING CRITERIA: ${scoringCriteria}` : ''}

RESPONSE:
${responseText}

Score each dimension (return ONLY valid JSON, no markdown):
{
  "relevance": <0-20>,
  "compliance": <0-20>,
  "evidence": <0-20>,
  "specificity": <0-15>,
  "word_count": <0-10>,
  "clarity": <0-10>,
  "differentiation": <0-5>,
  "flags": [
    {
      "dimension": "evidence",
      "score": 10,
      "maxScore": 20,
      "status": "warning",
      "message": "Missing specific KPI",
      "suggestion": "Add a measurable outcome such as a percentage or audit result",
      "action": "add_evidence"
    }
  ],
  "suggestions": ["Add a named safeguarding lead", "Include audit frequency"]
}

Scoring guide:
- relevance: Does the answer directly address the question?
- compliance: Are all required elements from the question present?
- evidence: Are specific metrics, examples, or data cited?
- specificity: Named people, processes, timeframes vs vague statements
- word_count: ${wordLimit ? `Score 10 if within ${wordLimit} words, scale down proportionally` : 'Score 10 if comprehensive'}
- clarity: Readable, well-structured, commissioner-friendly language
- differentiation: Something unique — not generic boilerplate any provider could write

Status values: "good" (>80% of max), "warning" (50-80%), "poor" (<50%)`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    response_format: { type: 'json_object' },
  })

  const raw = JSON.parse(response.choices[0].message.content ?? '{}')

  const breakdown: QualityBreakdown = {
    relevance: raw.relevance ?? 0,
    compliance: raw.compliance ?? 0,
    evidence: raw.evidence ?? 0,
    specificity: raw.specificity ?? 0,
    word_count: raw.word_count ?? 0,
    clarity: raw.clarity ?? 0,
    differentiation: raw.differentiation ?? 0,
  }

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0)
  const band =
    total >= 90 ? 'excellent' :
    total >= 75 ? 'good' :
    total >= 60 ? 'needs_work' : 'at_risk'

  return {
    score: total,
    breakdown,
    flags: raw.flags ?? [],
    suggestions: raw.suggestions ?? [],
    band,
  }
}

// ---- Parse tender document ----

export async function extractQuestionsFromText(rawText: string): Promise<Array<{
  question_number: string
  question_text: string
  word_limit: number | null
  scoring_weight: number | null
  scoring_criteria: string | null
  required_evidence: string | null
}>> {
  const prompt = `Extract all tender questions from this document text. Return ONLY valid JSON array.

For each question extract:
- question_number: the section/question reference (e.g. "Q1", "Section 3.2")
- question_text: the full question text
- word_limit: word or character limit if mentioned (number or null)
- scoring_weight: scoring weighting if mentioned (number or null)
- scoring_criteria: what the question is scored on if specified (string or null)
- required_evidence: any explicitly required evidence or attachments (string or null)

DOCUMENT TEXT:
${rawText.slice(0, 12000)}

Return format: [{ "question_number": "Q1", "question_text": "...", "word_limit": 500, "scoring_weight": 15, "scoring_criteria": null, "required_evidence": null }]`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    response_format: { type: 'json_object' },
  })

  const raw = JSON.parse(response.choices[0].message.content ?? '{"questions":[]}')
  return Array.isArray(raw) ? raw : (raw.questions ?? [])
}
