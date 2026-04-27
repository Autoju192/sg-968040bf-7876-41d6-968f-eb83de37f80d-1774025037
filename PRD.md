# BidWriteIt — Product Requirements Document

**Version:** 1.1  
**Date:** 2026-04-27  
**Status:** Active — reference this document throughout the build  

---

## 1. Problem Statement

> How might we help UK care providers win more tenders by turning their own institutional knowledge — past bids, evidence, company data — into submission-ready answers, faster and with higher scores?

UK domiciliary care providers, supported living organisations, and healthcare agencies regularly compete for public contracts through formal tender processes. The problem is threefold:

1. **Generic AI is useless.** Tools like ChatGPT produce plausible-sounding answers that commissioners immediately recognise as boilerplate. Submissions lacking specificity are scored down or disqualified.
2. **Institutional knowledge is locked in people's heads or scattered in files.** Winning patterns from past bids are never systematised.
3. **The process is slow and stressful.** A single tender can take 40–80 hours. Bid writers are often juggling multiple submissions simultaneously.

BidWriteIt solves all three by making a company's own data — profiles, evidence, past winning bids — the AI's primary source of truth.

---

## 2. Product Vision

**"Write stronger, compliant, evidence-backed tenders using your own company data and winning bid insights."**

The transformation this product enables:

```
Before: Blank page → hours of writing → generic answers → low scores → lost contract
After:  Upload tender → AI extracts questions → system finds winning patterns → 
        generate grounded answer → quality check → submit
```

---

## 3. Target Users

### Primary (Build for these users first)
| User | Pain | Gain |
|------|------|------|
| UK domiciliary care providers | Lose bids to larger orgs with dedicated bid teams | Compete on quality, not resources |
| Supported living providers | Tender answers are rewritten from scratch each time | Reuse and improve institutional knowledge |
| Healthcare staffing agencies | Generic AI answers get scored down | Evidence-backed, specific, auditable responses |

### Secondary (Post-MVP)
- SMEs bidding for public contracts outside care
- Bid consultants managing multiple clients (higher ACV, future expansion)

### The Buyer Persona
**Name:** Sarah, Bid Manager  
**Organisation:** 50–200 person domiciliary care provider  
**Reality:** She manages 10–20 tenders per year, often alone or with one colleague. She has a folder of old tenders, a SharePoint full of policies, and a head full of case studies nobody ever wrote down. She knows what good looks like — she just can't produce it fast enough.

---

## 4. Core Differentiator

| Generic AI Tools | BidWriteIt |
|-----------------|------------|
| Uses public training data | Uses **your** company profile |
| Produces generic answers | Produces evidence-backed, specific answers |
| No memory of past bids | Learns from your **winning bid patterns** |
| No compliance awareness | Flags missing evidence, word count, scoring gaps |
| One-size-fits-all | Tuned to care sector commissioning language |

---

## 5. Core Modules

Modules are listed in build priority order. MVP = Modules 1–8.

---

### MODULE 1 — Auth & Organisation
**Priority:** MVP (must have)

**Features:**
- Email/password signup and login via Supabase Auth
- Organisation creation on first login
- User profile (name, role, email)
- JWT-based session management with RLS

**Acceptance criteria:**
- User can sign up, log in, log out
- All data is scoped to the user's organisation
- Unauthenticated requests are rejected at the database level via RLS

---

### MODULE 2 — Company Profile
**Priority:** MVP (must have) — this is the AI's backbone

**Purpose:** Store reusable, structured company data that the AI injects into every generated response. Without this, the AI produces generic output. With it, every answer is grounded in the company's real identity.

**Sections:**
| Section | Examples |
|---------|----------|
| Company overview | Mission, values, founding year, size |
| Services offered | Domiciliary care, supported living, reablement |
| Locations | Regions, coverage areas |
| Compliance & registration | CQC rating, registration details |
| Policies summary | Key policies (safeguarding, medication, lone working) |
| Training model | Induction, mandatory training, CPD approach |
| Staffing model | Recruitment, vetting, supervision frequency |
| Safeguarding approach | Named leads, escalation pathways, MASH relationships |
| QA processes | Audits, spot checks, satisfaction surveys |
| KPIs | Outcomes data, compliance rates, retention stats |
| Case studies | Named (or anonymised) examples of positive outcomes |

