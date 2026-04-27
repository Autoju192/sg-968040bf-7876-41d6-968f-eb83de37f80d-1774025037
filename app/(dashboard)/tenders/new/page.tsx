'use client'

import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { Suspense } from 'react'

function NewTenderForm() {
  const router = useRouter()
  const params = useSearchParams()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: params.get('title') ?? '',
    commissioner: '',
    deadline: '',
    contract_value: '',
    sector: 'Health & Social Care',
  })
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'details' | 'upload' | 'parsing'>('details')
  const [creating, setCreating] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type)) {
      toast.error('Only PDF and DOCX files are supported')
      return
    }
    setFile(f)
  }

  async function handleCreate() {
    if (!form.title.trim()) { toast.error('Tender title is required'); return }
    setCreating(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile } = await supabase
        .from('profiles')
        .select('organisation_id')
        .eq('id', user.id)
        .single()

      // Create tender
      const { data: tender, error: tenderError } = await supabase
        .from('tenders')
        .insert({
          organisation_id: profile?.organisation_id,
          title: form.title.trim(),
          commissioner: form.commissioner || null,
          deadline: form.deadline || null,
          contract_value: form.contract_value ? parseFloat(form.contract_value) : null,
          sector: form.sector || null,
          discovered_id: params.get('discoveredId') || null,
        })
        .select()
        .single()

      if (tenderError) throw tenderError

      if (file) {
        setStep('parsing')

        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop()
        const filePath = `${profile?.organisation_id}/${tender.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('tender-documents')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('tender-documents')
          .getPublicUrl(filePath)

        // Create document record
        const { data: doc, error: docError } = await supabase
          .from('tender_documents')
          .insert({
            tender_id: tender.id,
            file_name: file.name,
            file_url: publicUrl,
            file_type: fileExt === 'pdf' ? 'pdf' : 'docx',
          })
          .select()
          .single()

        if (docError) throw docError

        // Parse document
        const formData = new FormData()
        formData.append('file', file)
        formData.append('tenderId', tender.id)
        formData.append('documentId', doc.id)

        const parseRes = await fetch('/api/tender/parse', { method: 'POST', body: formData })
        if (!parseRes.ok) {
          const errText = await parseRes.text()
          throw new Error(`Parse failed: ${errText}`)
        }
      }

      toast.success('Tender created')
      router.push(`/tenders/${tender.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Create failed')
      setCreating(false)
      setStep('details')
    }
  }

  if (step === 'parsing') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-base font-medium">Extracting questions…</p>
        <p className="text-sm text-muted-foreground mt-2">
          The AI is reading your tender document and extracting all questions, word limits, and scoring criteria
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-border rounded-lg">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold">Tender details</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Enter the key information about this tender</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tender title *</label>
            <input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. Adult Domiciliary Care Framework 2025"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Commissioner</label>
              <input
                value={form.commissioner}
                onChange={e => setForm(p => ({ ...p, commissioner: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. Birmingham City Council"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Submission deadline</label>
              <input
                type="datetime-local"
                value={form.deadline}
                onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Contract value (£)</label>
              <input
                type="number"
                value={form.contract_value}
                onChange={e => setForm(p => ({ ...p, contract_value: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. 500000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Sector</label>
              <select
                value={form.sector}
                onChange={e => setForm(p => ({ ...p, sector: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option>Health & Social Care</option>
                <option>Supported Living</option>
                <option>Domiciliary Care</option>
                <option>Healthcare Staffing</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 pb-5">
          <div className="border border-dashed border-border rounded-lg p-6 text-center">
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  className="text-xs text-muted-foreground hover:text-foreground ml-2 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Upload tender document</p>
                <p className="text-xs text-muted-foreground mt-1 mb-3">PDF or DOCX — the AI will extract all questions automatically</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded hover:bg-primary/5 transition-colors"
                >
                  Choose file
                </button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Optional — you can also add questions manually in the workspace
          </p>
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {creating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {file ? 'Create & extract questions' : 'Create tender'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NewTenderPage() {
  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">New Tender</h1>
        <p className="text-sm text-muted-foreground mt-1">Create a tender workspace and optionally upload the tender document</p>
      </div>
      <Suspense>
        <NewTenderForm />
      </Suspense>
    </div>
  )
}
