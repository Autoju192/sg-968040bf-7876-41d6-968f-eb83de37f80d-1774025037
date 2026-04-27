import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Mock all external dependencies ──────────────────────────────────────────

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}))
vi.mock('@/lib/openai', () => ({
  createEmbedding: vi.fn().mockResolvedValue(new Array(1536).fill(0)),
  generateAnswer: vi.fn().mockResolvedValue('Generated answer text'),
  improveAnswer: vi.fn().mockResolvedValue('Improved answer text'),
}))

import { POST } from '@/app/api/ai/generate/route'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import * as openaiLib from '@/lib/openai'

function makeSupabaseClient(userOverride?: object | null) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userOverride !== undefined ? userOverride : { id: 'user-1' } },
        error: null,
      }),
    },
  }
}

function makeAdminClient() {
  const mockChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { overview: 'Test company' }, error: null }),
    limit: vi.fn().mockReturnThis(),
  }
  return {
    from: vi.fn().mockReturnValue(mockChain),
    rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
  }
}

function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/ai/generate', () => {
  beforeEach(() => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseClient() as ReturnType<typeof makeSupabaseClient>)
    vi.mocked(createAdminClient).mockReturnValue(makeAdminClient() as ReturnType<typeof makeAdminClient>)
  })

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseClient(null) as ReturnType<typeof makeSupabaseClient>)
    const req = makeRequest({ action: 'generate', questionText: 'Q?', organisationId: 'org-1' })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 for unknown action', async () => {
    const req = makeRequest({ action: 'invalid_action', questionText: 'Q?', organisationId: 'org-1' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Unknown action')
  })

  it('calls generateAnswer for action=generate', async () => {
    const req = makeRequest({ action: 'generate', questionText: 'Describe safeguarding.', organisationId: 'org-1' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(openaiLib.generateAnswer).toHaveBeenCalled()
    const body = await res.json()
    expect(body.content).toBe('Generated answer text')
  })

  it('calls generateAnswer for action=use_company_profile', async () => {
    const req = makeRequest({ action: 'use_company_profile', questionText: 'Q?', organisationId: 'org-1' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(openaiLib.generateAnswer).toHaveBeenCalled()
  })

  it('calls improveAnswer for action=improve', async () => {
    const req = makeRequest({
      action: 'improve', questionText: 'Q?', organisationId: 'org-1', currentContent: 'existing text',
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(openaiLib.improveAnswer).toHaveBeenCalled()
    const body = await res.json()
    expect(body.content).toBe('Improved answer text')
  })

  it('calls improveAnswer for action=shorten with word limit instruction', async () => {
    const req = makeRequest({
      action: 'shorten', questionText: 'Q?', organisationId: 'org-1',
      currentContent: 'long text', wordLimit: 300,
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const callArgs = vi.mocked(openaiLib.improveAnswer).mock.calls.at(-1)?.[0]
    expect(callArgs?.instruction).toContain('300')
  })

  it('calls improveAnswer for action=add_evidence', async () => {
    const req = makeRequest({
      action: 'add_evidence', questionText: 'Q?', organisationId: 'org-1', currentContent: 'text',
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('returns contextUsed in response', async () => {
    const req = makeRequest({ action: 'generate', questionText: 'Q?', organisationId: 'org-1' })
    const res = await POST(req)
    const body = await res.json()
    expect(body).toHaveProperty('contextUsed')
    expect(body.contextUsed).toHaveProperty('companyProfile')
    expect(body.contextUsed).toHaveProperty('evidenceItems')
    expect(body.contextUsed).toHaveProperty('bidLibraryItems')
    expect(body.contextUsed).toHaveProperty('winningBids')
  })
})
