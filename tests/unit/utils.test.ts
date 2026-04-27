import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  cn,
  formatDate,
  formatDateTime,
  formatRelative,
  isDeadlinePast,
  formatCurrency,
  countWords,
  scoreBand,
  questionStatusColor,
  outcomeColor,
  QUALITY_DIMENSIONS,
} from '@/lib/utils'

// ─── cn (classname merge) ────────────────────────────────────────────────────

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('handles conditional falsy values', () => {
    expect(cn('base', false && 'conditional', undefined, null, 'end')).toBe('base end')
  })

  it('returns empty string for no args', () => {
    expect(cn()).toBe('')
  })
})

// ─── formatDate ──────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    expect(formatDate('2025-06-15')).toBe('15 Jun 2025')
  })

  it('returns "—" for null', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('returns "—" for undefined', () => {
    expect(formatDate(undefined)).toBe('—')
  })

  it('formats a full ISO datetime string', () => {
    expect(formatDate('2025-12-25T00:00:00Z')).toBe('25 Dec 2025')
  })
})

// ─── formatDateTime ──────────────────────────────────────────────────────────

describe('formatDateTime', () => {
  it('includes time in output', () => {
    const result = formatDateTime('2025-06-15T14:30:00Z')
    expect(result).toContain('Jun 2025')
    expect(result).toMatch(/\d{2}:\d{2}/)
  })

  it('returns "—" for null', () => {
    expect(formatDateTime(null)).toBe('—')
  })
})

// ─── isDeadlinePast ──────────────────────────────────────────────────────────

describe('isDeadlinePast', () => {
  it('returns true for a date in the past', () => {
    expect(isDeadlinePast('2020-01-01')).toBe(true)
  })

  it('returns false for a date far in the future', () => {
    expect(isDeadlinePast('2099-01-01')).toBe(false)
  })

  it('returns false for null', () => {
    expect(isDeadlinePast(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isDeadlinePast(undefined)).toBe(false)
  })
})

// ─── formatCurrency ──────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats a positive value in GBP', () => {
    const result = formatCurrency(500000)
    expect(result).toContain('500,000')
    expect(result).toMatch(/£|GBP/)
  })

  it('returns "—" for null', () => {
    expect(formatCurrency(null)).toBe('—')
  })

  it('returns "—" for undefined', () => {
    expect(formatCurrency(undefined)).toBe('—')
  })

  it('formats zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).not.toBe('—')
  })
})

// ─── countWords ──────────────────────────────────────────────────────────────

describe('countWords', () => {
  it('counts words in a normal sentence', () => {
    expect(countWords('Hello world test')).toBe(3)
  })

  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0)
  })

  it('returns 0 for whitespace-only string', () => {
    expect(countWords('   ')).toBe(0)
  })

  it('handles multiple spaces between words', () => {
    expect(countWords('one  two   three')).toBe(3)
  })

  it('handles newlines as word separators', () => {
    expect(countWords('one\ntwo\nthree')).toBe(3)
  })

  it('counts a single word', () => {
    expect(countWords('hello')).toBe(1)
  })
})

// ─── scoreBand ───────────────────────────────────────────────────────────────

describe('scoreBand', () => {
  it('returns Excellent for score >= 90', () => {
    const result = scoreBand(90)
    expect(result.label).toBe('Excellent')
    expect(result.color).toContain('green')
  })

  it('returns Good for score 75–89', () => {
    expect(scoreBand(75).label).toBe('Good')
    expect(scoreBand(89).label).toBe('Good')
  })

  it('returns Needs Work for score 60–74', () => {
    expect(scoreBand(60).label).toBe('Needs Work')
    expect(scoreBand(74).label).toBe('Needs Work')
  })

  it('returns At Risk for score < 60', () => {
    expect(scoreBand(59).label).toBe('At Risk')
    expect(scoreBand(0).label).toBe('At Risk')
  })

  it('returns colour classes for each band', () => {
    expect(scoreBand(95).bg).toContain('green')
    expect(scoreBand(80).bg).toContain('blue')
    expect(scoreBand(65).bg).toContain('amber')
    expect(scoreBand(40).bg).toContain('red')
  })

  it('each band result has label, color, bg, and border', () => {
    const result = scoreBand(85)
    expect(result).toHaveProperty('label')
    expect(result).toHaveProperty('color')
    expect(result).toHaveProperty('bg')
    expect(result).toHaveProperty('border')
  })
})

// ─── questionStatusColor ─────────────────────────────────────────────────────

describe('questionStatusColor', () => {
  it('returns green for complete', () => {
    expect(questionStatusColor('complete')).toContain('green')
  })

  it('returns blue for reviewed', () => {
    expect(questionStatusColor('reviewed')).toContain('blue')
  })

  it('returns amber for ai_generated', () => {
    expect(questionStatusColor('ai_generated')).toContain('amber')
  })

  it('returns gray for draft', () => {
    expect(questionStatusColor('draft')).toContain('gray')
  })

  it('returns light gray for unknown/empty', () => {
    expect(questionStatusColor('empty')).toContain('gray')
    expect(questionStatusColor('unknown')).toContain('gray')
  })
})

// ─── outcomeColor ────────────────────────────────────────────────────────────

describe('outcomeColor', () => {
  it('returns green for won', () => {
    expect(outcomeColor('won')).toContain('green')
  })

  it('returns red for lost', () => {
    expect(outcomeColor('lost')).toContain('red')
  })

  it('returns amber for pending', () => {
    expect(outcomeColor('pending')).toContain('amber')
  })

  it('returns gray for null', () => {
    expect(outcomeColor(null)).toContain('gray')
  })

  it('returns gray for unknown outcome', () => {
    expect(outcomeColor('no_feedback')).toContain('gray')
  })
})

// ─── QUALITY_DIMENSIONS ──────────────────────────────────────────────────────

describe('QUALITY_DIMENSIONS', () => {
  const expectedDimensions = [
    'relevance',
    'compliance',
    'evidence',
    'specificity',
    'word_count',
    'clarity',
    'differentiation',
  ]

  it('has all 7 required dimensions', () => {
    expectedDimensions.forEach(dim => {
      expect(QUALITY_DIMENSIONS).toHaveProperty(dim)
    })
  })

  it('each dimension has label, maxScore, what, good, improve', () => {
    for (const [key, dim] of Object.entries(QUALITY_DIMENSIONS)) {
      expect(dim, `${key} missing label`).toHaveProperty('label')
      expect(dim, `${key} missing maxScore`).toHaveProperty('maxScore')
      expect(dim, `${key} missing what`).toHaveProperty('what')
      expect(dim, `${key} missing good`).toHaveProperty('good')
      expect(dim, `${key} missing improve`).toHaveProperty('improve')
    }
  })

  it('maxScores sum to 100', () => {
    const total = Object.values(QUALITY_DIMENSIONS).reduce((sum, d) => sum + d.maxScore, 0)
    expect(total).toBe(100)
  })

  it('all tooltip text is non-empty', () => {
    for (const [key, dim] of Object.entries(QUALITY_DIMENSIONS)) {
      expect(dim.what.length, `${key}.what empty`).toBeGreaterThan(10)
      expect(dim.good.length, `${key}.good empty`).toBeGreaterThan(10)
      expect(dim.improve.length, `${key}.improve empty`).toBeGreaterThan(10)
    }
  })
})
