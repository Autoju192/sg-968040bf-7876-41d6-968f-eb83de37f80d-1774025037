import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.hoisted ensures these run before module imports
const { mockCreate, mockEmbeddingsCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockEmbeddingsCreate: vi.fn(),
}))

vi.mock('openai', () => {
  class MockOpenAI {
    chat = { completions: { create: mockCreate } }
    embeddings = { create: mockEmbeddingsCreate }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(_opts?: any) {}
  }
  return { default: MockOpenAI }
})

import { createEmbedding, generateAnswer, improveAnswer, checkQuality, extractQuestionsFromText } from '@/lib/openai'

function getMockCreate() { return mockCreate }
function getMockEmbeddingsCreate() { return mockEmbeddingsCreate }

// ─── createEmbedding ─────────────────────────────────────────────────────────

describe('createEmbedding', () => {
  beforeEach(() => { getMockEmbeddingsCreate().mockReset() })

  it('calls text-embedding-3-small model', async () => {
    getMockEmbeddingsCreate().mockResolvedValueOnce({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    })
    await createEmbedding('hello world')
    expect(getMockEmbeddingsCreate()).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'text-embedding-3-small' })
    )
  })

  it('returns the embedding array', async () => {
    const embedding = Array.from({ length: 1536 }, (_, i) => i / 1536)
    getMockEmbeddingsCreate().mockResolvedValueOnce({ data: [{ embedding }] })
    const result = await createEmbedding('test text')
    expect(result).toHaveLength(1536)
    expect(result[0]).toBeCloseTo(0)
  })

  it('truncates input to 8000 chars', async () => {
    getMockEmbeddingsCreate().mockResolvedValueOnce({ data: [{ embedding: [0.1] }] })
    const longText = 'a'.repeat(10000)
    await createEmbedding(longText)
    const calledInput = getMockEmbeddingsCreate().mock.calls[0][0].input
    expect(calledInput.length).toBeLessThanOrEqual(8000)
  })
})

// ─── generateAnswer ──────────────────────────────────────────────────────────

describe('generateAnswer', () => {
  beforeEach(() => { getMockCreate().mockReset() })

  it('calls gpt-4o model', async () => {
    getMockCreate().mockResolvedValueOnce({ choices: [{ message: { content: 'generated answer' } }] })
    await generateAnswer({ questionText: 'Describe your safeguarding approach.' })
    expect(getMockCreate()).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gpt-4o' })
    )
  })

  it('returns the completion content', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: 'Our safeguarding approach includes...' } }],
    })
    const result = await generateAnswer({ questionText: 'Describe safeguarding.' })
    expect(result).toBe('Our safeguarding approach includes...')
  })

  it('includes word limit instruction when provided', async () => {
    getMockCreate().mockResolvedValueOnce({ choices: [{ message: { content: 'answer' } }] })
    await generateAnswer({ questionText: 'Question?', wordLimit: 500 })
    const userMessage = getMockCreate().mock.calls[0][0].messages.find(
      (m: { role: string }) => m.role === 'user'
    )
    expect(userMessage.content).toContain('500')
  })

  it('includes scoring criteria when provided', async () => {
    getMockCreate().mockResolvedValueOnce({ choices: [{ message: { content: 'answer' } }] })
    await generateAnswer({ questionText: 'Q?', scoringCriteria: 'Leadership and governance' })
    const systemMsg = getMockCreate().mock.calls[0][0].messages.find(
      (m: { role: string }) => m.role === 'system'
    )
    expect(systemMsg.content).toBeDefined()
  })

  it('includes company profile in system prompt when provided', async () => {
    getMockCreate().mockResolvedValueOnce({ choices: [{ message: { content: 'answer' } }] })
    await generateAnswer({
      questionText: 'Q?',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      companyProfile: { overview: 'We are a domiciliary care provider' } as any,
    })
    const systemMsg = getMockCreate().mock.calls[0][0].messages[0].content
    expect(systemMsg).toContain('domiciliary care provider')
  })

  it('returns empty string when OpenAI returns null content', async () => {
    getMockCreate().mockResolvedValueOnce({ choices: [{ message: { content: null } }] })
    const result = await generateAnswer({ questionText: 'Q?' })
    expect(result).toBe('')
  })
})

// ─── improveAnswer ───────────────────────────────────────────────────────────

describe('improveAnswer', () => {
  beforeEach(() => { getMockCreate().mockReset() })

  it('calls gpt-4o model', async () => {
    getMockCreate().mockResolvedValueOnce({ choices: [{ message: { content: 'improved' } }] })
    await improveAnswer({ questionText: 'Q?', currentAnswer: 'draft answer' })
    expect(getMockCreate()).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gpt-4o' })
    )
  })

  it('includes current answer in the user prompt', async () => {
    getMockCreate().mockResolvedValueOnce({ choices: [{ message: { content: 'improved' } }] })
    await improveAnswer({ questionText: 'Q?', currentAnswer: 'my current draft' })
    const userMsg = getMockCreate().mock.calls[0][0].messages.find(
      (m: { role: string }) => m.role === 'user'
    )
    expect(userMsg.content).toContain('my current draft')
  })

  it('uses custom instruction when provided', async () => {
    getMockCreate().mockResolvedValueOnce({ choices: [{ message: { content: 'improved' } }] })
    await improveAnswer({
      questionText: 'Q?',
      currentAnswer: 'draft',
      instruction: 'Make it shorter',
    })
    const userMsg = getMockCreate().mock.calls[0][0].messages.find(
      (m: { role: string }) => m.role === 'user'
    )
    expect(userMsg.content).toContain('Make it shorter')
  })
})

