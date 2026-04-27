'use client'

import { useState } from 'react'
import { scoreBand, QUALITY_DIMENSIONS } from '@/lib/utils'
import type { QualityBreakdown, QualityFlag } from '@/types/database'
import { Info, ChevronRight } from 'lucide-react'

interface Props {
  score: number
  breakdown: QualityBreakdown
  flags: QualityFlag[]
  onActionClick: (action: string) => void
  loading: string | null
}

const ACTION_LABELS: Record<string, string> = {
  add_evidence: 'Add Evidence',
  use_company_profile: 'Use Company Profile',
  add_kpis: 'Add KPIs',
  improve: 'Improve Answer',
  shorten: 'Shorten to Limit',
  expand: 'Expand Answer',
  rewrite_for_score: 'Rewrite for Higher Score',
}

export function QualityScore({ score, breakdown, flags, onActionClick, loading }: Props) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const band = scoreBand(score)

  const dimensions = Object.entries(QUALITY_DIMENSIONS) as Array<[keyof QualityBreakdown, typeof QUALITY_DIMENSIONS[keyof typeof QUALITY_DIMENSIONS]]>

  return (
    <div className="bg-white border border-border rounded-lg mt-4 overflow-hidden">
      {/* Header with overall score */}
      <div className={`px-5 py-4 ${band.bg} ${band.border} border-b flex items-center justify-between`}>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Quality Score</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${band.color}`}>{Math.round(score)}</span>
            <span className="text-sm text-muted-foreground">/100</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${band.bg} ${band.color} ${band.border}`}>
              {band.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {score >= 90 ? 'Submission ready' :
             score >= 75 ? 'Minor improvements possible' :
             score >= 60 ? 'Needs improvement before submitting' :
             'Major revision required'}
          </p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="px-5 py-4">
        <div className="space-y-2.5">
          {dimensions.map(([key, meta]) => {
            const rawScore = breakdown[key] ?? 0
            const pct = (rawScore / meta.maxScore) * 100
            const status = pct >= 80 ? 'good' : pct >= 50 ? 'warning' : 'poor'
            const barColor = status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-400'
            const tooltipOpen = activeTooltip === key
            const flag = flags.find(f => f.dimension === key)

            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveTooltip(tooltipOpen ? null : key)}
                      className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors"
                    >
                      {meta.label}
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${
                      status === 'good' ? 'text-green-700' :
                      status === 'warning' ? 'text-amber-700' : 'text-red-700'
                    }`}>
                      {rawScore}/{meta.maxScore}
                    </span>
                    <StatusIcon status={status} />
                  </div>
                </div>

                <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full ${barColor} rounded-full score-bar transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Tooltip panel */}
                {tooltipOpen && (
                  <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs">
                    <div className="space-y-2.5">
                      <div>
                        <p className="font-semibold text-slate-700 mb-1">What this measures</p>
                        <p className="text-slate-600 leading-relaxed">{meta.what}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 mb-1">What good looks like</p>
                        <p className="text-slate-600 leading-relaxed">{meta.good}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 mb-1">How to improve</p>
                        <p className="text-slate-600 leading-relaxed">{meta.improve}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Flag message with action button */}
                {flag && flag.status !== 'good' && (
                  <div className={`flex items-center gap-2 mt-1 text-[11px] rounded px-2.5 py-1.5 ${
                    flag.status === 'poor'
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    <span className="flex-1">{flag.message}</span>
                    {flag.action && ACTION_LABELS[flag.action] && (
                      <button
                        onClick={() => onActionClick(flag.action!)}
                        disabled={loading !== null}
                        className={`flex items-center gap-0.5 font-medium hover:underline disabled:opacity-50 shrink-0`}
                      >
                        {ACTION_LABELS[flag.action]}
                        <ChevronRight className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Suggestions */}
      {flags.filter(f => f.suggestion).length > 0 && (
        <div className="px-5 py-4 border-t border-border bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Fix suggestions</p>
          <ul className="space-y-2">
            {flags.filter(f => f.status !== 'good' && f.suggestion).map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                <span className="text-muted-foreground mt-0.5">→</span>
                <span>{flag.suggestion}</span>
                {flag.action && ACTION_LABELS[flag.action] && (
                  <button
                    onClick={() => onActionClick(flag.action!)}
                    disabled={loading !== null}
                    className="ml-auto shrink-0 text-primary hover:underline font-medium disabled:opacity-50"
                  >
                    {ACTION_LABELS[flag.action]} →
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: 'good' | 'warning' | 'poor' }) {
  if (status === 'good') return <span className="text-green-600 text-sm" aria-label="Good">✓</span>
  if (status === 'warning') return <span className="text-amber-600 text-sm" aria-label="Needs improvement">⚠</span>
  return <span className="text-red-600 text-sm" aria-label="Poor">✗</span>
}