**UI:** Structured form with rich text sections. Auto-save. Completion progress indicator.

**AI usage rule:** Every AI generation MUST pull relevant sections from the company profile. The system prompt must explicitly include this data. Responses generated without company profile data must be flagged.

---

### MODULE 3 — Evidence Bank
**Priority:** MVP (must have)

**Purpose:** A structured repository of proof points the AI can cite automatically. Distinct from the company profile (which is narrative) — the evidence bank is discrete, citeable items.

**Evidence types:**
- KPIs (metric, value, date, source)
- Case studies (situation, action, outcome, anonymised if needed)
- Testimonials (quote, source type, date)
- Audit results (audit type, score/outcome, date, body)
- Training statistics (completion rate, training type, period)
- Safeguarding examples (anonymised scenario, action taken, outcome)
- Accreditations and certifications

**AI usage:** When generating or improving an answer, the system searches the evidence bank for relevant items and injects the top matches. User can see which evidence was used and add/remove items.

---

### MODULE 4 — Bid Library
**Priority:** MVP (must have)

**Purpose:** Reusable structured content blocks for common tender topics. Not full answers — structured paragraphs and frameworks that get assembled and adapted per tender.

**Content categories:**
- Safeguarding & adult protection
- Medication management
- Recruitment & vetting
- Training & development
- Risk management
- Governance & quality assurance
- Business continuity
- Environmental sustainability
- Equality, diversity & inclusion

**Features:**
- Tags (by topic, tender type, commissioner type)
- Version history
- Approval status (Draft / Approved / Archived)
- Word count indicator

---

### MODULE 5 — Previous Bids
**Priority:** MVP (must have) — feeds the core differentiator

**Purpose:** Store past tender submissions so the winning bid analysis engine has data to work with. Users can import their own past bids at any time — but the system never blocks on this. From day one, the AI supplements any gaps with publicly available winning bid data (see Module 6).

**Data stored per bid:**
- Tender name and commissioner
- Submission date
- Outcome: Won / Lost / Pending / No feedback
- Score (overall and per section if known)
- Feedback received
- Individual questions and responses (structured)
- Value of contract (optional)
- Sector / contract type
- Source: `own` | `public` (to distinguish imported vs. AI-discovered bids)

**Import options:**
- Upload DOCX or PDF of past tender response
- AI extracts question/answer pairs automatically
- User reviews and confirms the extraction
- Manual entry as fallback
- AI-discovered public bids (auto-ingested by the Public Bid Intelligence feature — see Module 6)

---

### MODULE 6 — Winning Bid Analysis Engine + Public Bid Intelligence
**Priority:** MVP (must have) — **the core differentiator**

**Purpose:** When the AI generates or improves an answer to a tender question, it searches for similar questions and winning responses, extracts the patterns that made them work, and surfaces this as actionable insight. This draws from two sources: the organisation's own imported bids, and publicly available winning bid submissions the system discovers automatically.

---

#### 6a — Winning Bid Analysis (Own Bids)

**How it works:**
1. New tender question is embedded (OpenAI embeddings)
2. pgvector similarity search across all previous bid questions (own bids)
3. Results filtered to "Won" bids, ranked by similarity score
4. Top matching Q&A pairs retrieved
5. AI analyses the winning responses and extracts structural patterns
6. Insight surfaced in the UI alongside the draft answer

**Scoring signal:** Bids with higher scores weight more heavily in pattern matching. Bids with no outcome are used for pattern matching but not labelled as "winning."

---

#### 6b — Public Bid Intelligence (AI-Discovered)

**Purpose:** Automatically source, parse, and index publicly available tender submissions and award notices so that every user — including brand new users with zero imported bids — has access to a rich base of comparative winning bid data from day one.

**Why this is possible:** UK public sector procurement is subject to transparency requirements. Awarded contracts, winning bid summaries, and published evaluation reports are routinely made available through:
- **Contracts Finder** (contracts.service.gov.uk)
- **Find a Tender Service (FTS)** (find-tender.service.gov.uk)
- **ProContract** and other portal published awards
- **Local authority tender portals** with public award notices
- **CQC-regulated sector frameworks** (e.g., NHS frameworks, local authority care frameworks)

