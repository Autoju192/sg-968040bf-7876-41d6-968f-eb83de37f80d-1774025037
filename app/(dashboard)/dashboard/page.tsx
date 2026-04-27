import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatCurrency } from '@/lib/utils'
import {
  FileText, Archive, BookOpen, Search, ArrowRight, TrendingUp,
  Clock, CheckCircle2, AlertCircle
} from 'lucide-react'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, full_name')
    .eq('id', user.id)
    .single()

  const orgId = profile?.organisation_id
  if (!orgId) return null

  const [
    { data: tenders },
    { data: companyProfile },
    { count: evidenceCount },
    { count: libraryCount },
    { count: prevBidsCount },
    { count: discoveredCount },
  ] = await Promise.all([
    supabase.from('tenders').select('*').eq('organisation_id', orgId).order('created_at', { ascending: false }).limit(5),
    supabase.from('company_profiles').select('completion_pct').eq('organisation_id', orgId).single(),
    supabase.from('evidence_items').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId),
    supabase.from('bid_library_items').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId),
    supabase.from('previous_bids').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId),
    supabase.from('discovered_tenders').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'new'),
  ])

  const profilePct = companyProfile?.completion_pct ?? 0
  const greeting = profile?.full_name ? `Hi, ${profile.full_name.split(' ')[0]}` : 'Welcome'

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">{greeting}</h1>
        <p className="text-muted-foreground text-sm mt-1">Here&apos;s what&apos;s happening with your tenders</p>
      </div>

      {/* Company profile alert */}
      {profilePct < 70 && (
        <Link
          href="/company-profile"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 hover:bg-amber-100 transition-colors group"
        >
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800">Your company profile is {profilePct}% complete</p>
            <p className="text-xs text-amber-600 mt-0.5">A complete profile helps the AI generate stronger, more specific tender answers</p>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active Tenders"
          value={tenders?.filter(t => t.status === 'active').length ?? 0}
          icon={FileText}
          href="/tenders"
          color="blue"
        />
        <StatCard
          label="Evidence Items"
          value={evidenceCount ?? 0}
          icon={Archive}
          href="/evidence"
          color="green"
        />
        <StatCard
          label="Bid Library"
          value={libraryCount ?? 0}
          icon={BookOpen}
          href="/bid-library"
          color="purple"
        />
        <StatCard
          label="New Opportunities"
          value={discoveredCount ?? 0}
          icon={Search}
          href="/discover"
          color="orange"
          badge="new"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent tenders */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Tenders</h2>
            <Link href="/tenders" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {!tenders?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <FileText className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">No tenders yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Upload a tender document to get started</p>
              <Link
                href="/tenders/new"
                className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium hover:bg-primary/90 transition-colors"
              >
                Create tender
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {tenders.map(tender => (
                <li key={tender.id}>
                  <Link
                    href={`/tenders/${tender.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors group"
                  >
                    <TenderStatusIcon status={tender.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{tender.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tender.commissioner ?? 'Unknown commissioner'} · Due {formatDate(tender.deadline)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {tender.contract_value && (
                        <p className="text-xs font-medium text-foreground">{formatCurrency(tender.contract_value)}</p>
                      )}
                      <TenderStatusBadge status={tender.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <QuickAction href="/tenders/new" label="Start new tender" description="Upload a tender document" icon={FileText} />
              <QuickAction href="/discover" label="Discover opportunities" description="Search live UK tenders" icon={Search} />
              <QuickAction href="/evidence" label="Add evidence" description="KPIs, audits, case studies" icon={Archive} />
              <QuickAction href="/previous-bids" label="Import past bid" description="Train your AI engine" icon={TrendingUp} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Data Completeness</h2>
            <div className="space-y-3">
              <DataBar label="Company Profile" value={profilePct} href="/company-profile" />
              <DataBar label="Evidence Items" value={Math.min((evidenceCount ?? 0) * 10, 100)} href="/evidence" />
              <DataBar label="Previous Bids" value={Math.min((prevBidsCount ?? 0) * 20, 100)} href="/previous-bids" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, href, color, badge }: {
  label: string; value: number; icon: React.ElementType; href: string; color: string; badge?: string
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }[color] ?? 'bg-muted text-foreground'

  return (
    <Link href={href} className="bg-white rounded-lg border border-border p-5 hover:border-primary/30 hover:shadow-sm transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-md ${colors}`}>
          <Icon className="h-4 w-4" />
        </div>
        {badge && value > 0 && (
          <span className="text-[10px] font-semibold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            {badge}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </Link>
  )
}

function QuickAction({ href, label, description, icon: Icon }: {
  href: string; label: string; description: string; icon: React.ElementType
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors group"
    >
      <div className="p-1.5 rounded bg-muted group-hover:bg-primary/10 transition-colors">
        <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  )
}

function DataBar({ label, value, href }: { label: string; value: number; href: string }) {
  const pct = Math.min(Math.max(value, 0), 100)
  const color = pct >= 75 ? 'bg-green-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-400'
  return (
    <Link href={href} className="block group">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        <span className="text-xs font-medium text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full score-bar`} style={{ width: `${pct}%` }} />
      </div>
    </Link>
  )
}

function TenderStatusIcon({ status }: { status: string }) {
  if (status === 'won') return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
  if (status === 'active') return <Clock className="h-4 w-4 text-blue-500 shrink-0" />
  return <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
}

function TenderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'text-blue-700 bg-blue-50',
    submitted: 'text-amber-700 bg-amber-50',
    won: 'text-green-700 bg-green-50',
    lost: 'text-red-700 bg-red-50',
  }
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${styles[status] ?? 'text-muted-foreground bg-muted'}`}>
      {status}
    </span>
  )
}
