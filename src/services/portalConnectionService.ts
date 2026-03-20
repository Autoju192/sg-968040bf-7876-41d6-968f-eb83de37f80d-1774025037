import { supabase } from "@/lib/supabase";

export interface PortalConnection {
  id: string;
  organisationId: string;
  connectionName: string;
  connectionType: "PUBLIC_API" | "EMAIL" | "LINK_WATCHER" | "PORTAL_SESSION";
  sourceType?: string;
  status: "connected" | "error" | "syncing" | "inactive" | "pending";
  config?: Record<string, any>;
  credentials?: Record<string, any>;
  lastSyncAt?: string;
  nextSyncAt?: string;
  syncFrequency: "hourly" | "every_6_hours" | "daily" | "weekly" | "manual";
  errorMessage?: string;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConnectionParams {
  organisationId: string;
  connectionName: string;
  connectionType: "PUBLIC_API" | "EMAIL" | "LINK_WATCHER" | "PORTAL_SESSION";
  sourceType?: string;
  config?: Record<string, any>;
  credentials?: Record<string, any>;
  syncFrequency?: "hourly" | "every_6_hours" | "daily" | "weekly" | "manual";
}

export interface ConnectionLog {
  id: string;
  connectionId: string;
  organisationId: string;
  runStatus: "success" | "partial_success" | "failed" | "running";
  itemsFetched: number;
  itemsCreated: number;
  itemsUpdated: number;
  errorMessage?: string;
  durationMs?: number;
  metadata?: Record<string, any>;
  createdAt: string;
}

export const portalConnectionService = {
  async create(params: CreateConnectionParams): Promise<PortalConnection> {
    const { data, error } = await supabase
      .from("portal_connections")
      .insert({
        organisation_id: params.organisationId,
        connection_name: params.connectionName,
        connection_type: params.connectionType,
        source_type: params.sourceType,
        config: params.config,
        credentials: params.credentials,
        sync_frequency: params.syncFrequency || "daily",
        status: "inactive",
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDb(data);
  },

  async getAll(organisationId: string): Promise<PortalConnection[]> {
    const { data, error } = await supabase
      .from("portal_connections")
      .select("*")
      .eq("organisation_id", organisationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapFromDb);
  },

  async getById(id: string): Promise<PortalConnection | null> {
    const { data, error } = await supabase
      .from("portal_connections")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ? this.mapFromDb(data) : null;
  },

  async update(
    id: string,
    updates: Partial<CreateConnectionParams>
  ): Promise<void> {
    const dbUpdates: Record<string, any> = {};
    if (updates.connectionName) dbUpdates.connection_name = updates.connectionName;
    if (updates.config) dbUpdates.config = updates.config;
    if (updates.credentials) dbUpdates.credentials = updates.credentials;
    if (updates.syncFrequency) dbUpdates.sync_frequency = updates.syncFrequency;

    const { error } = await supabase
      .from("portal_connections")
      .update(dbUpdates)
      .eq("id", id);

    if (error) throw error;
  },

  async updateStatus(
    id: string,
    status: PortalConnection["status"],
    errorMessage?: string
  ): Promise<void> {
    const updates: Record<string, any> = { status };
    if (errorMessage) updates.error_message = errorMessage;
    if (status === "error") {
      updates.error_count = supabase.rpc("increment", { x: 1 });
    } else if (status === "connected") {
      updates.error_count = 0;
      updates.error_message = null;
    }

    const { error } = await supabase
      .from("portal_connections")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
  },

  async updateLastSync(id: string): Promise<void> {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("portal_connections")
      .update({ last_sync_at: now })
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("portal_connections")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async triggerSync(id: string): Promise<void> {
    // Update status to syncing
    await this.updateStatus(id, "syncing");

    // In production, this would trigger a backend job
    // For now, we'll just update the status back to connected
    setTimeout(async () => {
      await this.updateStatus(id, "connected");
      await this.updateLastSync(id);
    }, 2000);
  },

  async getLogs(connectionId: string, limit: number = 50): Promise<ConnectionLog[]> {
    const { data, error } = await supabase
      .from("connection_logs")
      .select("*")
      .eq("connection_id", connectionId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(this.mapLogFromDb);
  },

  async createLog(params: {
    connectionId: string;
    organisationId: string;
    runStatus: ConnectionLog["runStatus"];
    itemsFetched?: number;
    itemsCreated?: number;
    itemsUpdated?: number;
    errorMessage?: string;
    durationMs?: number;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { error } = await supabase.from("connection_logs").insert({
      connection_id: params.connectionId,
      organisation_id: params.organisationId,
      run_status: params.runStatus,
      items_fetched: params.itemsFetched || 0,
      items_created: params.itemsCreated || 0,
      items_updated: params.itemsUpdated || 0,
      error_message: params.errorMessage,
      duration_ms: params.durationMs,
      metadata: params.metadata,
    });

    if (error) throw error;
  },

  mapFromDb(data: any): PortalConnection {
    return {
      id: data.id,
      organisationId: data.organisation_id,
      connectionName: data.connection_name,
      connectionType: data.connection_type,
      sourceType: data.source_type,
      status: data.status,
      config: data.config,
      credentials: data.credentials,
      lastSyncAt: data.last_sync_at,
      nextSyncAt: data.next_sync_at,
      syncFrequency: data.sync_frequency,
      errorMessage: data.error_message,
      errorCount: data.error_count || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  mapLogFromDb(data: any): ConnectionLog {
    return {
      id: data.id,
      connectionId: data.connection_id,
      organisationId: data.organisation_id,
      runStatus: data.run_status,
      itemsFetched: data.items_fetched || 0,
      itemsCreated: data.items_created || 0,
      itemsUpdated: data.items_updated || 0,
      errorMessage: data.error_message,
      durationMs: data.duration_ms,
      metadata: data.metadata,
      createdAt: data.created_at,
    };
  },
};