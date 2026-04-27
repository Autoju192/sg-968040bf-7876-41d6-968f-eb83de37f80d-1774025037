import { createClient } from '@/lib/supabase/server'
import { TenderDiscovery } from '@/components/discover/tender-discovery'

export const metadata = { title: 'Discover Tenders' }

export default async function DiscoverPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  const { data: saved } = await supabase
    .from('discovered_tenders')
    .select('*')
    .eq('organisation_id', profile?.organisation_id)
    .neq('status', 'ignored')
    .order('deadline', { ascending: true, nullsFirst: false })
    .limit(50)

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Discover Tenders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search live UK public sector tenders from Contracts Finder. Save relevant ones and start writing.
        </p>
      </div>
      <TenderDiscovery
        organisationId={profile?.organisation_id ?? ''}
        savedTenders={saved ?? []}
      />
    </div>
  )
}
