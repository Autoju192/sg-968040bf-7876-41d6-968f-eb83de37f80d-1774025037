import { supabase } from "@/lib/supabase";

export interface Task {
  id: string;
  organisation_id: string;
  tender_id: string | null;
  title: string;
  description: string | null;
  assigned_to: string | null;
  created_by: string | null;
  status: "pending" | "in_progress" | "review" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskParams {
  tenderId?: string;
  title: string;
  description?: string;
  assignedTo?: string;
  priority?: Task["priority"];
  dueDate?: string;
}

export const taskService = {
  async create(params: CreateTaskParams, organisationId: string, userId: string): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        organisation_id: organisationId,
        tender_id: params.tenderId || null,
        title: params.title,
        description: params.description || null,
        assigned_to: params.assignedTo || null,
        created_by: userId,
        priority: params.priority || "medium",
        due_date: params.dueDate || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async getForTender(tenderId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("tender_id", tenderId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Task[]) || [];
  },

  async getForUser(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("assigned_to", userId)
      .order("due_date", { ascending: true, nullsFirst: false });

    if (error) throw error;
    return (data as Task[]) || [];
  },

  async updateStatus(taskId: string, status: Task["status"]): Promise<void> {
    const updateData: any = { status, updated_at: new Date().toISOString() };
    
    if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", taskId);

    if (error) throw error;
  },

  async update(taskId: string, updates: Partial<Task>): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", taskId);

    if (error) throw error;
  },

  async delete(taskId: string): Promise<void> {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) throw error;
  },
};