**How it works:**
1. On new tender upload, the AI identifies the tender type, sector, and commissioner
2. System queries indexed public bid database for matching contract type and sector
3. Where award notices include evaluation commentary, winning answer summaries, or score feedback — these are parsed and embedded
4. Publicly available full responses (where released under FOI or published proactively) are parsed, embedded, and stored as `source: public`
5. These feed into the same vector search and pattern analysis pipeline as own bids
6. Public bids are clearly labelled as `Public Source` in the UI — they are never presented as the user's own

**Background ingestion pipeline (ongoing):**
- Scheduled job scrapes and parses new award notices from Contracts Finder and FTS daily
- Sector filter: UK care, supported living, healthcare, domiciliary care
- Deduplication by contract reference number
- Embeddings generated and stored in pgvector
- Indexed by: sector, contract type, commissioner type, question topic

**Data stored per public bid:**
- Source URL and contract reference
- Commissioner name and type (local authority / NHS / CCG)
- Contract category and CPV codes
- Award date and contract value
- Extracted Q&A pairs (where available)
- Evaluation feedback (where published)
- Outcome: always "Won" (only awarded contracts are indexed)
- Confidence score (how complete the extracted data is)

**UI labelling — important for trust:**
```
Winning Pattern Detected
━━━━━━━━━━━━━━━━━━━━━━━━
Source: Public Record — Contracts Finder
Contract: Adult Domiciliary Care Framework — [Local Authority] ([Year])
Similarity: 82%  |  Status: Awarded

What made it work:
• Named safeguarding lead with direct contact pathway
• Included measurable outcome (95% satisfaction rate)
• Escalation pathway described in 3 clear steps
• Real scenario with anonymised service user example

Note: This is a publicly available winning bid summary, not your own data.
Suggested improvements for your answer:
• Add a specific KPI from your evidence bank
• Name your designated safeguarding lead
• Include your audit frequency
• Add an anonymised example
```

**Fallback chain (in priority order):**
1. Own winning bids (highest trust, most relevant)
2. Public winning bids (strong signal, always available)
3. Company profile + evidence bank + bid library (always present)

The UI always indicates which sources were used. There is no state where the AI has nothing to work with.

---

**Combined output — how sources are blended:**
When both own bids and public bids match, the AI synthesises patterns from both, weighted toward own bids. The insight panel shows the source mix clearly (e.g. "Based on 1 of your winning bids and 3 public award records").

---

### MODULE 7 — Tender Upload & Parsing
**Priority:** MVP (must have)

**Purpose:** Accept uploaded tender documents (PDF or DOCX) and extract structured data automatically.

**Extracted data:**
- Individual questions (numbered, with full text)
- Word / character limits per question
- Scoring criteria and weighting (where present)
- Required evidence or attachments
- Submission deadline
- Tender title and commissioner

**Parsing pipeline:**
1. User uploads file → Supabase Storage
2. pdf-parse (PDF) or mammoth (DOCX) extracts raw text
3. OpenAI structures the raw text into question objects
4. User reviews extracted questions in a confirmation screen
5. User corrects any misparses (drag to reorder, delete, edit, add manually)
6. Confirmed questions create the Tender Workspace

**Acceptance criteria:**
- Handles multi-section tender documents
- Extracts word limits accurately in >90% of cases on test set
- Graceful failure: if extraction confidence is low, flag for manual review

---

### MODULE 8 — Tender Workspace
**Priority:** MVP (must have)

**Purpose:** The central working environment for a single tender. Every tender has its own workspace where questions, responses, AI actions, and status live together.

**Workspace components:**
| Component | Description |
|-----------|-------------|
| Tender header | Name, commissioner, deadline, contract value |
| Progress bar | % of questions with a quality-passing response |
| Question list | Sidebar with all questions, status indicators |
| Response editor | Main editing area (MODULE 9) |
| Compliance summary | Overall tender-level flags |
| Export button | Triggers MODULE 12 |

**Question status indicators:**
- Empty (not started)
- Draft (text entered, not AI-reviewed)
- AI-generated (needs human review)
- Reviewed (human has edited)
- Complete (quality score passes threshold)

---

### MODULE 9 — AI Response Editor
**Priority:** MVP (must have)

