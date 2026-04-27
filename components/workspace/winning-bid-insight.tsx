'use client'

import { useState } from 'react'
import { X, Trophy, Globe } from 'lucide-react'

interface WinningBid {
  tenderName: string
  outcome: string
  similarity: number
  source: string
  questionText: string
  responseText: string
}

interface Props {
  bids: WinningBid[]
  onClose: () => void
}

export function WinningBidInsight({ bids, onClose }: Props) {
  const [active, setActive] = useState(0)
  const bid = bids[active]
  if (!bid) return null

  const isPublic = bid.source === 'public'

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg mt-4 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-amber-100 border-b border-amber-200">
        <Trophy className="h-4 w-4 text-amber-700" />
        <p className="text-xs font-semibold text-amber-800 flex-1">
          Winning Pattern Detected
          {bids.length > 1 && <span className="font-normal ml-1 opacity-70">({bids.length} matches found)</span>}
        </p>
        {bids.length > 1 && (
          <div className="flex gap-1">
            {bids.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 w-4 rounded-full transition-colors ${i === active ? 'bg-amber-700' : 'bg-amber-300'}`}
                aria-label={`View match ${i + 1}`}
              />
            ))}
          </div>
        )}
        <button onClick={onClose} className="text-amber-600 hover:text-amber-800 ml-2">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="px-4 py-3.5">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {isPublic ? (
                <Globe className="h-3.5 w-3.5 text-amber-600" />
              ) : (
                <Trophy className="h-3.5 w-3.5 text-amber-600" />
              )}
              <p className="text-xs font-semibold text-amber-900">{bid.tenderName}</p>
              <span className="text-[10px] text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded uppercase">
                {bid.outcome}
              </span>
              {isPublic && (
                <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                  Public record
                </span>
              )}
            </div>
            <p className="text-xs text-amber-700 mt-0.5">
              {Math.round(bid.similarity * 100)}% similarity to your question
            </p>
          </div>
        </div>

        {isPublic && (
          <p className="text-[11px] text-amber-700 bg-amber-100 border border-amber-200 rounded px-2.5 py-1.5 mb-3">
            This is a publicly available winning bid summary from Contracts Finder, not your own data.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wide mb-1.5">Winning question</p>
            <p className="text-xs text-amber-900 leading-relaxed line-clamp-4 italic">&ldquo;{bid.questionText}&rdquo;</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wide mb-1.5">Winning response (excerpt)</p>
            <p className="text-xs text-amber-900 leading-relaxed line-clamp-4">{bid.responseText.slice(0, 300)}…</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-amber-200">
          <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wide mb-1.5">
            Apply the pattern — not the content
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Extract the structure and approach from this winning answer: how specific is it? What types of evidence does it cite?
            Is there a named lead? What timescales are mentioned? Apply these patterns using your own company&apos;s data.
          </p>
        </div>
      </div>
    </div>
  )
}

