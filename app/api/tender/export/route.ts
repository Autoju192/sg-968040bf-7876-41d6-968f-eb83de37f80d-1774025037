import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { tenderId } = await req.json()
    if (!tenderId) return NextResponse.json({ error: 'tenderId required' }, { status: 400 })

    const admin = createAdminClient()

    const [{ data: tender }, { data: questions }, { data: responses }] = await Promise.all([
      admin.from('tenders').select('*').eq('id', tenderId).single(),
      admin.from('tender_questions').select('*').eq('tender_id', tenderId).order('order_index'),
      admin.from('tender_responses').select('*').eq('tender_id', tenderId),
    ])

    if (!tender) return NextResponse.json({ error: 'Tender not found' }, { status: 404 })

    const responseMap = new Map((responses ?? []).map(r => [r.question_id, r]))

    const sections = []

    // Title page content
    sections.push(
      new Paragraph({
        text: tender.title,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Commissioner: ${tender.commissioner ?? 'N/A'}`, break: 1 }),
          new TextRun({ text: `Submission Deadline: ${tender.deadline ? new Date(tender.deadline).toLocaleDateString('en-GB') : 'N/A'}`, break: 1 }),
          new TextRun({ text: `Contract Value: ${tender.contract_value ? `£${Number(tender.contract_value).toLocaleString()}` : 'N/A'}`, break: 1 }),
          new TextRun({ text: `Generated: ${new Date().toLocaleDateString('en-GB')}`, break: 1 }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      }),
    )

    // Questions and responses
    for (let i = 0; i < (questions ?? []).length; i++) {
      const q = questions![i]
      const r = responseMap.get(q.id)

      sections.push(
        new Paragraph({
          text: `${q.question_number ?? `Question ${i + 1}`}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: q.question_text, italics: true, color: '555555' }),
          ],
          spacing: { after: 100 },
        }),
      )

      if (q.word_limit || q.scoring_weight) {
        sections.push(
          new Paragraph({
            children: [
              q.word_limit ? new TextRun({ text: `Word limit: ${q.word_limit}  `, bold: true, size: 18 }) : new TextRun(''),
              q.scoring_weight ? new TextRun({ text: `Scoring weight: ${q.scoring_weight}%`, bold: true, size: 18 }) : new TextRun(''),
            ],
            spacing: { after: 200 },
          })
        )
      }

      if (r?.content) {
        // Split paragraphs
        const paragraphs = r.content.split('\n\n').filter(Boolean)
        for (const para of paragraphs) {
          sections.push(
            new Paragraph({
              children: [new TextRun(para)],
              spacing: { after: 120 },
            })
          )
        }
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `[Word count: ${r.word_count ?? 0}${q.word_limit ? ` / ${q.word_limit}` : ''}]`,
                color: '888888',
                size: 16,
              }),
            ],
            spacing: { after: 300 },
          })
        )
      } else {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: '[No response entered]', color: 'CC0000', italics: true })],
            spacing: { after: 300 },
          })
        )
      }
    }

    const doc = new Document({
      sections: [{ children: sections }],
    })

    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${tender.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.docx"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (err) {
    console.error('[Export]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Export failed' },
      { status: 500 }
    )
  }
}
