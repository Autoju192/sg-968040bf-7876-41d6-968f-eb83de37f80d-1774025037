'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatCurrency, isDeadlinePast, questionStatusColor } from '@/lib/utils'
import type { Tender, TenderQuestion, TenderResponse } from '@/types/database'
import { QuestionEditor } from './question-editor'
import { Plus, Download, Clock, AlertTriangle, CheckCircle2, FileText } from 'lucide-react'

interface Props {
  tender: Tender
  initialQuestions: TenderQuestion[]
  initialResponses: TenderResponse[]
  organisationId: string
}

export function TenderWorkspace({ tender, initialQuestions, initialResponses, organisationId }: Props) {
  const [questions, setQuestions] = useState<TenderQuestion[]>(initialQuestions)
  const [responses, setResponses] = useState<Map<string, TenderResponse>>(
    new Map(initialResponses.map(r => [r.question_id, r]))
  )
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    initialQuestions[0]?.id ?? null
  )
  const [addingQuestion, setAddingQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [exporting, setExporting] = useState(false)

  const completeCount = questions.filter(q => q.status === 'complete').length
  const progressPct = questions.length > 0 ? Math.round((completeCount / questions.length) * 100) : 0
  const activeQuestion = questions.find(q => q.id === activeQuestionId)
  const activeResponse = activeQuestionId ? responses.get(activeQuestionId) : undefined
  const deadlinePast = isDeadlinePast(tender.deadline)

  const handleResponseUpdate = useCallback((questionId: string, response: TenderResponse) => {
    setResponses(prev => new Map(prev).set(questionId, response))
  }, [])

  const handleQuestionStatusUpdate = useCallback((questionId: string, status: TenderQuestion['status']) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, status } : q))
  }, [])

  async function addManualQuestion() {
    if (!newQuestion.trim()) return
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tender_questions')
      .insert({
        tender_id: tender.id,
        question_text: newQuestion.trim(),
        order_index: questions.length,
      })
      .select()
      .single()
    if (error) { toast.error('Failed to add question'); return }
    setQuestions(prev => [...prev, data])
    setActiveQuestionId(data.id)
    setNewQuestion('')
    setAddingQuestion(false)
  }

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/tender/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderId: tender.id }),
      })
      if (!res.ok) throw new Error(await res.text())
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tender.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.docx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Exported successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-3.5 flex items-center gap-4 shrink-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-foreground truncate">{tender.title}</h1>
          <div className="flex items-center gap-3 mt-0.5">
            {tender.commissioner && (
              <span className="text-xs text-muted-foreground">{tender.commissioner}</span>
            )}
            {tender.contract_value && (
              <span className="text-xs text-muted-foreground">{formatCurrency(tender.contract_value)}</span>
            )}
            {tender.deadline && (
              <span className={`flex items-center gap-1 text-xs ${deadlinePast ? 'text-red-600' : 'text-muted-foreground'}`}>
                {deadlinePast ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                Due {formatDate(tender.deadline)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${progressPct === 100 ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{completeCount}/{questions.length}</span>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting || questions.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-medium hover:bg-muted disabled:opacity-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            {exporting ? 'Exporting…' : 'Export DOCX'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Question list sidebar */}
        <aside className="w-64 bg-white border-r border-border flex flex-col shrink-0 overflow-hidden">
          <div className="px-3 py-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Questions</span>
            <button
              onClick={() => setAddingQuestion(true)}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Add question"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {questions.length === 0 && !addingQuestion ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <FileText className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">No questions yet</p>
                <button
                  onClick={() => setAddingQuestion(true)}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Add a question
                </button>
              </div>
            ) : (
              <ul className="py-1">
                {questions.map((q, i) => (
                  <li key={q.id}>
                    <button
                      onClick={() => setActiveQuestionId(q.id)}
                      className={`w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors ${
                        activeQuestionId === q.id ? 'bg-primary/5 border-r-2 border-primary' : ''
                      }`}
                    >
                      <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${questionStatusColor(q.status)}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          {q.question_number ?? `Q${i + 1}`}
                          {q.word_limit && <span className="ml-1 opacity-60">· {q.word_limit}w</span>}
                        </p>
                        <p className="text-xs text-foreground line-clamp-2 mt-0.5">{q.question_text}</p>
                        {responses.has(q.id) && responses.get(q.id)?.quality_score != null && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Score: {responses.get(q.id)!.quality_score}/100
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {addingQuestion && (
              <div className="px-3 py-2 border-t border-border">
                <textarea
                  autoFocus
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="Enter question text…"
                  rows={3}
                  className="w-full px-2 py-1.5 border border-border rounded text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.metaKey) addManualQuestion()
                    if (e.key === 'Escape') { setAddingQuestion(false); setNewQuestion('') }
                  }}
                />
                <div className="flex gap-1.5 mt-1.5">
                  <button
                    onClick={addManualQuestion}
                    className="flex-1 py-1 bg-primary text-white rounded text-[11px] font-medium hover:bg-primary/90 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setAddingQuestion(false); setNewQuestion('') }}
                    className="flex-1 py-1 border border-border rounded text-[11px] hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="border-t border-border px-3 py-2.5">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {[
                { status: 'empty', label: 'Empty' },
                { status: 'draft', label: 'Draft' },
                { status: 'ai_generated', label: 'AI generated' },
                { status: 'complete', label: 'Complete' },
              ].map(({ status, label }) => (
                <div key={status} className="flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${questionStatusColor(status)}`} />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main editor */}
        <div className="flex-1 overflow-y-auto bg-muted/20">
          {activeQuestion ? (
            <QuestionEditor
              key={activeQuestion.id}
              question={activeQuestion}
              response={activeResponse}
              organisationId={organisationId}
              onResponseUpdate={handleResponseUpdate}
              onStatusUpdate={handleQuestionStatusUpdate}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-base font-medium text-foreground">
                {questions.length === 0 ? 'Add questions to get started' : 'Select a question'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {questions.length === 0
                  ? 'Upload a tender document or add questions manually'
                  : 'Click a question in the sidebar to start writing'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
