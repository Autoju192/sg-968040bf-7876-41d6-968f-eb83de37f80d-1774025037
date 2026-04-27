-- BidWriteIt Database Schema
-- Run this in your Supabase SQL editor

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- ============================================================
-- ORGANISATIONS
-- ============================================================
create table organisations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text unique not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table profiles (
  id              uuid primary key references auth.users on delete cascade,
  organisation_id uuid references organisations on delete set null,
  full_name       text,
  role            text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- COMPANY PROFILE (one per organisation)
-- ============================================================
create table company_profiles (
  id                    uuid primary key default uuid_generate_v4(),
  organisation_id       uuid not null unique references organisations on delete cascade,
  overview              text,
  services_offered      text,
  locations             text,
  compliance_details    text,
  policies_summary      text,
  training_model        text,
  staffing_model        text,
  safeguarding_approach text,
  qa_processes          text,
  kpis                  text,
  case_studies          text,
  completion_pct        integer not null default 0,
  updated_at            timestamptz not null default now()
);

-- ============================================================
-- EVIDENCE BANK
-- ============================================================
create table evidence_items (
  id              uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations on delete cascade,
  type            text not null check (type in (
                    'kpi','case_study','testimonial','audit',
                    'training_stat','safeguarding','accreditation'
                  )),
  title           text not null,
  content         text not null,
  metric_value    text,
  metric_date     date,
  source          text,
  tags            text[] default '{}',
  embedding       vector(1536),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- BID LIBRARY
-- ============================================================
create table bid_library_items (
  id              uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations on delete cascade,
  title           text not null,
  category        text not null,
  content         text not null,
  tags            text[] default '{}',
  version         integer not null default 1,
  status          text not null default 'draft' check (status in ('draft','approved','archived')),
  word_count      integer,
  embedding       vector(1536),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- PREVIOUS BIDS
-- ============================================================
create table previous_bids (
  id              uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations on delete cascade,
  tender_name     text not null,
  commissioner    text,
  submission_date date,
  outcome         text check (outcome in ('won','lost','pending','no_feedback')),
  overall_score   numeric,
  feedback        text,
  contract_value  numeric,
  sector          text,
  source          text not null default 'own' check (source in ('own','public')),
  created_at      timestamptz not null default now()
);

create table previous_bid_sections (
  id                 uuid primary key default uuid_generate_v4(),
  previous_bid_id    uuid not null references previous_bids on delete cascade,
  question_text      text not null,
  response_text      text not null,
  section_score      numeric,
  question_embedding vector(1536),
  response_embedding vector(1536),
  created_at         timestamptz not null default now()
);

-- ============================================================
-- DISCOVERED TENDERS (web scraping / Contracts Finder)
-- ============================================================
create table discovered_tenders (
  id               uuid primary key default uuid_generate_v4(),
  organisation_id  uuid not null references organisations on delete cascade,
  external_id      text,
  source           text not null, -- 'contracts_finder' | 'find_a_tender' | 'manual'
  title            text not null,
  commissioner     text,
  sector           text,
  contract_value   numeric,
  deadline         timestamptz,
  published_at     timestamptz,
  description      text,
  url              text,
  cpv_codes        text[],
  status           text not null default 'new' check (status in ('new','saved','ignored','applied')),
  raw_data         jsonb,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- TENDERS (active workspaces)
-- ============================================================
create table tenders (
  id              uuid primary key default uuid_generate_v4(),
  organisation_id uuid not null references organisations on delete cascade,
  title           text not null,
  commissioner    text,
  deadline        timestamptz,
  contract_value  numeric,
  sector          text,
  status          text not null default 'active' check (status in ('active','submitted','won','lost')),
  discovered_id   uuid references discovered_tenders,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table tender_documents (
  id           uuid primary key default uuid_generate_v4(),
  tender_id    uuid not null references tenders on delete cascade,
  file_name    text not null,
  file_url     text not null,
  file_type    text not null check (file_type in ('pdf','docx')),
  parse_status text not null default 'pending' check (parse_status in ('pending','processing','complete','failed')),
  raw_text     text,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- TENDER QUESTIONS
-- ============================================================
create table tender_questions (
  id                uuid primary key default uuid_generate_v4(),
  tender_id         uuid not null references tenders on delete cascade,
  document_id       uuid references tender_documents,
  question_number   text,
  question_text     text not null,
  word_limit        integer,
  scoring_weight    numeric,
  scoring_criteria  text,
  required_evidence text,
  order_index       integer not null default 0,
  status            text not null default 'empty' check (status in ('empty','draft','ai_generated','reviewed','complete')),
  question_embedding vector(1536),
  created_at        timestamptz not null default now()
);

-- ============================================================
-- TENDER RESPONSES
-- ============================================================
create table tender_responses (
  id                 uuid primary key default uuid_generate_v4(),
  question_id        uuid not null unique references tender_questions on delete cascade,
  tender_id          uuid not null references tenders on delete cascade,
  content            text not null default '',
  word_count         integer not null default 0,
  quality_score      numeric,
  quality_breakdown  jsonb,
  quality_flags      jsonb,
  ai_context_used    jsonb,
  version            integer not null default 1,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ============================================================
-- QUALITY CHECKS
-- ============================================================
create table ai_quality_checks (
  id                    uuid primary key default uuid_generate_v4(),
  response_id           uuid not null references tender_responses on delete cascade,
  total_score           numeric not null,
  relevance_score       numeric,
  compliance_score      numeric,
  evidence_score        numeric,
  specificity_score     numeric,
  word_count_score      numeric,
  clarity_score         numeric,
  differentiation_score numeric,
  flags                 jsonb,
  suggestions           jsonb,
  created_at            timestamptz not null default now()
);

-- ============================================================
-- VECTOR SEARCH FUNCTIONS
-- ============================================================

-- Search evidence items by similarity
create or replace function search_evidence(
  query_embedding vector(1536),
  org_id          uuid,
  match_count     int default 5
)
returns table (
  id      uuid,
  title   text,
  content text,
  type    text,
  tags    text[],
  similarity float
)
language sql stable
as $$
  select
    id, title, content, type, tags,
    1 - (embedding <=> query_embedding) as similarity
  from evidence_items
  where organisation_id = org_id
    and embedding is not null
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- Search bid library items by similarity
create or replace function search_bid_library(
  query_embedding vector(1536),
  org_id          uuid,
  match_count     int default 3
)
returns table (
  id         uuid,
  title      text,
  content    text,
  category   text,
  similarity float
)
language sql stable
as $$
  select
    id, title, content, category,
    1 - (question_embedding <=> query_embedding) as similarity
  from bid_library_items
  where organisation_id = org_id
    and embedding is not null
    and status = 'approved'
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- Search previous winning bid sections by question similarity
create or replace function search_winning_bids(
  query_embedding vector(1536),
  org_id          uuid,
  match_count     int default 3
)
returns table (
  id              uuid,
  question_text   text,
  response_text   text,
  tender_name     text,
  outcome         text,
  overall_score   numeric,
  source          text,
  similarity      float
)
language sql stable
as $$
  select
    pbs.id,
    pbs.question_text,
    pbs.response_text,
    pb.tender_name,
    pb.outcome,
    pb.overall_score,
    pb.source,
    1 - (pbs.question_embedding <=> query_embedding) as similarity
  from previous_bid_sections pbs
  join previous_bids pb on pb.id = pbs.previous_bid_id
  where pb.organisation_id = org_id
    and pb.outcome = 'won'
    and pbs.question_embedding is not null
  order by pbs.question_embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table organisations        enable row level security;
alter table profiles             enable row level security;
alter table company_profiles     enable row level security;
alter table evidence_items       enable row level security;
alter table bid_library_items    enable row level security;
alter table previous_bids        enable row level security;
alter table previous_bid_sections enable row level security;
alter table discovered_tenders   enable row level security;
alter table tenders              enable row level security;
alter table tender_documents     enable row level security;
alter table tender_questions     enable row level security;
alter table tender_responses     enable row level security;
alter table ai_quality_checks    enable row level security;

-- Helper: get current user's org id
create or replace function auth_org_id()
returns uuid
language sql stable
as $$
  select organisation_id from profiles where id = auth.uid();
$$;

-- Organisations: member can read their own
create policy "org_member_select" on organisations
  for select using (id = auth_org_id());

-- Profiles: own row
create policy "profiles_own" on profiles
  for all using (id = auth.uid());

-- Company profiles
create policy "company_profile_org" on company_profiles
  for all using (organisation_id = auth_org_id());

-- Evidence items
create policy "evidence_org" on evidence_items
  for all using (organisation_id = auth_org_id());

-- Bid library
create policy "bid_library_org" on bid_library_items
  for all using (organisation_id = auth_org_id());

-- Previous bids
create policy "prev_bids_org" on previous_bids
  for all using (organisation_id = auth_org_id());

-- Previous bid sections (via parent bid)
create policy "prev_bid_sections_org" on previous_bid_sections
  for all using (
    exists (
      select 1 from previous_bids pb
      where pb.id = previous_bid_id
        and pb.organisation_id = auth_org_id()
    )
  );

-- Discovered tenders
create policy "discovered_org" on discovered_tenders
  for all using (organisation_id = auth_org_id());

-- Tenders
create policy "tenders_org" on tenders
  for all using (organisation_id = auth_org_id());

-- Tender documents
create policy "tender_docs_org" on tender_documents
  for all using (
    exists (
      select 1 from tenders t
      where t.id = tender_id
        and t.organisation_id = auth_org_id()
    )
  );

-- Tender questions
create policy "tender_questions_org" on tender_questions
  for all using (
    exists (
      select 1 from tenders t
      where t.id = tender_id
        and t.organisation_id = auth_org_id()
    )
  );

-- Tender responses
create policy "tender_responses_org" on tender_responses
  for all using (
    exists (
      select 1 from tenders t
      where t.id = tender_id
        and t.organisation_id = auth_org_id()
    )
  );

-- Quality checks (via response → tender)
create policy "quality_checks_org" on ai_quality_checks
  for all using (
    exists (
      select 1 from tender_responses tr
      join tenders t on t.id = tr.tender_id
      where tr.id = response_id
        and t.organisation_id = auth_org_id()
    )
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile and org on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  new_org_id uuid;
  org_slug   text;
begin
  org_slug := lower(regexp_replace(
    coalesce(new.raw_user_meta_data->>'organisation_name', split_part(new.email, '@', 1)),
    '[^a-z0-9]', '-', 'g'
  )) || '-' || substr(gen_random_uuid()::text, 1, 6);

  insert into organisations (name, slug)
  values (
    coalesce(new.raw_user_meta_data->>'organisation_name', 'My Organisation'),
    org_slug
  )
  returning id into new_org_id;

  insert into profiles (id, organisation_id, full_name)
  values (
    new.id,
    new_org_id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );

  insert into company_profiles (organisation_id)
  values (new_org_id);

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Update word count on response change
create or replace function update_response_word_count()
returns trigger language plpgsql
as $$
begin
  new.word_count := array_length(
    string_to_array(trim(new.content), ' '), 1
  );
  new.updated_at := now();
  return new;
end;
$$;

create trigger response_word_count
  before insert or update on tender_responses
  for each row execute procedure update_response_word_count();

-- Update company profile completion %
create or replace function update_profile_completion()
returns trigger language plpgsql
as $$
declare
  filled int := 0;
  total  int := 11;
begin
  if new.overview is not null and length(trim(new.overview)) > 0 then filled := filled + 1; end if;
  if new.services_offered is not null and length(trim(new.services_offered)) > 0 then filled := filled + 1; end if;
  if new.locations is not null and length(trim(new.locations)) > 0 then filled := filled + 1; end if;
  if new.compliance_details is not null and length(trim(new.compliance_details)) > 0 then filled := filled + 1; end if;
  if new.policies_summary is not null and length(trim(new.policies_summary)) > 0 then filled := filled + 1; end if;
  if new.training_model is not null and length(trim(new.training_model)) > 0 then filled := filled + 1; end if;
  if new.staffing_model is not null and length(trim(new.staffing_model)) > 0 then filled := filled + 1; end if;
  if new.safeguarding_approach is not null and length(trim(new.safeguarding_approach)) > 0 then filled := filled + 1; end if;
  if new.qa_processes is not null and length(trim(new.qa_processes)) > 0 then filled := filled + 1; end if;
  if new.kpis is not null and length(trim(new.kpis)) > 0 then filled := filled + 1; end if;
  if new.case_studies is not null and length(trim(new.case_studies)) > 0 then filled := filled + 1; end if;
  new.completion_pct := round((filled::numeric / total) * 100);
  new.updated_at := now();
  return new;
end;
$$;

create trigger company_profile_completion
  before insert or update on company_profiles
  for each row execute procedure update_profile_completion();

-- ============================================================
-- INDEXES
-- ============================================================
create index on evidence_items using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index on bid_library_items using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index on previous_bid_sections using ivfflat (question_embedding vector_cosine_ops) with (lists = 100);
create index on tender_questions using ivfflat (question_embedding vector_cosine_ops) with (lists = 100);
create index on tenders (organisation_id, status);
create index on tender_questions (tender_id, order_index);
create index on discovered_tenders (organisation_id, status, deadline);
