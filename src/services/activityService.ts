import { supabase } from "@/lib/supabase";

export interface Activity {
  id: string;
  organisation_id: string;
  tender_id: string | null;
  user_id: string | null;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  users?: {
    full_name: string;
    email: string;
  };
}

export interface CreateActivityParams {
  tenderId?: string;
  actionType: string;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
}

export const activityService = {
  async create(
    params: CreateActivityParams,
    organisationId: string,
    userId?: string
  ): Promise<void> {
    const { error } = await supabase.from("activity_log").insert({
      organisation_id: organisationId,
      tender_id: params.tenderId || null,
      user_id: userId || null,
      action_type: params.actionType,
      entity_type: params.entityType,
      entity_id: params.entityId || null,
      description: params.description,
      metadata: params.metadata || {},
    });

    if (error) {
      console.error("Error creating activity log:", error);
    }
  },

  async getForTender(tenderId: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from("activity_log")
      .select(`
        *,
        users (
          full_name,
          email
        )
      `)
      .eq("tender_id", tenderId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return (data as Activity[]) || [];
  },

  async getForOrganisation(organisationId: string, limit: number = 20): Promise<Activity[]> {
    const { data, error } = await supabase
      .from("activity_log")
      .select(`
        *,
        users (
          full_name,
          email
        )
      `)
      .eq("organisation_id", organisationId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data as Activity[]) || [];
  },
};