**Purpose:** The primary editing surface for each tender question. Combines a rich text editor with AI actions, quality scoring, evidence suggestions, and winning bid insights.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Q3. Describe your approach to safeguarding adults...    │
│ Word limit: 500 words │ Scoring weight: 15%             │
├─────────────────────────────────────────────────────────┤
│ [Rich text editor — response goes here]                 │
│                                                         │
│ Word count: 312 / 500                                   │
├─────────────────────────────────────────────────────────┤
│ AI ACTIONS                                              │
│ [Generate Answer] [Improve] [Add Evidence] [Shorten]   │
│ [Use Winning Bid] [Check Compliance] [Add KPIs]        │
├─────────────────────────────────────────────────────────┤
│ QUALITY SCORE: 74/100                                   │
│ Missing: Named safeguarding lead · Specific KPI · Example│
├─────────────────────────────────────────────────────────┤
│ WINNING BID INSIGHT (collapsed by default)             │
│ ▶ Pattern detected from [Tender Name] (WON)            │
└─────────────────────────────────────────────────────────┘
```

**AI Action buttons:**
| Button | Behaviour |
|--------|-----------|
| Generate Answer | Full generation using company profile + evidence + winning patterns |
| Improve Answer | Enhance the existing draft without replacing it |
| Add Evidence | Search evidence bank, inject best-matching items |
| Use Company Profile | Pull specific company profile sections relevant to this question |
| Use Winning Bid | Explicitly trigger winning bid analysis and rewrite to match winning pattern |
| Add KPIs | Find and inject relevant KPIs from evidence bank |
| Shorten to Word Limit | Condense without losing key points |
| Expand Answer | Add depth, examples, specificity |
| Rewrite for Higher Score | Analyse scoring criteria, rewrite to maximise points |
| Check Compliance | Flag missing mandatory elements (based on question requirements) |

**Context passed to AI on every action:**
1. Tender question (full text)
2. Word limit and scoring weight
3. Existing draft (if any)
4. Company profile (full)
5. Top 5 evidence items (by relevance)
6. Top 3 bid library items (by relevance)
7. Top 3 winning bid Q&A pairs (by vector similarity)
8. Quality check results

---

### MODULE 10 — Quality Check Engine
**Priority:** MVP (must have)

**Purpose:** Score every response across multiple dimensions and produce actionable improvement suggestions. This makes the product defensible — users can see exactly why their score is what it is, what it means, and precisely what to fix.

**Scoring dimensions:**

| Dimension | What it checks | Max points |
|-----------|---------------|------------|
| Relevance | Does the answer actually address the question? | 20 |
| Compliance | Are all required elements present? | 20 |
| Evidence | Are specific metrics, examples, or data cited? | 20 |
| Specificity | Is it concrete (named people, processes, numbers) vs vague? | 15 |
| Word count | Within the stated limit? | 10 |
| Clarity | Readable, structured, commissioner-friendly language? | 10 |
| Differentiation | Does it say something distinctive, not boilerplate? | 5 |
| **Total** | | **100** |

**Score banding (displayed as a colour-coded badge):**
| Score | Band | Colour | Meaning |
|-------|------|--------|---------|
| 90–100 | Excellent | Green | Submission-ready. Strong across all dimensions. |
| 75–89 | Good | Blue | Solid answer. Minor improvements possible. |
| 60–74 | Needs Work | Amber | Missing evidence or specificity. Fix before submitting. |
| Below 60 | At Risk | Red | Likely to score poorly. Do not submit without major revision. |

---

**Tooltips — per scoring dimension:**

Each dimension in the UI renders as a labelled score bar with a `ⓘ` tooltip icon. Hovering or tapping the icon shows:

| Dimension | Tooltip: What it means | Tooltip: What good looks like | Tooltip: How to improve |
|-----------|----------------------|------------------------------|------------------------|
| **Relevance** | Does your answer directly address what the question is asking? Commissioners score down answers that drift off-topic, even if well-written. | The answer opens by restating the question's core theme and all paragraphs connect back to it. | Use the "Rewrite for Higher Score" button — it refocuses the answer around the question. Remove any paragraphs that don't directly address it. |
| **Compliance** | Have you included everything the question requires? Many questions specify mandatory elements (e.g. "include your escalation pathway" or "name the lead responsible"). Missing one can mean zero marks for that element. | Every explicit requirement in the question is addressed by name, not implied. | Check the question text for keywords like "describe", "name", "provide an example", "explain how". Each is a required element. Use "Check Compliance" to identify gaps. |
| **Evidence** | Have you backed up your claims with real, specific data? Commissioners distrust vague statements. Evidence means: named KPIs, audit results, dates, percentages, case study outcomes. | At least one measurable statistic and one real-world example are present and specific (not "we regularly monitor" but "our 2024 audit showed 97% compliance"). | Use "Add Evidence" to pull matching items from your evidence bank. If your evidence bank is thin, go to Evidence Bank and add your latest audit results or KPIs. |
| **Specificity** | Is your answer concrete — naming real people, real processes, real timescales — or does it stay at a high, vague level? Specificity signals operational credibility to commissioners. | Named roles (not just "a manager"), specific timeframes ("within 24 hours"), and described processes ("three-stage review: senior carer → registered manager → DSL"). | Replace generic phrases with specifics. Use "Make More Specific" to prompt the AI to add concrete detail. Pull named roles and processes from your company profile. |
| **Word count** | Is your answer within the word limit set by the commissioner? Going over wastes words on content that won't be read (or may be cut). Going significantly under signals a weak answer. | Within 95% of the limit — using the space you've been given signals you have enough to say. | Use "Shorten to Word Limit" if over. Use "Expand Answer" if significantly under (below 70% of the limit). |
| **Clarity** | Is your answer easy for a commissioner to read and score? Dense paragraphs, jargon, or poor structure make scoring harder — and commissioners score faster when the answer is clear. | Short paragraphs, plain English, clear structure (often with a brief intro, body, and closing statement). Headers or bullet points where appropriate. | Use "Improve Answer" for a general clarity pass. Break long paragraphs into shorter ones. Avoid care-sector acronyms without spelling them out on first use. |
| **Differentiation** | Does your answer say something only your organisation could say, or does it read like it could have come from any provider? Commissioners review dozens of submissions. Generic answers blend into the background. | At least one element — a named case study, a unique process, a specific outcome — that couldn't be copy-pasted from another provider's bid. | Use "Use Winning Bid" to see what made past answers distinctive. Pull a real case study from your evidence bank. Name a specific outcome or service user scenario (anonymised). |

---

**Output format (in-editor quality panel):**
```
Score: 74/100  [Needs Work — Amber]

