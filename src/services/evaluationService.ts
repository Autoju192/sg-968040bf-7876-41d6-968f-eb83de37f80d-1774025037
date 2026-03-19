import { supabase } from "@/lib/supabase";

export interface TenderEvaluation {
  decision: "Bid" | "No Bid" | "Review";
  score: number;
  service_fit: number;
  geography_fit: number;
  compliance_fit: number;
  evidence_fit: number;
  commercial_viability: number;
  effort: number;
  why: string[];
  risks: string[];
  missing_evidence: string[];
  next_steps: string[];
}

export interface CompanyProfile {
  name: string;
  cqc_registered: boolean;
  cqc_rating?: string;
  services: string[];
  service_area: string[];
  specialisms?: string[];
  bed_capacity?: number;
  staff_count?: number;
  certifications?: string[];
  years_experience?: number;
  annual_turnover?: number;
}

export const evaluationService = {
  /**
   * Evaluate a tender against company profile
   */
  async evaluateTender(
    tenderId: string,
    companyProfile: CompanyProfile
  ): Promise<TenderEvaluation> {
    // Get tender details
    const { data: tender, error: tenderError } = await supabase
      .from("tenders")
      .select("*")
      .eq("id", tenderId)
      .single();

    if (tenderError || !tender) {
      throw new Error("Failed to fetch tender details");
    }

    // Call the AI evaluation API
    const response = await fetch("/api/evaluate-tender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tenderTitle: tender.title,
        tenderDescription: tender.description,
        authority: tender.authority,
        location: tender.location,
        value: tender.value,
        serviceType: tender.service_type,
        deadline: tender.deadline,
        companyProfile,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to evaluate tender");
    }

    const { evaluation } = await response.json();
    return evaluation;
  },

  /**
   * Save evaluation results to database
   */
  async saveEvaluation(
    tenderId: string,
    evaluation: TenderEvaluation
  ): Promise<void> {
    const { error } = await supabase.from("tender_scores").upsert(
      {
        tender_id: tenderId,
        total_score: evaluation.score,
        service_fit: evaluation.service_fit,
        geography_fit: evaluation.geography_fit,
        compliance_fit: evaluation.compliance_fit,
        evidence_fit: evaluation.evidence_fit,
        reasoning: evaluation.why.join("\n"),
        risks: evaluation.risks,
        missing_evidence: evaluation.missing_evidence,
      },
      { onConflict: "tender_id" }
    );

    if (error) {
      throw new Error("Failed to save evaluation: " + error.message);
    }
  },

  /**
   * Get company profile from organisation data
   */
  async getCompanyProfile(organisationId: string): Promise<CompanyProfile> {
    const { data: org, error } = await supabase
      .from("organisations")
      .select("*")
      .eq("id", organisationId)
      .single();

    if (error || !org) {
      throw new Error("Failed to fetch organisation details");
    }

    // Build company profile from organisation data
    // This is a basic implementation - you can enhance it based on your org schema
    const profile: CompanyProfile = {
      name: org.name,
      cqc_registered: true, // Assuming all are CQC registered
      services: ["homecare", "personal care", "live-in care"], // Default services
      service_area: ["London", "Kent"], // Default areas
      years_experience: 5, // Default
    };

    return profile;
  },

  /**
   * Get evaluation history for a tender
   */
  async getEvaluationHistory(tenderId: string) {
    const { data, error } = await supabase
      .from("tender_scores")
      .select("*")
      .eq("tender_id", tenderId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch evaluation history");
    }

    return data;
  },
};