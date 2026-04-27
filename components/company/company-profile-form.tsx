'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { CompanyProfile } from '@/types/database'

const SECTIONS = [
  { key: 'overview', label: 'Company Overview', placeholder: 'Describe your organisation — mission, values, size, history, what makes you distinctive.' },
  { key: 'services_offered', label: 'Services Offered', placeholder: 'List and describe all services you provide (domiciliary care, supported living, reablement, etc.)' },
  { key: 'locations', label: 'Locations & Coverage', placeholder: 'Regions, local authorities, and geographic areas you operate in.' },
  { key: 'compliance_details', label: 'Compliance & Registration', placeholder: 'CQC registration, rating, inspection history, ICO registration, professional memberships.' },
  { key: 'policies_summary', label: 'Policies Summary', placeholder: 'Key policies — safeguarding, lone working, medication, data protection, equality. Note review dates.' },
  { key: 'training_model', label: 'Training Model', placeholder: 'Induction process, mandatory training, CPD approach, specialist training, completion rates.' },
  { key: 'staffing_model', label: 'Staffing Model', placeholder: 'Recruitment process, vetting (DBS, references), supervision frequency, staff-to-service-user ratios.' },
  { key: 'safeguarding_approach', label: 'Safeguarding Approach', placeholder: 'Named DSL, escalation pathway, MASH relationships, reporting timescales, recent examples (anonymised).' },
  { key: 'qa_processes', label: 'Quality Assurance', placeholder: 'Audit schedule, spot checks, satisfaction surveys, complaint handling, governance meetings.' },
  { key: 'kpis', label: 'KPIs & Outcomes', placeholder: 'Key performance metrics — satisfaction rates, response times, staff retention, compliance rates, with dates.' },
  { key: 'case_studies', label: 'Case Studies', placeholder: 'Real examples of positive outcomes (anonymised). Include the situation, your intervention, and the result.' },
] as const

type SectionKey = typeof SECTIONS[number]['key']

interface Props {
  initialData: CompanyProfile | null
}

export function CompanyProfileForm({ initialData }: Props) {
  const [form, setForm] = useState<Record<SectionKey, string>>({
    overview: initialData?.overview ?? '',
    services_offered: initialData?.services_offered ?? '',
    locations: initialData?.locations ?? '',
    compliance_details: initialData?.compliance_details ?? '',
    policies_summary: initialData?.policies_summary ?? '',
    training_model: initialData?.training_model ?? '',
    staffing_model: initialData?.staffing_model ?? '',
    safeguarding_approach: initialData?.safeguarding_approach ?? '',
    qa_processes: initialData?.qa_processes ?? '',
    kpis: initialData?.kpis ?? '',
    case_studies: initialData?.case_studies ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionKey>('overview')

  const completionPct = Math.round(
    (SECTIONS.filter(s => form[s.key].trim().length > 20).length / SECTIONS.length) * 100
  )

  async function handleSave() {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile } = await supabase
        .from('profiles')
        .select('organisation_id')
        .eq('id', user.id)
        .single()

      const { error } = await supabase
        .from('company_profiles')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('organisation_id', profile?.organisation_id)

      if (error) throw error
      toast.success('Company profile saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const bandColor = completionPct >= 75 ? 'bg-green-500' : completionPct >= 40 ? 'bg-amber-500' : 'bg-red-400'

  return (
    <div className="flex gap-6">
      {/* Section nav */}
      <div className="w-52 shrink-0">
        <div className="bg-white rounded-lg border border-border p-3 mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium">{completionPct}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className={`h-full ${bandColor} rounded-full transition-all duration-500`} style={{ width: `${completionPct}%` }} />
          </div>
        </div>

        <nav className="space-y-0.5">
          {SECTIONS.map(section => {
            const filled = form[section.key].trim().length > 20
            return (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors ${
                  activeSection === section.key
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${filled ? 'bg-green-500' : 'bg-gray-300'}`} />
                {section.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-white rounded-lg border border-border">
        {SECTIONS.map(section => (
          <div key={section.key} className={activeSection === section.key ? 'block' : 'hidden'}>
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">{section.label}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                This data will be used directly in AI-generated tender responses for related questions.
              </p>
            </div>
            <div className="p-6">
              <textarea
                value={form[section.key]}
                onChange={e => setForm(prev => ({ ...prev, [section.key]: e.target.value }))}
                placeholder={section.placeholder}
                rows={14}
                className="w-full px-3 py-2.5 border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted-foreground">
                  {form[section.key].trim().split(/\s+/).filter(Boolean).length} words
                </p>
                <div className="flex gap-2">
                  {SECTIONS.findIndex(s => s.key === activeSection) > 0 && (
                    <button
                      onClick={() => setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.key === activeSection) - 1].key)}
                      className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 border border-border rounded hover:bg-muted transition-colors"
                    >
                      ← Previous
                    </button>
                  )}
                  {SECTIONS.findIndex(s => s.key === activeSection) < SECTIONS.length - 1 && (
                    <button
                      onClick={() => setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.key === activeSection) + 1].key)}
                      className="text-xs text-primary hover:text-primary/80 px-3 py-1.5 border border-primary/30 rounded hover:bg-primary/5 transition-colors"
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