✅ Relevance      18/20   ⓘ
✅ Compliance     18/20   ⓘ
⚠️  Evidence       12/20   ⓘ  ← tap for tooltip + fix
⚠️  Specificity    10/15   ⓘ  ← tap for tooltip + fix
✅ Word count      9/10   ⓘ
✅ Clarity         8/10   ⓘ
❌ Differentiation  2/5    ⓘ  ← tap for tooltip + fix

What to fix (priority order):
→ Evidence: Add a measurable outcome — e.g. "In 2024, our safeguarding 
  response rate was X within Y hours" [Add Evidence →]
→ Specificity: Name your safeguarding lead — "[Name], DSL, reachable 
  via [route]" [Use Company Profile →]
→ Differentiation: Add one anonymised service user scenario from your 
  evidence bank [Add Evidence →]
```

Each "fix" line includes a direct action button that triggers the relevant AI action on that specific gap — the user does not need to manually identify what to do.

**Threshold:** Responses scoring below 60 are flagged as "At Risk" and block export with a red warning (override available with confirmation prompt). Responses between 60–74 show an amber advisory on export but do not block.

---

### MODULE 11 — In-App Chatbot
**Priority:** Post-MVP (Phase 2)

**Purpose:** A contextual assistant that operates in four modes depending on where the user is in the app.

**Modes:**
| Mode | Trigger | Behaviour |
|------|---------|-----------|
| App Help | "How do I..." | Answers questions about using BidWriteIt |
| Tender Assistant | Active tender open | Analyses the tender, highlights key scoring areas, suggests strategy |
| Bid Writing | Response editor open | Helps improve the specific answer in focus |
| Winning Insight | "What made our last bid work?" | Synthesises patterns across past winning bids |

**Hard rules:**
- Must ground every response in real data (company profile, evidence bank, past bids)
- Must NOT speculate or hallucinate evidence
- Must highlight when data is missing and guide user to fill it in
- Clear source attribution: "Based on your evidence bank entry from March 2024..."

---

### MODULE 12 — Export
**Priority:** MVP (must have)

**Formats:**
- DOCX (primary) — formatted for direct insertion into tender portals
- PDF (secondary)

**Export structure:**
- Cover page (tender title, organisation name, submission date)
- Each question with its full response
- Word count per response
- Appendix: quality check summary
- Appendix: evidence items referenced

**DOCX generation:** Use `docx` npm package (not mammoth — that's for import). Style headings, apply corporate font if company profile includes branding.

---

## 6. AI Architecture

### Context Priority Order
Every AI call assembles context in this priority order (higher = more weight):

```
1. Tender question (full text)
2. Word limit + scoring criteria  
3. Company profile (relevant sections)
4. Own winning bid matches (vector similarity, Won bids only) — highest trust
5. Public winning bid matches (vector similarity, Contracts Finder / FTS) — strong signal
6. Evidence bank (top 5 by relevance)
7. Bid library (top 3 by relevance)
8. Existing draft response (if improving)
```

### Embeddings Strategy
- **What gets embedded:** Every tender question, every previous bid Q&A pair, every evidence item, every bid library item
- **When:** On creation/update (async, queued)
- **Model:** `text-embedding-3-small` (cost-efficient, sufficient for this use case)
- **Storage:** pgvector extension on Supabase Postgres
- **Search:** Cosine similarity, top-k retrieval per query

### System Prompt Structure
```
You are an expert bid writer specialising in UK public sector care contracts.
You write in the voice of {organisation_name}.

