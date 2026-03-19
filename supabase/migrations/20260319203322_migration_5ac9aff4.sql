-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create all tables first (without RLS policies)

-- 1. Organisations table
CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- 2. Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'bid_manager', 'contributor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

-- 3. Tenders table
CREATE TABLE tenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  authority TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  value TEXT,
  service_type TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'review', 'bid', 'no_bid', 'submitted', 'awarded', 'lost')),
  ai_score DECIMAL(5,2) DEFAULT 0,
  decision TEXT CHECK (decision IN ('bid', 'no_bid', 'review')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tender files table
CREATE TABLE tender_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  extracted_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tender scores table
CREATE TABLE tender_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  service_fit DECIMAL(5,2) NOT NULL,
  geography_fit DECIMAL(5,2) NOT NULL,
  compliance_fit DECIMAL(5,2) NOT NULL,
  evidence_fit DECIMAL(5,2) NOT NULL,
  total_score DECIMAL(5,2) NOT NULL,
  reasoning TEXT,
  risks TEXT[],
  missing_evidence TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Evidence library table
CREATE TABLE evidence_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'review', 'completed')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_organisation_id ON users(organisation_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tenders_organisation_id ON tenders(organisation_id);
CREATE INDEX idx_tenders_status ON tenders(status);
CREATE INDEX idx_tenders_deadline ON tenders(deadline);
CREATE INDEX idx_tender_files_tender_id ON tender_files(tender_id);
CREATE INDEX idx_tender_scores_tender_id ON tender_scores(tender_id);
CREATE INDEX idx_evidence_library_organisation_id ON evidence_library(organisation_id);
CREATE INDEX idx_documents_tender_id ON documents(tender_id);
CREATE INDEX idx_tasks_tender_id ON tasks(tender_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_messages_tender_id ON messages(tender_id);