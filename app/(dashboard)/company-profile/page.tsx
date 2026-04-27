import { createClient } from '@/lib/supabase/server'
import { CompanyProfileForm } from '@/components/company/company-profile-form'

export const metadata = { title: 'Company Profile' }

export default async function CompanyProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  const { data: companyProfile } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('organisation_id', profile?.organisation_id ?? '')
    .single()

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Company Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          This is the AI&apos;s primary data source. A complete profile generates stronger, more specific tender answers.
        </p>
      </div>
      <CompanyProfileForm initialData={companyProfile} />
    </div>
  )
}