COMPANY IDENTITY:
{company_profile}

EVIDENCE TO USE:
{evidence_items}

WINNING BID PATTERNS:
{winning_bid_matches}

BID LIBRARY CONTENT:
{bid_library_items}

QUESTION:
{question_text}
WORD LIMIT: {word_limit}
SCORING CRITERIA: {scoring_criteria}

RULES:
- Use specific data from the company profile. Never invent data.
- If you reference a KPI, it must come from the evidence bank.
- Name specific processes, roles, and pathways where relevant.
- Write for a commissioner, not a general audience.
- Do not use generic phrases like "we are committed to" without evidence.
- Stay within the word limit.
```

### Model Selection
- Generation tasks: `gpt-4o` (quality > cost for primary output)
- Quality checking: `gpt-4o-mini` (fast, cost-efficient for scoring)
- Embeddings: `text-embedding-3-small`

---

## 7. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js 14 (App Router) | File-based routing, RSC, excellent DX |
| Language | TypeScript | Type safety, essential for a complex data model |
| Styling | Tailwind CSS | Rapid, consistent styling |
| Components | ShadCN/UI | Accessible, unstyled-first, composable |
| Backend | Supabase | Auth + Postgres + Storage + RLS + pgvector in one |
| AI | OpenAI API | GPT-4o for generation, embeddings for search |
| PDF parse | pdf-parse | Extract text from uploaded tender PDFs |
| DOCX import | mammoth | Convert uploaded DOCX to text for parsing |
| DOCX export | docx (npm) | Generate formatted export documents |
| Hosting | Vercel | Zero-config Next.js deployment |

---

## 8. Database Schema

```sql
-- Core auth (managed by Supabase Auth)
-- auth.users

-- User profiles
profiles (
  id uuid references auth.users primary key,
  organisation_id uuid references organisations,
  full_name text,
  role text,
  created_at timestamptz
)

-- Organisations
organisations (
  id uuid primary key,
  name text,
  slug text unique,
  created_at timestamptz
)

-- Company profile (one per organisation)
company_profiles (
  id uuid primary key,
  organisation_id uuid references organisations unique,
  overview text,
  services_offered text,
  locations text,
  compliance_details text,
  policies_summary text,
  training_model text,
  staffing_model text,
  safeguarding_approach text,
  qa_processes text,
  kpis text,
  case_studies text,
  updated_at timestamptz
)

-- Evidence bank items
evidence_items (
  id uuid primary key,
  organisation_id uuid references organisations,
  type text, -- 'kpi' | 'case_study' | 'testimonial' | 'audit' | 'training_stat' | 'safeguarding' | 'accreditation'
  title text,
  content text,
  metric_value text,
  metric_date date,
  source text,
  embedding vector(1536),
  created_at timestamptz
)

-- Bid library items
bid_library_items (
  id uuid primary key,
  organisation_id uuid references organisations,
  title text,
  category text,
  content text,
  tags text[],
  version integer default 1,
  status text default 'draft', -- 'draft' | 'approved' | 'archived'
  word_count integer,
  embedding vector(1536),
  created_at timestamptz,
  updated_at timestamptz
)

