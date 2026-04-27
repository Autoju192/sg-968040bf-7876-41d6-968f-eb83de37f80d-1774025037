import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, organisations(name)')
    .eq('id', user.id)
    .single()

  const orgName = (profile?.organisations as unknown as { name: string } | null)?.name ?? 'My Organisation'
  const userName = profile?.full_name ?? user.email ?? 'User'

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar orgName={orgName} userName={userName} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
