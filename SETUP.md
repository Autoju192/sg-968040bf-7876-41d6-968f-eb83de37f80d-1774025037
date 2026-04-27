# BidWriteIt — Setup Guide

## Prerequisites

- Node.js 18+
- A Supabase project
- An OpenAI API key

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API (keep secret) |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |

---

## 3. Set up the database

1. Open your Supabase project
2. Go to **SQL Editor**
3. Paste and run the full contents of `supabase/schema.sql`

This creates:
- All tables with correct relationships
- Row Level Security policies
- Vector search functions
- Auto-create profile/org on signup trigger
- pgvector indexes

---

## 4. Create the Storage bucket

In Supabase Dashboard → **Storage**:

1. Create a bucket called `tender-documents`
2. Set it to **Private** (not public)
3. Add this storage policy so authenticated users can upload to their org folder:

```sql
-- Allow authenticated users to upload to their org subfolder
create policy "Users can upload tender documents"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'tender-documents'
  and (storage.foldername(name))[1] = (
    select organisation_id::text from public.profiles where id = auth.uid()
  )
);

-- Allow authenticated users to read their org's documents
create policy "Users can read their org tender documents"
on storage.objects for select
to authenticated
using (
  bucket_id = 'tender-documents'
  and (storage.foldername(name))[1] = (
    select organisation_id::text from public.profiles where id = auth.uid()
  )
);
```

---

## 5. Install ShadCN UI components

Run these to add the required ShadCN components:

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label textarea badge dialog select tabs toast tooltip scroll-area separator progress
```

When prompted:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

---

## 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 7. First-time setup flow

1. Sign up at `/signup` — enter your name, organisation name, and email
2. A company profile is created automatically for your organisation
3. Go to **Company Profile** and fill in your organisation details (aim for 100%)
4. Add evidence items in **Evidence Bank**
5. Add reusable content in **Bid Library** (mark items as Approved)
6. Import past tenders in **Previous Bids** — upload PDFs/DOCXs of old submissions
7. Go to **Discover Tenders** to find live opportunities
8. Create a new tender in **My Tenders** and start writing

---

## Architecture notes

### AI context assembly (per response generation)

Every AI action assembles context in this priority order:
1. Tender question + word limit + scoring criteria
2. Company profile (relevant sections)
3. Own winning bid matches (vector similarity, pgvector)
4. Public winning bid matches (from Contracts Finder)
5. Evidence bank items (top 5 by similarity)
6. Bid library items (top 3 approved, by similarity)
7. Existing draft (when improving)

### Vector search

Embeddings are generated using `text-embedding-3-small` and stored in pgvector columns. Search uses cosine similarity via `<=>` operator. Embeddings are generated:
- When evidence items are created/updated
- When bid library items are created/updated
- When previous bid Q&A sections are imported
- When tender questions are parsed from documents

### Public bid intelligence

The `/api/discover` endpoint queries the Contracts Finder public API (no authentication required). Results are stored in `discovered_tenders` when saved. Public winning bid patterns are indexed from award notices.

---

## Key files reference

| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Complete database schema — run this first |
| `lib/openai.ts` | All AI functions (generate, improve, quality check, parse) |
| `lib/discover/contracts-finder.ts` | Contracts Finder API integration |
| `components/workspace/question-editor.tsx` | Core response editor |
| `components/workspace/ai-buttons.tsx` | AI action buttons |
| `components/workspace/quality-score.tsx` | Quality scoring with tooltips |
| `app/api/ai/generate/route.ts` | Main AI generation endpoint |
| `app/api/tender/parse/route.ts` | Tender document parsing |
| `app/api/tender/export/route.ts` | DOCX export |
| `PRD.md` | Full product requirements — reference throughout build |

---

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy — Next.js is detected automatically

The `serverComponentsExternalPackages` config in `next.config.ts` ensures `pdf-parse` and `mammoth` work correctly on Vercel's serverless functions.
