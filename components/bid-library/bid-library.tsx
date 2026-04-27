'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { BidLibraryItem } from '@/types/database'
import { Plus, Trash2, Edit2, BookOpen, X, CheckCircle2 } from 'lucide-react'

const CATEGORIES = [
  'Safeguarding & Adult Protection',
  'Medication Management',
  'Recruitment & Vetting',
  'Training & Development',
  'Risk Management',
  'Governance & Quality Assurance',
  'Business Continuity',
  'Environmental Sustainability',
  'Equality, Diversity & Inclusion',
  'Technology & Innovation',
  'Partnership Working',
  'Person-Centred Care',
]

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'text-gray-600 bg-gray-50 border-gray-200' },
  approved: { label: 'Approved', color: 'text-green-700 bg-green-50 border-green-200' },
  archived: { label: 'Archived', color: 'text-amber-700 bg-amber-50 border-amber-200' },
}

type FormStatus = 'draft' | 'approved' | 'archived'
const EMPTY_FORM: { title: string; category: string; content: string; tags: string; status: FormStatus } = {
  title: '', category: CATEGORIES[0], content: '', tags: '', status: 'draft',
}

interface Props {
  initialItems: BidLibraryItem[]
  organisationId: string
}

export function BidLibrary({ initialItems, organisationId }: Props) {
  const [items, setItems] = useState<BidLibraryItem[]>(initialItems)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const filtered = items.filter(i => {
    if (filterCategory !== 'all' && i.category !== filterCategory) return false
    if (filterStatus !== 'all' && i.status !== filterStatus) return false
    return true
  })

  function startEdit(item: BidLibraryItem) {
    setForm({
      title: item.title,
      category: item.category,
      content: item.content,
      tags: item.tags.join(', '),
      status: item.status,
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
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      const payload = {
        organisation_id: organisationId,
        title: form.title.trim(),
        category: form.category,
        content: form.content.trim(),
        tags,
        status: form.status,
        word_count: form.content.trim().split(/\s+/).filter(Boolean).length,
      }

      if (editingId) {
        const { data, error } = await supabase
          .from('bid_library_items')
          .update(payload)
          .eq('id', editingId)
          .select()
          .single()
        if (error) throw error
        setItems(prev => prev.map(i => i.id === editingId ? data : i))
        toast.success('Library item updated')
        fetch('/api/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'bid_library', id: editingId }),
        }).catch(() => {})
      } else {
        const { data, error } = await supabase
          .from('bid_library_items')
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        setItems(prev => [data, ...prev])
        toast.success('Library item added')
        fetch('/api/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'bid_library', id: data.id }),
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
    if (!confirm('Delete this library item?')) return
    const supabase = createClient()
    const { error } = await supabase.from('bid_library_items').delete().eq('id', id)
    if (error) { toast.error('Delete failed'); return }
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Deleted')
  }

  async function toggleApprove(item: BidLibraryItem) {
    const newStatus = item.status === 'approved' ? 'draft' : 'approved'
    const supabase = createClient()
    const { error } = await supabase
      .from('bid_library_items')
      .update({ status: newStatus })
      .eq('id', item.id)
    if (error) { toast.error('Update failed'); return }
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i))
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All statuses</option>
          <option value="approved">Approved</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <div className="flex-1" />
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM) }}
          className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add content
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-border rounded-lg p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">{editingId ? 'Edit content' : 'Add content block'}</h3>
            <button onClick={cancelForm}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Title *</label>
              <input
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. Safeguarding Response Framework"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Content *</label>
            <textarea
              value={form.content}
              onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              rows={8}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Write the reusable content here. Be specific — name processes, roles, timescales. This content is approved for use in any relevant tender."
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Tags (comma separated)</label>
              <input
                value={form.tags}
                onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="safeguarding, adults, escalation"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as typeof EMPTY_FORM['status'] }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={cancelForm} className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-lg flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">No library content yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add approved content blocks that can be reused across tenders</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="bg-white border border-border rounded-lg px-4 py-3.5 flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${STATUS_CONFIG[item.status].color}`}>
                    {STATUS_CONFIG[item.status].label}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                  {item.word_count && <span className="text-xs text-muted-foreground">{item.word_count} words</span>}
                </div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.content}</p>
                {item.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-start gap-1 shrink-0">
                <button
                  onClick={() => toggleApprove(item)}
                  title={item.status === 'approved' ? 'Mark as draft' : 'Approve for use'}
                  className={`p-1.5 rounded transition-colors ${item.status === 'approved' ? 'text-green-600 hover:bg-green-50' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
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
