export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Organisation {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Profile {
  id: string
  organisation_id: string | null
  full_name: string | null
  role: string | null
  created_at: string
  updated_at: string
}

export interface CompanyProfile {
  id: string
  organisation_id: string
  overview: string | null
  services_offered: string | null
  locations: string | null
  compliance_details: string | null
  policies_summary: string | null
  training_model: string | null
  staffing_model: string | null
  safeguarding_approach: string | null
  qa_processes: string | null
  kpis: string | null
  case_studies: string | null
  completion_pct: number
  updated_at: string
}

export type EvidenceType =
  | 'kpi'
  | 'case_study'
  | 'testimonial'
  | 'audit'
  | 'training_stat'
  | 'safeguarding'
  | 'accreditation'

export interface EvidenceItem {
  id: string
  organisation_id: string
  type: EvidenceType
  title: string
  content: string
  metric_value: string | null
  metric_date: string | null
  source: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface BidLibraryItem {
  id: string
  organisation_id: string
  title: string
  category: string
  content: string
  tags: string[]
  version: number
  status: 'draft' | 'approved' | 'archived'
  word_count: number | null
  created_at: string
  updated_at: string
}

export type BidOutcome = 'won' | 'lost' | 'pending' | 'no_feedback'

export interface PreviousBid {
  id: string
  organisation_id: string
  tender_name: string
  commissioner: string | null
  submission_date: string | null
  outcome: BidOutcome | null
  overall_score: number | null
  feedback: string | null
  contract_value: number | null
  sector: string | null
  source: 'own' | 'public'
  created_at: string
}

export interface PreviousBidSection {
  id: string
  previous_bid_id: string
  question_text: string
  response_text: string
  section_score: number | null
  created_at: string
}

export type DiscoveredTenderStatus = 'new' | 'saved' | 'ignored' | 'applied'

export interface DiscoveredTender {
  id: string
  organisation_id: string
  external_id: string | null
  source: string
  title: string
  commissioner: string | null
  sector: string | null
  contract_value: number | null
  deadline: string | null
  published_at: string | null
  description: string | null
  url: string | null
  cpv_codes: string[]
  status: DiscoveredTenderStatus
  raw_data: Json
  created_at: string
}

export type TenderStatus = 'active' | 'submitted' | 'won' | 'lost'

export interface Tender {
  id: string
  organisation_id: string
  title: string
  commissioner: string | null
  deadline: string | null
  contract_value: number | null
  sector: string | null
  status: TenderStatus
  discovered_id: string | null
  created_at: string
  updated_at: string
}

export interface TenderDocument {
  id: string
  tender_id: string
  file_name: string
  file_url: string
  file_type: 'pdf' | 'docx'
  parse_status: 'pending' | 'processing' | 'complete' | 'failed'
  raw_text: string | null
  created_at: string
}

export type QuestionStatus = 'empty' | 'draft' | 'ai_generated' | 'reviewed' | 'complete'

export interface TenderQuestion {
  id: string
  tender_id: string
  document_id: string | null
  question_number: string | null
  question_text: string
  word_limit: number | null
  scoring_weight: number | null
  scoring_criteria: string | null
  required_evidence: string | null
  order_index: number
  status: QuestionStatus
  created_at: string
}

export interface TenderResponse {
  id: string
  question_id: string
  tender_id: string
  content: string
  word_count: number
  quality_score: number | null
  quality_breakdown: QualityBreakdown | null
  quality_flags: QualityFlag[] | null
  ai_context_used: AiContextUsed | null
  version: number
  created_at: string
  updated_at: string
}

export interface QualityBreakdown {
  relevance: number
  compliance: number
  evidence: number
  specificity: number
  word_count: number
  clarity: number
  differentiation: number
}

export interface QualityFlag {
  dimension: string
  score: number
  maxScore: number
  status: 'good' | 'warning' | 'poor'
  message: string
  suggestion: string
  action?: string
}

export interface AiContextUsed {
  companyProfile: boolean
  evidenceItems: string[]
  bidLibraryItems: string[]
  winningBids: WinningBidMatch[]
}

export interface WinningBidMatch {
  tenderName: string
  outcome: string
  similarity: number
  source: 'own' | 'public'
}

export interface QualityCheck {
  id: string
  response_id: string
  total_score: number
  relevance_score: number | null
  compliance_score: number | null
  evidence_score: number | null
  specificity_score: number | null
  word_count_score: number | null
  clarity_score: number | null
  differentiation_score: number | null
  flags: QualityFlag[] | null
  suggestions: string[] | null
  created_at: string
}

// ---- API response shapes ----

export interface GenerateAnswerResponse {
  content: string
  contextUsed: AiContextUsed
}

export interface QualityCheckResponse {
  score: number
  breakdown: QualityBreakdown
  flags: QualityFlag[]
  suggestions: string[]
  band: 'excellent' | 'good' | 'needs_work' | 'at_risk'
}
