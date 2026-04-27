import { createClient } from '@/lib/supabase/server'
import { BidLibrary } from '@/components/bid-library/bid-library'

export const metadata = { title: 'Bid Library' }

export default async function BidLibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  const { data: items } = await supabase
    .from('bid_library_items')
    .select('*')
    .eq('organisation_id', profile?.organisation_id)
    .order('created_at', { ascending: false })

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Bid Library</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Approved, reusable content blocks for common tender topics. The AI draws from these when generating answers.
        </p>
      </div>
      <BidLibrary initialItems={items ?? []} organisationId={profile?.organisation_id ?? ''} />
    </div>
  )
}
