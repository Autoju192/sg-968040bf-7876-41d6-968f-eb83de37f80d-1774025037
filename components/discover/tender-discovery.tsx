'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatCurrency, isDeadlinePast } from '@/lib/utils'
import type { DiscoveredTender } from '@/types/database'
import { Search, ExternalLink, Bookmark, BookmarkCheck, EyeOff, ArrowRight, Clock, AlertTriangle } from 'lucide-react'

interface Props {
  organisationId: string
  savedTenders: DiscoveredTender[]
}

interface SearchResult {
  externalId: string
  title: string
  commissioner: string
  contractValue: number | null
  deadline: string | null
  publishedAt: string
  description: string
  url: string
  source: string
}

export function TenderDiscovery({ organisationId, savedTenders }: Props) {
  const [keyword, setKeyword] = useState('domiciliary care supported living')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [saved, setSaved] = useState<DiscoveredTender[]>(savedTenders)
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search')
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())

  const savedIds = new Set(saved.map(s => s.external_id).filter(Boolean))

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!keyword.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`/api/discover?keyword=${encodeURIComponent(keyword)}`)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResults(data.results ?? [])
      if (data.results?.length === 0) toast.info('No results found. Try different keywords.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setSearching(false)
    }
  }

  async function handleSave(result: SearchResult) {
    setSavingIds(prev => new Set(prev).add(result.externalId))
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('discovered_tenders')
        .upsert({
          organisation_id: organisationId,
          external_id: result.externalId,
          source: result.source,
          title: result.title,
          commissioner: result.commissioner,
          sector: 'Health & Social Care',
          contract_value: result.contractValue,
          deadline: result.deadline,
          published_at: result.publishedAt,
          description: result.description,
          url: result.url,
          status: 'saved',
        }, { onConflict: 'organisation_id,external_id' })
        .select()
        .single()
      if (error) throw error
      setSaved(prev => {
        const exists = prev.find(s => s.external_id === result.externalId)
        return exists ? prev.map(s => s.external_id === result.externalId ? data : s) : [data, ...prev]
      })
      toast.success('Tender saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSavingIds(prev => { const n = new Set(prev); n.delete(result.externalId); return n })
    }
  }

  async function handleIgnore(id: string) {
    const supabase = createClient()
    await supabase.from('discovered_tenders').update({ status: 'ignored' }).eq('id', id)
    setSaved(prev => prev.filter(s => s.id !== id))
    toast.success('Tender hidden')
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        <TabButton active={activeTab === 'search'} onClick={() => setActiveTab('search')} label="Search" />
        <TabButton active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} label={`Saved (${saved.length})`} />
      </div>

      {activeTab === 'search' && (
        <div>
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. domiciliary care, supported living, healthcare"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {searching ? 'Searching…' : 'Search'}
            </button>
          </form>

          {results.length === 0 && !searching && (
            <div className="bg-white border border-border rounded-lg flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Search for live UK tenders</p>
              <p className="text-xs text-muted-foreground mt-1">
                Results are pulled from Contracts Finder — the UK government&apos;s public procurement register
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              {results.map(result => (
                <TenderCard
                  key={result.externalId}
                  title={result.title}
                  commissioner={result.commissioner}
                  contractValue={result.contractValue}
                  deadline={result.deadline}
                  description={result.description}
                  url={result.url}
                  source={result.source}
                  isSaved={savedIds.has(result.externalId)}
                  isSaving={savingIds.has(result.externalId)}
                  onSave={() => handleSave(result)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div>
          {saved.length === 0 ? (
            <div className="bg-white border border-border rounded-lg flex flex-col items-center justify-center py-16 text-center">
              <Bookmark className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No saved tenders yet</p>
              <p className="text-xs text-muted-foreground mt-1">Search for tenders and save the ones you want to bid on</p>
              <button onClick={() => setActiveTab('search')} className="mt-4 text-xs text-primary hover:underline">
                Go to search →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {saved.map(tender => (
                <div key={tender.id} className="bg-white border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {tender.deadline && isDeadlinePast(tender.deadline) && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Deadline passed
                          </span>
                        )}
                        {tender.deadline && !isDeadlinePast(tender.deadline) && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-2.5 w-2.5" />
                            Due {formatDate(tender.deadline)}
                          </span>
                        )}
                        {tender.contract_value && (
                          <span className="text-xs font-medium text-foreground">{formatCurrency(tender.contract_value)}</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{tender.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{tender.commissioner}</p>
                      {tender.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tender.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {tender.url && (
                        <a
                          href={tender.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Open on Contracts Finder"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleIgnore(tender.id)}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Ignore tender"
                      >
                        <EyeOff className="h-3.5 w-3.5" />
                      </button>
                      <a
                        href={`/tenders/new?discoveredId=${tender.id}&title=${encodeURIComponent(tender.title)}`}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                      >
                        Start bid
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TenderCard({ title, commissioner, contractValue, deadline, description, url, source, isSaved, isSaving, onSave }: {
  title: string
  commissioner: string
  contractValue: number | null
  deadline: string | null
  description: string
  url: string
  source: string
  isSaved: boolean
  isSaving: boolean
  onSave: () => void
}) {
  const past = deadline ? isDeadlinePast(deadline) : false
  return (
    <div className="bg-white border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {past ? (
              <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">Closed</span>
            ) : deadline ? (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                Due {formatDate(deadline)}
              </span>
            ) : null}
            {contractValue && <span className="text-xs font-medium">{formatCurrency(contractValue)}</span>}
            <span className="text-[10px] text-muted-foreground uppercase">{source.replace('_', ' ')}</span>
          </div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{commissioner}</p>
          {description && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3">{description}</p>}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="View on Contracts Finder"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={onSave}
            disabled={isSaved || isSaving}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
              isSaved
                ? 'text-green-700 bg-green-50 border border-green-200 cursor-default'
                : 'text-white bg-primary hover:bg-primary/90 disabled:opacity-50'
            }`}
          >
            {isSaved ? <BookmarkCheck className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
            {isSaved ? 'Saved' : isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </button>
  )
}
