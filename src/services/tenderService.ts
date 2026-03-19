import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/supabase";

export type Tender = Tables<"tenders">;
export type TenderFile = Tables<"tender_files">;
export type TenderScore = Tables<"tender_scores">;

/**
 * Get all tenders for the current user's organisation
 */
export async function getTenders(organisationId: string) {
  const { data, error } = await supabase
    .from("tenders")
    .select("*, tender_scores(*)")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tenders:", { data, error });
    throw error;
  }
  return data || [];
}

/**
 * Get a single tender by ID with all related data
 */
export async function getTenderById(tenderId: string) {
  const { data, error } = await supabase
    .from("tenders")
    .select(`
      *,
      tender_scores(*),
      tender_files(*),
      documents(*),
      tasks(*),
      messages(*)
    `)
    .eq("id", tenderId)
    .single();

  if (error) {
    console.error("Error fetching tender:", { data, error });
    throw error;
  }
  return data;
}

/**
 * Create a new tender
 */
export async function createTender(
  organisationId: string,
  tenderData: {
    title: string;
    authority: string;
    deadline: string;
    value?: number;
    service_type?: string;
    location?: string;
  }
) {
  const { data, error } = await supabase
    .from("tenders")
    .insert({
      organisation_id: organisationId,
      ...tenderData,
      status: "new",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update tender status or decision
 */
export async function updateTender(
  tenderId: string,
  updates: {
    status?: string;
    decision?: string;
    ai_score?: number;
  }
) {
  const { data, error } = await supabase
    .from("tenders")
    .update(updates)
    .eq("id", tenderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Upload tender file
 */
export async function uploadTenderFile(
  tenderId: string,
  file: File
) {
  const fileName = `${tenderId}/${Date.now()}-${file.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("tender-files")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("tender_files")
    .insert({
      tender_id: tenderId,
      file_name: file.name,
      file_path: uploadData.path,
      file_type: file.type,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create AI score for tender
 */
export async function createTenderScore(
  tenderId: string,
  scoreData: {
    service_fit: number;
    geography_fit: number;
    compliance_fit: number;
    evidence_fit: number;
    total_score: number;
    reasoning?: string;
    risks?: string[];
    missing_evidence?: string[];
  }
) {
  const { data, error } = await supabase
    .from("tender_scores")
    .insert({
      tender_id: tenderId,
      ...scoreData,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}