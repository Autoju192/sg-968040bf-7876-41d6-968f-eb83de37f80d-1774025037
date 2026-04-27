'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { countWords } from '@/lib/utils'
import type { TenderQuestion, TenderResponse } from '@/types/database'
import { AiButtons } from './ai-buttons'
import { QualityScore } from './quality-score'
import { WinningBidInsight } from './winning-bid-insight'
import { Save, CheckCircle } from 'lucide-react'

interface Props {
  question: TenderQuestion
  response: TenderResponse | undefined
  organisationId: string
  onResponseUpdate: (questionId: string, response: TenderResponse) => void
  onStatusUpdate: (questionId: string, status: TenderQuestion['status']) => void
}

export function QuestionEditor({ question, response, organisationId, onResponseUpdate, onStatusUpdate }: Props) {
  const [content, setContent] = useState(response?.content ?? '')
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [qualityData, setQualityData] = useState(response?.quality_breakdown ? {
    score: response.quality_score ?? 0,
    breakdown: response.quality_breakdown,
    flags: response.quality_flags ?? [],
  } : null)
  const [winningBids, setWinningBids] = useState<Array<{
    tenderName: string; outcome: string; similarity: number; source: string
    questionText: string; responseText: string
  }>>([])
  const [showWinningBids, setShowWinningBids] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const wordCount = countWords(content)
  const isOverLimit = question.word_limit ? wordCount > question.word_limit : false

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    if (content === (response?.content ?? '')) return

    saveTimer.current = setTimeout(() => { saveResponse(false) }, 2000)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [content])

  async function saveResponse(showToast = true) {
    setSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        question_id: question.id,
        tender_id: question.tender_id,
        content,
      }

      let saved: TenderResponse
      if (response?.id) {
        const { data, error } = await supabase
          .from('tender_responses')
          .update(payload)
          .eq('id', response.id)
          .select()
          .single()
        if (error) throw error
        saved = data
      } else {
        const { data, error } = await supabase
          .from('tender_responses')
          .upsert(payload, { onConflict: 'question_id' })
          .select()
          .single()
        if (error) throw error
        saved = data
      }

      onResponseUpdate(question.id, saved)
      if (showToast) toast.success('Saved')
    } catch (err) {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleAiAction(action: string, instruction?: string) {
    setAiLoading(action)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          questionId: question.id,
          questionText: question.question_text,
          wordLimit: question.word_limit,
          scoringCriteria: question.scoring_criteria,
          currentContent: content,
          organisationId,
          instruction,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()

      if (data.content) {
        setContent(data.content)
        // Update question status
        const newStatus = 'ai_generated'
        onStatusUpdate(question.id, newStatus)
        await createClient()
          .from('tender_questions')
          .update({ status: newStatus })
          .eq('id', question.id)
      }

      if (data.winningBids?.length) {
        setWinningBids(data.winningBids)
        setShowWinningBids(true)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI action failed')
    } finally {
      setAiLoading(null)
    }
  }

  async function handleQualityCheck() {
    setAiLoading('quality_check')
    try {
      const res = await fetch('/api/ai/quality-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          questionText: question.question_text,
          responseText: content,
          wordLimit: question.word_limit,
          scoringCriteria: question.scoring_criteria,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setQualityData({ score: data.score, breakdown: data.breakdown, flags: data.flags })

      // Save quality score to response
      if (response?.id) {
        await createClient()
          .from('tender_responses')
          .update({
            quality_score: data.score,
            quality_breakdown: data.breakdown,
            quality_flags: data.flags,
          })
          .eq('id', response.id)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Quality check failed')
    } finally {
      setAiLoading(null)
    }
  }

  async function markComplete() {
    const supabase = createClient()
    await supabase.from('tender_questions').update({ status: 'complete' }).eq('id', question.id)
    onStatusUpdate(question.id, 'complete')
    toast.success('Marked as complete')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* Question header */}
      <div className="bg-white border border-border rounded-lg p-5 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {question.question_number && (
              <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wide">
                {question.question_number}
              </p>
            )}
            <p className="text-sm font-medium text-foreground leading-relaxed">{question.question_text}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          {question.word_limit && (
            <span className="text-xs text-muted-foreground">
              Word limit: <strong>{question.word_limit}</strong>
            </span>
          )}
          {question.scoring_weight && (
            <span className="text-xs text-muted-foreground">
              Scoring weight: <strong>{question.scoring_weight}%</strong>
            </span>
          )}
          {question.scoring_criteria && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              Criteria: {question.scoring_criteria}
            </span>
          )}
        </div>
      </div>

      {/* AI Buttons */}
      <AiButtons
        onAction={handleAiAction}
        onQualityCheck={handleQualityCheck}
        loading={aiLoading}
        hasContent={content.trim().length > 0}
      />

      {/* Winning bid insight */}
      {winningBids.length > 0 && showWinningBids && (
        <WinningBidInsight
          bids={winningBids}
          onClose={() => setShowWinningBids(false)}
        />
      )}

      {/* Editor */}
      <div className="bg-white border border-border rounded-lg mt-4">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Your response</span>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${isOverLimit ? 'text-red-600' : 'text-muted-foreground'}`}>
              {wordCount}{question.word_limit ? ` / ${question.word_limit}` : ''} words
            </span>
            {isOverLimit && (
              <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">Over limit</span>
            )}
            <button
              onClick={() => saveResponse()}
              disabled={saving}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Save className="h-3 w-3" />
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your response here, or use the AI buttons above to generate one…"
          className="response-editor min-h-[280px] w-full border-0 rounded-b-lg focus:ring-0"
        />
      </div>

      {/* Quality score */}
      {qualityData && (
        <QualityScore
          score={qualityData.score}
          breakdown={qualityData.breakdown}
          flags={qualityData.flags}
          onActionClick={handleAiAction}
          loading={aiLoading}
        />
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handleQualityCheck}
          disabled={!content.trim() || aiLoading !== null}
          className="text-xs text-primary hover:underline disabled:opacity-50 disabled:no-underline"
        >
          {aiLoading === 'quality_check' ? 'Checking…' : 'Run quality check'}
        </button>
        <button
          onClick={markComplete}
          disabled={!content.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Mark complete
        </button>
      </div>
    </div>
  )
}
