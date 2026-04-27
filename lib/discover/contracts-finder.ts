// Contracts Finder public API (no auth required)
// Docs: https://www.contractsfinder.service.gov.uk/apidocumentation/Notices/v1/

export interface ContractsFinderResult {
  externalId: string
  title: string
  commissioner: string
  sector: string | null
  contractValue: number | null
  deadline: string | null
  publishedAt: string
  description: string
  url: string
  cpvCodes: string[]
  source: 'contracts_finder'
}

export interface SearchParams {
  keyword?: string
  sector?: string
  minValue?: number
  maxValue?: number
  postedFrom?: string // ISO date
}

const BASE = 'https://www.contractsfinder.service.gov.uk/Published/Notice/OCDS'

// Care sector CPV codes (UK health and social care)
const CARE_CPV_CODES = [
  '85000000', // Health and social work services
  '85100000', // Health services
  '85110000', // Hospital and related services
  '85120000', // Medical practice and related services
  '85141000', // Services provided by medical personnel
  '85142000', // Paramedical services
  '85143000', // Ambulance services
  '85144000', // Residential health facilities services
  '85145000', // Medical laboratory services
  '85300000', // Social work and related services
  '85310000', // Social work services
  '85311000', // Social work services with accommodation
  '85311200', // Welfare services for adults
  '85311300', // Welfare services for old people
  '85312000', // Social work services without accommodation
  '85312300', // Guidance and counselling services
  '85312310', // Guidance services
  '85320000', // Social services
  '85321000', // Administrative social services
  '85322000', // Community action programme',
]

function parseProcurementValue(release: Record<string, unknown>): number | null {
  try {
    const contracts = (release as Record<string, unknown[]>).contracts
    if (!Array.isArray(contracts) || !contracts.length) return null
    const contract = contracts[0] as Record<string, Record<string, unknown>>
    const value = contract?.value?.amount
    return typeof value === 'number' ? value : null
  } catch {
    return null
  }
}

function parseDeadline(release: Record<string, unknown>): string | null {
  try {
    const tender = (release as Record<string, Record<string, unknown>>).tender
    return (tender?.tenderPeriod as Record<string, string>)?.endDate ?? null
  } catch {
    return null
  }
}

function parseCpvCodes(release: Record<string, unknown>): string[] {
  try {
    const tender = (release as Record<string, Record<string, unknown[]>>).tender
    const items = tender?.items
    if (!Array.isArray(items)) return []
    const codes: string[] = []
    for (const item of items) {
      const classification = (item as Record<string, Record<string, string>>)?.classification
      if (classification?.id) codes.push(classification.id)
      const additional = (item as Record<string, Array<Record<string, string>>>)?.additionalClassifications
      if (Array.isArray(additional)) {
        additional.forEach(c => c?.id && codes.push(c.id))
      }
    }
    return codes
  } catch {
    return []
  }
}

export async function searchContractsFinder(
  params: SearchParams
): Promise<ContractsFinderResult[]> {
  const searchParams = new URLSearchParams()

  // Default to care sector if no keyword
  const keyword = params.keyword ?? 'domiciliary care supported living healthcare'
  searchParams.set('text', keyword)
  searchParams.set('size', '20')
  searchParams.set('page', '1')

  if (params.postedFrom) {
    searchParams.set('publishedFrom', params.postedFrom)
  }

  const url = `${BASE}/Search?${searchParams.toString()}`

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 3600 }, // cache 1hr
  })

  if (!response.ok) {
    throw new Error(`Contracts Finder API error: ${response.status}`)
  }

  const data = await response.json() as {
    releases: Array<Record<string, unknown>>
  }

  const releases = data.releases ?? []

  return releases.map((release): ContractsFinderResult => {
    const buyer = (release.buyer as Record<string, string>) ?? {}
    const tender = (release.tender as Record<string, unknown>) ?? {}

    return {
      externalId: (release.id as string) ?? '',
      title: (tender.title as string) ?? (release.description as string) ?? 'Untitled',
      commissioner: buyer.name ?? 'Unknown',
      sector: 'Health & Social Care',
      contractValue: parseProcurementValue(release),
      deadline: parseDeadline(release),
      publishedAt: (release.date as string) ?? new Date().toISOString(),
      description: (tender.description as string) ?? '',
      url: `https://www.contractsfinder.service.gov.uk/Notice/${release.id}`,
      cpvCodes: parseCpvCodes(release),
      source: 'contracts_finder',
    }
  })
}

// Find a Tender Service (FTS) — simpler public search
export async function searchFindATender(keyword: string): Promise<ContractsFinderResult[]> {
  // FTS doesn't have a public JSON API — use CF as primary source
  // This is a placeholder for future FTS integration
  return searchContractsFinder({ keyword })
}