-- Previous bids
previous_bids (
  id uuid primary key,
  organisation_id uuid references organisations,
  tender_name text,
  commissioner text,
  submission_date date,
  outcome text, -- 'won' | 'lost' | 'pending' | 'no_feedback'
  overall_score numeric,
  feedback text,
  contract_value numeric,
  sector text,
  created_at timestamptz
)

-- Previous bid sections (Q&A pairs)
previous_bid_sections (
  id uuid primary key,
  previous_bid_id uuid references previous_bids,
  question_text text,
  response_text text,
  section_score numeric,
  question_embedding vector(1536),
  response_embedding vector(1536),
  created_at timestamptz
)

-- Active tenders
tenders (
  id uuid primary key,
  organisation_id uuid references organisations,
  title text,
  commissioner text,
  deadline timestamptz,
  contract_value numeric,
  status text default 'active', -- 'active' | 'submitted' | 'won' | 'lost'
  created_at timestamptz
)

-- Uploaded tender documents
tender_documents (
  id uuid primary key,
  tender_id uuid references tenders,
  file_name text,
  file_url text,
  file_type text, -- 'pdf' | 'docx'
  parse_status text default 'pending', -- 'pending' | 'processing' | 'complete' | 'failed'
  raw_text text,
  created_at timestamptz
)

-- Extracted tender questions
tender_questions (
  id uuid primary key,
  tender_id uuid references tenders,
  document_id uuid references tender_documents,
  question_number text,
  question_text text,
  word_limit integer,
  scoring_weight numeric,
  scoring_criteria text,
  required_evidence text,
  order_index integer,
  status text default 'empty', -- 'empty' | 'draft' | 'ai_generated' | 'reviewed' | 'complete'
  question_embedding vector(1536),
  created_at timestamptz
)

-- Responses to tender questions
tender_responses (
  id uuid primary key,
  question_id uuid references tender_questions unique,
  tender_id uuid references tenders,
  content text,
  word_count integer,
  quality_score numeric,
  quality_breakdown jsonb,
  quality_flags jsonb,
  ai_context_used jsonb, -- which company profile sections, evidence, winning bids were used
  version integer default 1,
  updated_at timestamptz
)

-- AI chat sessions
ai_chat_sessions (
  id uuid primary key,
  organisation_id uuid references organisations,
  tender_id uuid references tenders,
  mode text, -- 'app_help' | 'tender_assistant' | 'bid_writing' | 'winning_insight'
  created_at timestamptz
)

-- AI chat messages
ai_chat_messages (
  id uuid primary key,
  session_id uuid references ai_chat_sessions,
  role text, -- 'user' | 'assistant'
  content text,
  created_at timestamptz
)

-- Quality check results (per response)
ai_quality_checks (
  id uuid primary key,
  response_id uuid references tender_responses,
  total_score numeric,
  relevance_score numeric,
  compliance_score numeric,
  evidence_score numeric,
  specificity_score numeric,
  word_count_score numeric,
  clarity_score numeric,
  differentiation_score numeric,
  flags jsonb,
  suggestions jsonb,
  created_at timestamptz
)
```

---

## 9. System Architecture

```
Browser (Next.js)
    │
    ├── App Router Pages
    ├── Server Components (data fetching)
    └── Client Components (editor, AI interactions)
         │
         ├── /api/ai/generate          → OpenAI GPT-4o
         ├── /api/ai/quality-check     → OpenAI GPT-4o-mini
         ├── /api/tender/parse         → pdf-parse / mammoth → OpenAI
         ├── /api/embeddings/create    → OpenAI text-embedding-3-small
         └── /api/export/docx          → docx npm package
              │
              └── Supabase
                   ├── Auth (JWT, RLS)
                   ├── Postgres + pgvector
                   └── Storage (uploaded files)
