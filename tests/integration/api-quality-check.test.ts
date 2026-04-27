import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))
vi.mock('@/lib/openai', () => ({
  checkQuality: vi.fn().mockResolvedValue({
    score: 82,
    breakdown: { relevance: 17, compliance: 16, evidence: 15, specificity: 13, word_count: 9, clarity: 8, differentiation: 4 },
    flags: [],
    suggestions: ['Add named lead'],
    band: 'good',
  }),
}))

import { POST } from '@/app/api/ai/quality-check/route'
import { createClient } from '@/lib/supabase/server'
import * as openaiLib from '@/lib/openai'

function mockClient(userObj?: object | null) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userObj !== undefined ? userObj : { id: 'user-1' } },
        error: null,
      }),
    },
  }
}

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/ai/quality-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/ai/quality-check', () => {
  beforeEach(() => {
    vi.mocked(createClient).mockResolvedValue(mockClient() as ReturnType<typeof mockClient>)
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(mockClient(null) as ReturnType<typeof mockClient>)
    const res = await POST(makeRequest({ questionText: 'Q?', responseText: 'R.' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when questionText missing', async () => {
    const res = await POST(makeRequest({ responseText: 'some text' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when responseText missing', async () => {
    const res = await POST(makeRequest({ questionText: 'Q?' }))
    expect(res.status).toBe(400)
  })

  it('calls checkQuality with correct params', async () => {
    const res = await POST(makeRequest({
      questionText: 'Describe your safeguarding.',
      responseText: 'Our approach includes...',
      wordLimit: 500,
      scoringCriteria: 'Leadership',
    }))
    expect(res.status).toBe(200)
    expect(openaiLib.checkQuality).toHaveBeenCalledWith(
      'Describe your safeguarding.',
      'Our approach includes...',
      500,
      'Leadership',
    )
  })

  it('returns score and band in response', async () => {
    const res = await POST(makeRequest({ questionText: 'Q?', responseText: 'answer' }))
    const body = await res.json()
    expect(body.score).toBe(82)
    expect(body.band).toBe('good')
    expect(body.breakdown).toHaveProperty('relevance')
    expect(body.flags).toBeInstanceOf(Array)
    expect(body.suggestions).toBeInstanceOf(Array)
  })
})
