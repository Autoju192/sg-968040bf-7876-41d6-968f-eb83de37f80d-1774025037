import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TenderWorkspace } from '@/components/workspace/tender-workspace'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('tenders').select('title').eq('id', id).single()
  return { title: data?.title ?? 'Tender' }
}

export default async function TenderPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  const [{ data: tender }, { data: questions }, { data: responses }] = await Promise.all([
    supabase
      .from('tenders')
      .select('*')
      .eq('id', id)
      .eq('organisation_id', profile?.organisation_id ?? '')
      .single(),
    supabase
      .from('tender_questions')
      .select('*')
      .eq('tender_id', id)
      .order('order_index'),
    supabase
      .from('tender_responses')
      .select('*')
      .eq('tender_id', id),
  ])

  if (!tender) notFound()

  return (
    <TenderWorkspace
      tender={tender}
      initialQuestions={questions ?? []}
      initialResponses={responses ?? []}
      organisationId={profile?.organisation_id ?? ''}
    />
  )
}
