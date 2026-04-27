'use client'

import { Loader2, Sparkles, Wand2, Archive, Building2, Trophy, Scissors, Maximize2, RotateCcw, ShieldCheck, Star } from 'lucide-react'

interface Props {
  onAction: (action: string, instruction?: string) => void
  onQualityCheck: () => void
  loading: string | null
  hasContent: boolean
}

const PRIMARY_ACTIONS = [
  { id: 'generate', label: 'Generate Answer', icon: Sparkles, requiresContent: false, description: 'Generate a full answer using your company profile, evidence bank, and winning bid patterns' },
  { id: 'improve', label: 'Improve Answer', icon: Wand2, requiresContent: true, description: 'Enhance the existing answer — add specificity, stronger evidence, and clearer structure' },
  { id: 'add_evidence', label: 'Add Evidence', icon: Archive, requiresContent: true, description: 'Search your evidence bank and inject the most relevant items into this answer' },
  { id: 'use_company_profile', label: 'Use Company Profile', icon: Building2, requiresContent: false, description: 'Pull relevant sections from your company profile to ground this answer in your real data' },
  { id: 'use_winning_bid', label: 'Use Winning Bid', icon: Trophy, requiresContent: false, description: 'Find the closest matching winning bid (yours or public) and apply its pattern to this answer' },
]

const SECONDARY_ACTIONS = [
  { id: 'shorten', label: 'Shorten to Limit', icon: Scissors, requiresContent: true, description: 'Condense the answer without losing key evidence or arguments' },
  { id: 'expand', label: 'Expand Answer', icon: Maximize2, requiresContent: true, description: 'Add depth, examples, and specificity to fill more of the word limit' },
  { id: 'rewrite_for_score', label: 'Rewrite for Higher Score', icon: Star, requiresContent: true, description: 'Analyse the scoring criteria and rewrite to maximise the score on each element' },
  { id: 'check_compliance', label: 'Check Compliance', icon: ShieldCheck, requiresContent: true, description: 'Verify all mandatory elements from the question are present and explicitly addressed' },
  { id: 'add_kpis', label: 'Add KPIs', icon: RotateCcw, requiresContent: true, description: 'Find and inject the most relevant KPIs from your evidence bank into this answer' },
]

export function AiButtons({ onAction, onQualityCheck, loading, hasContent }: Props) {
  return (
    <div className="bg-white border border-border rounded-lg p-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">AI Actions</p>

      {/* Primary actions */}
      <div className="flex flex-wrap gap-2 mb-2">
        {PRIMARY_ACTIONS.map(action => {
          const disabled = (action.requiresContent && !hasContent) || loading !== null
          const isLoading = loading === action.id
          return (
            <ActionButton
              key={action.id}
              label={action.label}
              icon={action.icon}
              description={action.description}
              disabled={disabled}
              isLoading={isLoading}
              onClick={() => onAction(action.id)}
              primary
            />
          )
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-border my-2" />

      {/* Secondary actions */}
      <div className="flex flex-wrap gap-1.5">
        {SECONDARY_ACTIONS.map(action => {
          const disabled = (action.requiresContent && !hasContent) || loading !== null
          const isLoading = loading === action.id
          return (
            <ActionButton
              key={action.id}
              label={action.label}
              icon={action.icon}
              description={action.description}
              disabled={disabled}
              isLoading={isLoading}
              onClick={() => onAction(action.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function ActionButton({
  label, icon: Icon, description, disabled, isLoading, onClick, primary
}: {
  label: string
  icon: React.ElementType
  description: string
  disabled: boolean
  isLoading: boolean
  onClick: () => void
  primary?: boolean
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-1.5 text-xs font-medium rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          primary
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'border border-border text-foreground hover:bg-muted'
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Icon className="h-3 w-3" />
        )}
        {isLoading ? 'Working…' : label}
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-0 mb-1.5 z-10 w-52 bg-slate-900 text-white text-[11px] rounded-md px-2.5 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
        <p className="font-medium mb-0.5">{label}</p>
        <p className="text-slate-300 leading-relaxed">{description}</p>
        <div className="absolute top-full left-3 border-4 border-transparent border-t-slate-900" />
      </div>
    </div>
  )
}
