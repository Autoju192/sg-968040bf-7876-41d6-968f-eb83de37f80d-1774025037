import { createClient } from '@/lib/supabase/server'
import { PreviousBidsList } from '@/components/previous-bids/previous-bids-list'

export const metadata = { title: 'Previous Bids' }

export default async function PreviousBidsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  const { data: bids } = await supabase
    .from('previous_bids')
    .select('*, previous_bid_sections(count)')
    .eq('organisation_id', profile?.organisation_id ?? '')
    .order('submission_date', { ascending: false, nullsFirst: false })

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Previous Bids</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Import your past tenders. Winning bids are analysed to extract patterns used when generating new answers.
        </p>
      </div>
      <PreviousBidsList initialBids={bids ?? []} organisationId={profile?.organisation_id ?? ''} />
    </div>
  )
}
