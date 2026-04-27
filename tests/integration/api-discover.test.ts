import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))
vi.mock('@/lib/discover/contracts-finder', () => ({
  searchContractsFinder: vi.fn().mockResolvedValue([
    {
      externalId: 'ocds-001',
      title: 'Domiciliary Care Framework',
      commissioner: 'Birmingham CC',
      sector: 'Health & Social Care',
      contractValue: 500000,
      deadline: '2025-09-01T17:00:00Z',
      publishedAt: '2025-06-01',
      description: 'Care at home services',
      url: 'https://contractsfinder.service.gov.uk/Notice/ocds-001',
      cpvCodes: ['85311200'],
      source: 'contracts_finder',
    },
  ]),
}))

import { GET } from '@/app/api/discover/route'
import { createClient } from '@/lib/supabase/server'
import * as contractsFinder from '@/lib/discover/contracts-finder'

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

function makeRequest(keyword?: string) {
  const url = keyword
    ? `http://localhost/api/discover?keyword=${encodeURIComponent(keyword)}`
    : 'http://localhost/api/discover'
  return new NextRequest(url)
}

describe('GET /api/discover', () => {
  beforeEach(() => {
    vi.mocked(createClient).mockResolvedValue(mockClient() as ReturnType<typeof mockClient>)
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(mockClient(null) as ReturnType<typeof mockClient>)
    const res = await GET(makeRequest())
    expect(res.status).toBe(401)
  })

  it('returns results array in response', async () => {
    const res = await GET(makeRequest('domiciliary care'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('results')
    expect(body.results).toHaveLength(1)
    expect(body.results[0].title).toBe('Domiciliary Care Framework')
  })

  it('passes keyword to searchContractsFinder', async () => {
    await GET(makeRequest('supported living'))
    expect(contractsFinder.searchContractsFinder).toHaveBeenCalledWith(
      expect.objectContaining({ keyword: 'supported living' })
    )
  })

  it('uses default keyword when none provided', async () => {
    await GET(makeRequest())
    expect(contractsFinder.searchContractsFinder).toHaveBeenCalledWith(
      expect.objectContaining({ keyword: 'domiciliary care' })
    )
  })

  it('returns 500 on upstream error', async () => {
    vi.mocked(contractsFinder.searchContractsFinder).mockRejectedValueOnce(
      new Error('API timeout')
    )
    const res = await GET(makeRequest())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})
