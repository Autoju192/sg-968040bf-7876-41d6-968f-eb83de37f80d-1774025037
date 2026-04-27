'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatCurrency, outcomeColor } from '@/lib/utils'
import type { PreviousBid } from '@/types/database'
import { Plus, Upload, Trash2, FileText, TrendingUp, X } from 'lucide-react'

const EMPTY_FORM = {
  tender_name: '',
  commissioner: '',
  submission_date: '',
  outcome: '' as '' | 'won' | 'lost' | 'pending' | 'no_feedback',
  overall_score: '',
  feedback: '',
  contract_value: '',
  sector: 'Health & Social Care',
}

interface Props {
  initialBids: (PreviousBid & { previous_bid_sections: { count: number }[] })[]
  organisationId: string
}

export function PreviousBidsList({ initialBids, organisationId }: Props) {
  const [bids, setBids] = useState(initialBids)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSave() {
    if (!form.tender_name.trim()) { toast.error('Tender name is required'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('previous_bids')
        .insert({
          organisation_id: organisationId,
          tender_name: form.tender_name.trim(),
          commissioner: form.commissioner || null,
          submission_date: form.submission_date || null,
          outcome: form.outcome || null,
          overall_score: form.overall_score ? parseFloat(form.overall_score) : null,
          feedback: form.feedback || null,
          contract_value: form.contract_value ? parseFloat(form.contract_value) : null,
          sector: form.sector || null,
          source: 'own',
        })
        .select()
        .single()
      if (error) throw error
      setBids(prev => [{ ...data, previous_bid_sections: [] }, ...prev])
      toast.success('Bid added. Import Q&A sections to unlock winning bid analysis.')
      setShowForm(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast.error('Only PDF and DOCX files are supported')
      return
    }
    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('organisationId', organisationId)

      const res = await fetch('/api/previous-bids/import', { method: 'POST', body: formData })
      if (!res.ok) throw new Error(await res.text())
      const { bid } = await res.json()
      setBids(prev => [{ ...bid, previous_bid_sections: [] }, ...prev])
      toast.success('Bid imported successfully — Q&A sections extracted and embedded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this bid and all its sections?')) return
    const supabase = createClient()
    const { error } = await supabase.from('previous_bids').delete().eq('id', id)
    if (error) { toast.error('Delete failed'); return }
    setBids(prev => prev.filter(b => b.id !== id))
    toast.success('Deleted')
  }

  const wonCount = bids.filter(b => b.outcome === 'won').length
  const lostCount = bids.filter(b => b.outcome === 'lost').length

  return (
    <div>
      {/* Stats */}
      {bids.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-foreground">{bids.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total bids imported</p>
          </div>
          <div className="bg-white border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-green-700">{wonCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Winning bids</p>
          </div>
          <div className="bg-white border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-foreground">
              {wonCount + lostCount > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : '—'}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Win rate</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-sm hover:bg-muted transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add manually
        </button>
        <label className={`flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 cursor-pointer transition-colors ${importing ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Upload className="h-3.5 w-3.5" />
          {importing ? 'Importing…' : 'Import from file'}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            disabled={importing}
            onChange={handleImportFile}
          />
        </label>
        <p className="text-xs text-muted-foreground ml-2">Upload a past bid (PDF or DOCX) to extract Q&amp;A pairs automatically</p>
      </div>

      {/* Manual entry form */}
      {showForm && (
        <div className="bg-white border border-border rounded-lg p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Add previous bid</h3>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Tender name *</label>
              <input value={form.tender_name} onChange={e => setForm(p => ({ ...p, tender_name: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. Adult Domiciliary Care Framework 2023" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Commissioner</label>
              <input value={form.commissioner} onChange={e => setForm(p => ({ ...p, commissioner: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. Birmingham City Council" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Submission date</label>
              <input type="date" value={form.submission_date} onChange={e => setForm(p => ({ ...p, submission_date: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Outcome</label>
              <select value={form.outcome} onChange={e => setForm(p => ({ ...p, outcome: e.target.value as typeof form.outcome }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Unknown</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="pending">Pending</option>
                <option value="no_feedback">No feedback</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Overall score (%)</label>
              <input type="number" min="0" max="100" value={form.overall_score} onChange={e => setForm(p => ({ ...p, overall_score: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. 82" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Contract value (£)</label>
              <input type="number" value={form.contract_value} onChange={e => setForm(p => ({ ...p, contract_value: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. 250000" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Feedback received</label>
            <textarea value={form.feedback} onChange={e => setForm(p => ({ ...p, feedback: e.target.value }))} rows={3}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Any evaluator feedback, score breakdown, or notes about why it won or lost" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : 'Add bid'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {bids.length === 0 ? (
        <div className="bg-white border border-border rounded-lg flex flex-col items-center justify-center py-16 text-center">
          <TrendingUp className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">No previous bids yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Import past tender responses to power the winning bid analysis engine. The AI learns patterns from your successful bids.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {bids.map(bid => {
            const sectionCount = bid.previous_bid_sections?.[0]?.count ?? 0
            return (
              <div key={bid.id} className="bg-white border border-border rounded-lg px-4 py-3.5 flex gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {bid.outcome && (
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${outcomeColor(bid.outcome)}`}>
                        {bid.outcome.replace('_', ' ')}
                      </span>
                    )}
                    {bid.overall_score && (
                      <span className="text-xs text-muted-foreground">{bid.overall_score}%</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {sectionCount} Q&amp;A sections
                    </span>
                    {sectionCount === 0 && bid.outcome === 'won' && (
                      <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                        Import file to enable analysis
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground">{bid.tender_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {bid.commissioner && `${bid.commissioner} · `}
                    {formatDate(bid.submission_date)}
                    {bid.contract_value && ` · ${formatCurrency(bid.contract_value)}`}
                  </p>
                  {bid.feedback && (
                    <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">"{bid.feedback}"</p>
                  )}
                </div>
                <div className="flex items-start gap-1 shrink-0">
                  <button onClick={() => handleDelete(bid.id)} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
