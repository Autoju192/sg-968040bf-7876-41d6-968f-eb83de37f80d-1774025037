import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatCurrency, isDeadlinePast } from '@/lib/utils'
import { Plus, FileText, Clock, AlertTriangle } from 'lucide-react'

export const metadata = { title: 'Tenders' }

export default async function TendersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  const { data: tenders } = await supabase
    .from('tenders')
    .select(`
      *,
      tender_questions(count),
      tender_questions!inner(
        tender_responses(quality_score)
      )
    `)
    .eq('organisation_id', profile?.organisation_id)
    .order('created_at', { ascending: false })

  // Simpler query without the complex join for question counts
  const { data: simpleTenders } = await supabase
    .from('tenders')
    .select('*')
    .eq('organisation_id', profile?.organisation_id)
    .order('created_at', { ascending: false })

  const STATUS_FILTER = ['all', 'active', 'submitted', 'won', 'lost']

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Tenders</h1>
          <p className="text-sm text-muted-foreground mt-1">{simpleTenders?.length ?? 0} tenders total</p>
        </div>
        <Link
          href="/tenders/new"
          className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New tender
        </Link>
      </div>

      {!simpleTenders?.length ? (
        <div className="bg-white border border-border rounded-lg flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-base font-medium text-foreground">No tenders yet</p>
          <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm">
            Upload a tender document to get started. The AI will extract all questions automatically.
          </p>
          <Link
            href="/tenders/new"
            className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create your first tender
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {simpleTenders.map(tender => {
            const past = isDeadlinePast(tender.deadline)
            const statusColors: Record<string, string> = {
              active: 'text-blue-700 bg-blue-50 border-blue-200',
              submitted: 'text-amber-700 bg-amber-50 border-amber-200',
              won: 'text-green-700 bg-green-50 border-green-200',
              lost: 'text-red-700 bg-red-50 border-red-200',
            }

            return (
              <Link
                key={tender.id}
                href={`/tenders/${tender.id}`}
                className="flex items-center gap-4 bg-white border border-border rounded-lg px-5 py-4 hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${statusColors[tender.status]}`}>
                      {tender.status}
                    </span>
                    {tender.sector && (
                      <span className="text-xs text-muted-foreground">{tender.sector}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{tender.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tender.commissioner ?? 'Unknown commissioner'}
                    {tender.contract_value && ` · ${formatCurrency(tender.contract_value)}`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {tender.deadline && (
                    <div className={`flex items-center gap-1 justify-end text-xs ${past && tender.status === 'active' ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {past && tender.status === 'active' && <AlertTriangle className="h-3 w-3" />}
                      {!past && <Clock className="h-3 w-3" />}
                      {formatDate(tender.deadline)}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
