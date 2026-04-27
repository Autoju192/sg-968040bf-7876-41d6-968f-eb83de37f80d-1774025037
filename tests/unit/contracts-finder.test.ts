import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { searchContractsFinder } from '@/lib/discover/contracts-finder'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeRelease(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'ocds-test-001',
    date: '2025-06-01T12:00:00Z',
    description: 'Test tender description',
    buyer: { name: 'Birmingham City Council', id: 'bcc-001' },
    tender: {
      id: 'tender-001',
      title: 'Domiciliary Care Framework 2025',
      description: 'Provision of domiciliary care services',
      tenderPeriod: { endDate: '2025-08-15T17:00:00Z' },
      items: [
        {
          classification: { id: '85000000', scheme: 'CPV', description: 'Health and social work services' },
          additionalClassifications: [
            { id: '85311200', scheme: 'CPV', description: 'Welfare services for adults' },
          ],
        },
      ],
    },
    contracts: [{ value: { amount: 500000, currency: 'GBP' } }],
    ...overrides,
  }
}

function makeApiResponse(releases: Record<string, unknown>[] = []): Record<string, unknown> {
  return { releases, publishedDate: '2025-06-01', totalFound: releases.length }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('searchContractsFinder', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls Contracts Finder API with keyword param', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makeApiResponse([makeRelease()])),
    } as Response)

    await searchContractsFinder({ keyword: 'domiciliary care' })

    expect(fetch).toHaveBeenCalledOnce()
    const url = vi.mocked(fetch).mock.calls[0][0] as string
    expect(url).toContain('contractsfinder.service.gov.uk')
    expect(url).toContain('domiciliary+care')
  })

  it('returns mapped ContractsFinderResult objects', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makeApiResponse([makeRelease()])),
    } as Response)

    const results = await searchContractsFinder({ keyword: 'care' })

    expect(results).toHaveLength(1)
    const r = results[0]
    expect(r.externalId).toBe('ocds-test-001')
    expect(r.title).toBe('Domiciliary Care Framework 2025')
    expect(r.commissioner).toBe('Birmingham City Council')
    expect(r.contractValue).toBe(500000)
    expect(r.deadline).toBe('2025-08-15T17:00:00Z')
    expect(r.source).toBe('contracts_finder')
    expect(r.cpvCodes).toContain('85000000')
    expect(r.cpvCodes).toContain('85311200')
  })

  it('returns empty array when API returns no releases', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makeApiResponse([])),
    } as Response)

    const results = await searchContractsFinder({ keyword: 'nothing' })
    expect(results).toHaveLength(0)
  })

  it('throws when API returns non-2xx status', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 503,
    } as Response)

    await expect(searchContractsFinder({ keyword: 'care' })).rejects.toThrow(
      'Contracts Finder API error: 503'
    )
  })

  it('handles missing buyer name gracefully', async () => {
    const release = makeRelease({ buyer: {} })
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makeApiResponse([release])),
    } as Response)

    const results = await searchContractsFinder({ keyword: 'care' })
    expect(results[0].commissioner).toBe('Unknown')
  })

  it('handles missing contract value gracefully', async () => {
    const release = makeRelease({ contracts: [] })
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makeApiResponse([release])),
    } as Response)

    const results = await searchContractsFinder({ keyword: 'care' })
    expect(results[0].contractValue).toBeNull()
  })

  it('handles missing deadline gracefully', async () => {
    const release = makeRelease({
      tender: { title: 'Test', description: '', items: [] },
    })
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makeApiResponse([release])),
    } as Response)

    const results = await searchContractsFinder({ keyword: 'care' })
    expect(results[0].deadline).toBeNull()
  })

  it('constructs correct Contracts Finder URL for the notice', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makeApiResponse([makeRelease()])),
    } as Response)

    const results = await searchContractsFinder({ keyword: 'care' })
    expect(results[0].url).toContain('contractsfinder.service.gov.uk/Notice/')
    expect(results[0].url).toContain('ocds-test-001')
  })

  it('uses 1hr cache header', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makeApiResponse([])),
    } as Response)

    await searchContractsFinder({ keyword: 'care' })
    const options = vi.mocked(fetch).mock.calls[0][1] as RequestInit & { next?: { revalidate: number } }
    expect(options?.next?.revalidate).toBe(3600)
  })

  it('uses default keyword when none provided', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(makeApiResponse([])),
    } as Response)

    await searchContractsFinder({})
    const url = vi.mocked(fetch).mock.calls[0][0] as string
    expect(url).toContain('domiciliary')
  })
})
