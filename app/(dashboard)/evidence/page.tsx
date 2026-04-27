import { createClient } from '@/lib/supabase/server'
import { EvidenceBank } from '@/components/evidence/evidence-bank'

export const metadata = { title: 'Evidence Bank' }

export default async function EvidencePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  const { data: items } = await supabase
    .from('evidence_items')
    .select('*')
    .eq('organisation_id', profile?.organisation_id ?? '')
    .order('created_at', { ascending: false })

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Evidence Bank</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Store KPIs, case studies, audit results and testimonials. The AI injects these automatically when generating answers.
        </p>
      </div>
      <EvidenceBank initialItems={items ?? []} organisationId={profile?.organisation_id ?? ''} />
    </div>
  )
}
