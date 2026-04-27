import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isPast } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—'
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '—'
  return format(new Date(date), 'dd MMM yyyy, HH:mm')
}

export function formatRelative(date: string | null | undefined): string {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function isDeadlinePast(date: string | null | undefined): boolean {
  if (!date) return false
  return isPast(new Date(date))
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function scoreBand(score: number) {
  if (score >= 90) return { label: 'Excellent', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' }
  if (score >= 75) return { label: 'Good', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' }
  if (score >= 60) return { label: 'Needs Work', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
  return { label: 'At Risk', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' }
}

export function questionStatusColor(status: string) {
  switch (status) {
    case 'complete': return 'bg-green-500'
    case 'reviewed': return 'bg-blue-500'
    case 'ai_generated': return 'bg-amber-500'
    case 'draft': return 'bg-gray-400'
    default: return 'bg-gray-200'
  }
}

export function outcomeColor(outcome: string | null) {
  switch (outcome) {
    case 'won': return 'text-green-700 bg-green-50 border-green-200'
    case 'lost': return 'text-red-700 bg-red-50 border-red-200'
    case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// Quality dimension metadata for tooltips
export const QUALITY_DIMENSIONS = {
  relevance: {
    label: 'Relevance',
    maxScore: 20,
    what: 'Does your answer directly address what the question is asking? Commissioners score down answers that drift off-topic, even if well-written.',
    good: 'The answer opens by restating the question\'s core theme and all paragraphs connect back to it.',
    improve: 'Use "Rewrite for Higher Score" to refocus the answer. Remove paragraphs that don\'t directly address the question.',
  },
  compliance: {
    label: 'Compliance',
    maxScore: 20,
    what: 'Have you included everything the question requires? Many questions specify mandatory elements (e.g. "include your escalation pathway" or "name the lead responsible"). Missing one can mean zero marks for that element.',
    good: 'Every explicit requirement in the question is addressed by name, not implied.',
    improve: 'Check the question text for keywords like "describe", "name", "provide an example", "explain how". Use "Check Compliance" to identify gaps.',
  },
  evidence: {
    label: 'Evidence',
    maxScore: 20,
    what: 'Have you backed up your claims with real, specific data? Commissioners distrust vague statements. Evidence means: named KPIs, audit results, dates, percentages, case study outcomes.',
    good: 'At least one measurable statistic and one real-world example are present and specific.',
    improve: 'Use "Add Evidence" to pull matching items from your evidence bank. If your evidence bank is thin, go to Evidence Bank and add your latest audit results or KPIs.',
  },
  specificity: {
    label: 'Specificity',
    maxScore: 15,
    what: 'Is your answer concrete — naming real people, real processes, real timescales — or does it stay at a high, vague level? Specificity signals operational credibility to commissioners.',
    good: 'Named roles (not just "a manager"), specific timeframes ("within 24 hours"), and described processes with steps.',
    improve: 'Replace generic phrases with specifics. Use "Make More Specific" to prompt the AI to add concrete detail. Pull named roles and processes from your company profile.',
  },
  word_count: {
    label: 'Word Count',
    maxScore: 10,
    what: 'Is your answer within the word limit set by the commissioner? Going over wastes words that won\'t be read (or may be cut). Going significantly under signals a weak answer.',
    good: 'Within 95% of the limit — using the space you\'ve been given signals you have enough to say.',
    improve: 'Use "Shorten to Word Limit" if over. Use "Expand Answer" if significantly under (below 70% of the limit).',
  },
  clarity: {
    label: 'Clarity',
    maxScore: 10,
    what: 'Is your answer easy for a commissioner to read and score? Dense paragraphs, jargon, or poor structure make scoring harder — and commissioners score faster when the answer is clear.',
    good: 'Short paragraphs, plain English, clear structure. Headers or bullet points where appropriate.',
    improve: 'Use "Improve Answer" for a general clarity pass. Break long paragraphs. Avoid acronyms without spelling them out.',
  },
  differentiation: {
    label: 'Differentiation',
    maxScore: 5,
    what: 'Does your answer say something only your organisation could say, or does it read like it could have come from any provider? Commissioners review dozens of submissions. Generic answers blend in.',
    good: 'At least one element — a named case study, a unique process, a specific outcome — that couldn\'t be copy-pasted from another provider.',
    improve: 'Use "Use Winning Bid" to see what made past answers distinctive. Pull a real case study from your evidence bank.',
  },
} as const
