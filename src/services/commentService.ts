import { supabase } from "@/lib/supabase";

export interface Comment {
  id: string;
  organisation_id: string;
  tender_id: string | null;
  task_id: string | null;
  user_id: string;
  content: string;
  mentions: string[];
  created_at: string;
  updated_at: string;
  users?: {
    full_name: string;
    email: string;
  };
}

export interface CreateCommentParams {
  tenderId?: string;
  taskId?: string;
  content: string;
  mentions?: string[];
}

export const commentService = {
  async create(
    params: CreateCommentParams,
    organisationId: string,
    userId: string
  ): Promise<Comment> {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        organisation_id: organisationId,
        tender_id: params.tenderId || null,
        task_id: params.taskId || null,
        user_id: userId,
        content: params.content,
        mentions: params.mentions || [],
      })
      .select(`
        *,
        users (
          full_name,
          email
        )
      `)
      .single();

    if (error) throw error;
    return data as Comment;
  },

  async getForTender(tenderId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        users (
          full_name,
          email
        )
      `)
      .eq("tender_id", tenderId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as Comment[]) || [];
  },

  async getForTask(taskId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        users (
          full_name,
          email
        )
      `)
      .eq("task_id", taskId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as Comment[]) || [];
  },

  async update(commentId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from("comments")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", commentId);

    if (error) throw error;
  },

  async delete(commentId: string): Promise<void> {
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (error) throw error;
  },
};