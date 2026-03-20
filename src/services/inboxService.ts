import { supabase } from "@/lib/supabase";

export interface InboxItem {
  id: string;
  organisationId: string;
  tenderId?: string;
  connectionId?: string;
  source: "API" | "EMAIL" | "LINK_WATCHER" | "PORTAL_SESSION" | "MANUAL";
  sourceType?: string;
  type: "new_tender" | "update" | "clarification" | "amendment" | "deadline_change" | "message" | "document_added";
  title: string;
  summary?: string;
  rawContent?: string;
  actionRequired: boolean;
  actionText?: string;
  actionDeadline?: string;
  suggestedOwner?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "unread" | "read" | "actioned" | "archived";
  assignedTo?: string;
  readAt?: string;
  actionedAt?: string;
  externalId?: string;
  externalLink?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  tender?: {
    id: string;
    title: string;
    authority: string;
  };
}

export interface CreateInboxItemParams {
  organisationId: string;
  tenderId?: string;
  connectionId?: string;
  source: InboxItem["source"];
  sourceType?: string;
  type: InboxItem["type"];
  title: string;
  summary?: string;
  rawContent?: string;
  actionRequired?: boolean;
  actionText?: string;
  actionDeadline?: string;
  suggestedOwner?: string;
  priority?: InboxItem["priority"];
  externalId?: string;
  externalLink?: string;
  metadata?: Record<string, any>;
}

export const inboxService = {
  async create(params: CreateInboxItemParams): Promise<InboxItem> {
    const { data, error } = await supabase
      .from("tender_inbox")
      .insert({
        organisation_id: params.organisationId,
        tender_id: params.tenderId,
        connection_id: params.connectionId,
        source: params.source,
        source_type: params.sourceType,
        type: params.type,
        title: params.title,
        summary: params.summary,
        raw_content: params.rawContent,
        action_required: params.actionRequired || false,
        action_text: params.actionText,
        action_deadline: params.actionDeadline,
        suggested_owner: params.suggestedOwner,
        priority: params.priority || "medium",
        status: "unread",
        external_id: params.externalId,
        external_link: params.externalLink,
        metadata: params.metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDb(data);
  },

  async getAll(
    organisationId: string,
    filters?: {
      status?: InboxItem["status"];
      actionRequired?: boolean;
      assignedTo?: string;
    }
  ): Promise<InboxItem[]> {
    let query = supabase
      .from("tender_inbox")
      .select(
        `
        *,
        tender:tenders(id, title, authority)
      `
      )
      .eq("organisation_id", organisationId);

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.actionRequired !== undefined) {
      query = query.eq("action_required", filters.actionRequired);
    }

    if (filters?.assignedTo) {
      query = query.eq("assigned_to", filters.assignedTo);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(this.mapFromDb);
  },

  async getById(id: string): Promise<InboxItem | null> {
    const { data, error } = await supabase
      .from("tender_inbox")
      .select(
        `
        *,
        tender:tenders(id, title, authority)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ? this.mapFromDb(data) : null;
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from("tender_inbox")
      .update({
        status: "read",
        read_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  },

  async markAsActioned(id: string): Promise<void> {
    const { error } = await supabase
      .from("tender_inbox")
      .update({
        status: "actioned",
        actioned_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  },

  async assign(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("tender_inbox")
      .update({ assigned_to: userId })
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("tender_inbox")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async getUnreadCount(organisationId: string): Promise<number> {
    const { count, error } = await supabase
      .from("tender_inbox")
      .select("*", { count: "exact", head: true })
      .eq("organisation_id", organisationId)
      .eq("status", "unread");

    if (error) throw error;
    return count || 0;
  },

  async checkDuplicate(externalId: string, organisationId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("tender_inbox")
      .select("id")
      .eq("external_id", externalId)
      .eq("organisation_id", organisationId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  },

  mapFromDb(data: any): InboxItem {
    return {
      id: data.id,
      organisationId: data.organisation_id,
      tenderId: data.tender_id,
      connectionId: data.connection_id,
      source: data.source,
      sourceType: data.source_type,
      type: data.type,
      title: data.title,
      summary: data.summary,
      rawContent: data.raw_content,
      actionRequired: data.action_required,
      actionText: data.action_text,
      actionDeadline: data.action_deadline,
      suggestedOwner: data.suggested_owner,
      priority: data.priority,
      status: data.status,
      assignedTo: data.assigned_to,
      readAt: data.read_at,
      actionedAt: data.actioned_at,
      externalId: data.external_id,
      externalLink: data.external_link,
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tender: data.tender ? {
        id: data.tender.id,
        title: data.tender.title,
        authority: data.tender.authority,
      } : undefined,
    };
  },
};