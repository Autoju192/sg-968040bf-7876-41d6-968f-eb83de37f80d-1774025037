import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/supabase";

export type EvidenceLibrary = Tables<"evidence_library">;

/**
 * Get all evidence items for an organisation
 */
export async function getEvidenceLibrary(organisationId: string) {
  const { data, error } = await supabase
    .from("evidence_library")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching evidence:", { data, error });
    throw error;
  }
  return data || [];
}

/**
 * Create new evidence item
 */
export async function createEvidence(
  organisationId: string,
  evidenceData: {
    category: string;
    title: string;
    content: string;
    tags?: string[];
  }
) {
  const { data, error } = await supabase
    .from("evidence_library")
    .insert({
      organisation_id: organisationId,
      ...evidenceData,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update evidence item
 */
export async function updateEvidence(
  evidenceId: string,
  updates: {
    category?: string;
    title?: string;
    content?: string;
    tags?: string[];
  }
) {
  const { data, error } = await supabase
    .from("evidence_library")
    .update(updates)
    .eq("id", evidenceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete evidence item
 */
export async function deleteEvidence(evidenceId: string) {
  const { error } = await supabase
    .from("evidence_library")
    .delete()
    .eq("id", evidenceId);

  if (error) throw error;
}