```

---

## 10. MVP Build Order

Build in this exact sequence. Each phase is deployable and testable:

### Phase 1 — Foundation
1. Project setup: Next.js + TypeScript + Tailwind + ShadCN
2. Supabase project: schema, RLS policies, pgvector extension
3. Auth: signup, login, logout, session management
4. Organisation creation on first login
5. Basic layout: sidebar nav, header, auth guard

### Phase 2 — Company Data
6. Company profile form (all sections, auto-save)
7. Evidence bank CRUD (create, list, edit, delete)
8. Bid library CRUD with tags and status

### Phase 3 — Past Bids & Public Bid Intelligence
9. Previous bid creation (manual entry)
10. Previous bid DOCX/PDF import + AI extraction of Q&A pairs
11. Public Bid Intelligence: Contracts Finder + FTS ingestion pipeline, embedding, and storage
12. Background scheduler for daily public bid sync (sector-filtered)

### Phase 4 — Live Tender
13. Tender creation + document upload
14. Tender parsing pipeline (pdf-parse / mammoth → OpenAI extraction)
15. Question review and confirmation screen
16. Tender workspace layout

### Phase 5 — AI Response Engine (Core)
17. Response editor (rich text, word count)
18. `Generate Answer` AI action (company profile + evidence + bid library)
19. `Use Winning Bid` — vector search across own + public bids, pattern analysis
20. `Improve Answer`, `Add Evidence`, `Add KPIs` actions
21. Remaining AI action buttons

### Phase 6 — Quality & Export
22. Quality check engine (scoring + flags + suggestions + tooltips)
23. Tooltip content per dimension (what it means, what good looks like, how to fix)
24. Inline fix action buttons on each quality flag
25. Question status indicators and progress tracking
26. DOCX export
27. PDF export

### Phase 7 — Polish & Payment
28. Onboarding improvements
29. Stripe integration (basic subscription — required for first paying customer)
30. Settings page (organisation profile, billing)

---

## 11. Not Building (MVP) — And Why

| Feature | Reason not in MVP |
|---------|-------------------|
| In-app chatbot | High complexity, low first-sale value — add in Phase 2 |
| Multi-user / roles | Adds auth complexity; most early customers are solo bid writers |
| Analytics dashboard | No data to show yet; adds scope without proving value |
| Tender discovery / search | Separate product surface; doesn't help win more once found |
| Multi-tenancy for consultants | Higher ACV but longer sales cycle; validate with SMBs first |
| Custom AI model fine-tuning | Premature; embeddings + RAG is sufficient for MVP |
| Template marketplace | Sharing bid library across orgs adds trust/moderation complexity |
| Automated submission | Portal APIs are inconsistent; legal risk; out of scope |

---

## 12. Key Assumptions to Validate

| # | Assumption | How to test |
|---|-----------|-------------|
| 1 | AI-generated answers grounded in company data score measurably higher than generic answers | A/B test on a real tender; compare quality scores |
| 2 | The winning bid analysis insight (own + public bids) is compelling enough to drive purchase | User interview: show the feature, ask if it would change their decision to buy |
| 3 | Contracts Finder and FTS contain enough usable structured data to power the public bid intelligence feature | Parse 50 award notices manually; measure how many yield usable Q&A patterns |
| 4 | Tender PDF/DOCX parsing is reliable enough for production use | Test against 20+ real UK care tender documents |
| 5 | Care providers are willing to pay a monthly subscription | Pre-sell before full build; offer a beta discount |
| 6 | Users can self-serve the company profile setup without hand-holding | Measure time to completion and drop-off points in onboarding |

---

## 13. Success Metrics

### MVP Success (3 months post-launch)
- **Primary:** First paying customer on a live subscription
- **Secondary:** At least one tender submitted using BidWriteIt
- **Quality signal:** Average quality score of AI-generated answers > 70/100

### 6-Month Targets
- 10 paying organisations
- Average response quality score ≥ 75/100
- At least 3 testimonials citing time saved or improved scores
- Tender parse success rate ≥ 90% on real documents

---

## 14. Open Questions (Resolve Before Building)

1. **Pricing:** Per-seat monthly? Per-tender? What is the right price point for a UK care SME? (Hypothesis: £99–£299/month)
2. **Onboarding:** How much company profile data is the minimum to make AI useful? What's the minimum viable profile?
3. **GDPR:** Past tender responses may contain personal data (service user examples). What anonymisation is required before storing?
4. **Procurement portals:** Do target users receive tenders as file downloads, or must they manually copy/paste from portals like Procontract or Jaggaer?
5. **Scoring criteria format:** How consistently do UK care tenders include explicit scoring criteria in the document vs. only at briefing stage?

---

*This document is the source of truth for the BidWriteIt build. Update it as decisions are made. Do not start building a module until it is defined here.*