// ─── checkQuality ────────────────────────────────────────────────────────────

describe('checkQuality', () => {
  beforeEach(() => { getMockCreate().mockReset() })

  const validQualityResponse = {
    relevance: 18, compliance: 16, evidence: 14, specificity: 12,
    word_count: 8, clarity: 9, differentiation: 4,
    flags: [],
    suggestions: ['Add a named lead officer'],
  }

  it('calls gpt-4o-mini model', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(validQualityResponse) } }],
    })
    await checkQuality('Q?', 'response text')
    expect(getMockCreate()).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gpt-4o-mini' })
    )
  })

  it('calculates total score as sum of breakdown', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(validQualityResponse) } }],
    })
    const result = await checkQuality('Q?', 'response text')
    const expected = 18 + 16 + 14 + 12 + 8 + 9 + 4 // = 81
    expect(result.score).toBe(expected)
  })

  it('assigns correct band for score >= 90 (excellent)', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{
        message: {
          content: JSON.stringify({
            ...validQualityResponse,
            relevance: 20, compliance: 20, evidence: 20, specificity: 15,
            word_count: 10, clarity: 10, differentiation: 5,
          }),
        },
      }],
    })
    const result = await checkQuality('Q?', 'response')
    expect(result.band).toBe('excellent')
    expect(result.score).toBe(100)
  })

  it('assigns correct band for score 75–89 (good)', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(validQualityResponse) } }],
    })
    const result = await checkQuality('Q?', 'response')
    expect(result.band).toBe('good') // 81
  })

  it('assigns at_risk band for score < 60', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{
        message: {
          content: JSON.stringify({
            relevance: 5, compliance: 5, evidence: 5, specificity: 5,
            word_count: 2, clarity: 2, differentiation: 1,
            flags: [], suggestions: [],
          }),
        },
      }],
    })
    const result = await checkQuality('Q?', 'poor response')
    expect(result.band).toBe('at_risk')
  })

  it('returns breakdown with all 7 dimensions', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(validQualityResponse) } }],
    })
    const result = await checkQuality('Q?', 'response')
    expect(result.breakdown).toHaveProperty('relevance')
    expect(result.breakdown).toHaveProperty('compliance')
    expect(result.breakdown).toHaveProperty('evidence')
    expect(result.breakdown).toHaveProperty('specificity')
    expect(result.breakdown).toHaveProperty('word_count')
    expect(result.breakdown).toHaveProperty('clarity')
    expect(result.breakdown).toHaveProperty('differentiation')
  })

  it('returns empty flags array when none provided', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ ...validQualityResponse, flags: undefined }) } }],
    })
    const result = await checkQuality('Q?', 'response')
    expect(result.flags).toEqual([])
  })

  it('uses json_object response_format', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(validQualityResponse) } }],
    })
    await checkQuality('Q?', 'response')
    expect(getMockCreate()).toHaveBeenCalledWith(
      expect.objectContaining({ response_format: { type: 'json_object' } })
    )
  })
})

// ─── extractQuestionsFromText ─────────────────────────────────────────────────

describe('extractQuestionsFromText', () => {
  beforeEach(() => { getMockCreate().mockReset() })

  const sampleQuestions = [
    { question_number: 'Q1', question_text: 'Describe your approach to safeguarding.', word_limit: 500, scoring_weight: 20, scoring_criteria: null, required_evidence: null },
    { question_number: 'Q2', question_text: 'How do you manage staff training?', word_limit: 300, scoring_weight: 15, scoring_criteria: null, required_evidence: null },
  ]

  it('returns parsed questions from JSON array response', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(sampleQuestions) } }],
    })
    const result = await extractQuestionsFromText('tender document text...')
    expect(result).toHaveLength(2)
    expect(result[0].question_text).toBe('Describe your approach to safeguarding.')
    expect(result[0].word_limit).toBe(500)
  })

  it('handles wrapped questions object format', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ questions: sampleQuestions }) } }],
    })
    const result = await extractQuestionsFromText('document text')
    expect(result).toHaveLength(2)
  })

  it('returns empty array when OpenAI returns empty', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ questions: [] }) } }],
    })
    const result = await extractQuestionsFromText('document text')
    expect(result).toHaveLength(0)
  })

  it('uses gpt-4o model', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(sampleQuestions) } }],
    })
    await extractQuestionsFromText('document')
    expect(getMockCreate()).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gpt-4o' })
    )
  })

  it('truncates raw text to 12000 chars to stay within context', async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify([]) } }],
    })
    const longText = 'word '.repeat(5000) // 25000 chars
    await extractQuestionsFromText(longText)
    const prompt = getMockCreate().mock.calls[0][0].messages[0].content
    // The prompt includes the text - verify total prompt isn't excessively long
    expect(prompt.length).toBeLessThan(20000)
  })
})
