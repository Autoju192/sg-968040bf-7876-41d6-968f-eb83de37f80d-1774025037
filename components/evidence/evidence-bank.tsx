'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { EvidenceItem, EvidenceType } from '@/types/database'
import { Plus, Trash2, Edit2, Archive, X, Check } from 'lucide-react'

const TYPES: { value: EvidenceType; label: string }[] = [
  { value: 'kpi', label: 'KPI / Metric' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'audit', label: 'Audit Result' },
  { value: 'training_stat', label: 'Training Stat' },
  { value: 'safeguarding', label: 'Safeguarding Example' },
  { value: 'accreditation', label: 'Accreditation' },
]

const TYPE_COLORS: Record<EvidenceType, string> = {
  kpi: 'bg-blue-50 text-blue-700 border-blue-200',
  case_study: 'bg-green-50 text-green-700 border-green-200',
  testimonial: 'bg-purple-50 text-purple-700 border-purple-200',
  audit: 'bg-amber-50 text-amber-700 border-amber-200',
  training_stat: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  safeguarding: 'bg-red-50 text-red-700 border-red-200',
  accreditation: 'bg-teal-50 text-teal-700 border-teal-200',
}

const EMPTY_FORM = { type: 'kpi' as EvidenceType, title: '', content: '', metric_value: '', metric_date: '', source: '' }

interface Props {
  initialItems: EvidenceItem[]
  organisationId: string
}

export function EvidenceBank({ initialItems, organisationId }: Props) {
  const [items, setItems] = useState<EvidenceItem[]>(initialItems)
  const [filter, setFilter] = useState<EvidenceType | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

  function startEdit(item: EvidenceItem) {
    setForm({
      type: item.type,
      title: item.title,
      content: item.content,
      metric_value: item.metric_value ?? '',
      metric_date: item.metric_date ?? '',
      source: item.source ?? '',
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required')
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        organisation_id: organisationId,
        type: form.type,
        title: form.title.trim(),
        content: form.content.trim(),
        metric_value: form.metric_value || null,
        metric_date: form.metric_date || null,
        source: form.source || null,
      }

      if (editingId) {
        const { data, error } = await supabase
          .from('evidence_items')
          .update(payload)
          .eq('id', editingId)
          .select()
          .single()
        if (error) throw error
        setItems(prev => prev.map(i => i.id === editingId ? data : i))
        toast.success('Evidence updated')

        // Queue embedding generation
        fetch('/api/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'evidence', id: editingId }),
        }).catch(() => {})
      } else {
        const { data, error } = await supabase
          .from('evidence_items')
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        setItems(prev => [data, ...prev])
        toast.success('Evidence added')

        fetch('/api/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'evidence', id: data.id }),
        }).catch(() => {})
      }

      cancelForm()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this evidence item?')) return
    const supabase = createClient()
    const { error } = await supabase.from('evidence_items').delete().eq('id', id)
    if (error) { toast.error('Delete failed'); return }
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Deleted')
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex gap-1.5 overflow-x-auto">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" count={items.length} />
          {TYPES.map(t => (
            <FilterButton
              key={t.value}
              active={filter === t.value}
              onClick={() => setFilter(t.value)}
              label={t.label}
              count={items.filter(i => i.type === t.value).length}
            />
          ))}
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM) }}
          className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Add evidence
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-border rounded-lg p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">{editingId ? 'Edit evidence' : 'Add evidence'}</h3>
            <button onClick={cancelForm} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
              <select
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value as EvidenceType }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Title *</label>
              <input
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. 97% CQC Compliance Rate 2024"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Content *</label>
            <textarea
              value={form.content}
              onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Describe the evidence in detail. Be specific — this text is injected directly into tender answers."
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Metric value</label>
              <input
                value={form.metric_value}
                onChange={e => setForm(p => ({ ...p, metric_value: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. 97%"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Date</label>
              <input
                type="date"
                value={form.metric_date}
                onChange={e => setForm(p => ({ ...p, metric_date: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Source</label>
              <input
                value={form.source}
                onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. CQC Inspection"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={cancelForm} className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-lg flex flex-col items-center justify-center py-16 text-center">
          <Archive className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">No evidence items yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add KPIs, audit results, and case studies to strengthen your AI-generated answers</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="bg-white border border-border rounded-lg px-4 py-3.5 flex gap-4 hover:border-border/80 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${TYPE_COLORS[item.type]}`}>
                    {TYPES.find(t => t.value === item.type)?.label}
                  </span>
                  {item.metric_value && (
                    <span className="text-xs font-semibold text-foreground">{item.metric_value}</span>
                  )}
                  {item.metric_date && (
                    <span className="text-xs text-muted-foreground">{formatDate(item.metric_date)}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.content}</p>
                {item.source && (
                  <p className="text-xs text-muted-foreground mt-1">Source: {item.source}</p>
                )}
              </div>
              <div className="flex items-start gap-1 shrink-0">
                <button
                  onClick={() => startEdit(item)}
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Edit"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterButton({ active, onClick, label, count }: {
  active: boolean; onClick: () => void; label: string; count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
        active ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground hover:text-foreground hover:border-border/60'
      }`}
    >
      {label}
      <span className={`text-[10px] ${active ? 'opacity-70' : 'text-muted-foreground'}`}>{count}</span>
    </button>
  )
}
