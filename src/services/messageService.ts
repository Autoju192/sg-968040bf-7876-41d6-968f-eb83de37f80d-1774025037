import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/supabase";

export type Message = Tables<"messages">;

/**
 * Get all messages for a tender
 */
export async function getMessages(tenderId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*, users(full_name)")
    .eq("tender_id", tenderId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", { data, error });
    throw error;
  }
  return data || [];
}

/**
 * Send a user message
 */
export async function sendMessage(
  tenderId: string,
  userId: string,
  content: string
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      tender_id: tenderId,
      user_id: userId,
      content,
      is_ai: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Send an AI message
 */
export async function sendAIMessage(
  tenderId: string,
  content: string
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      tender_id: tenderId,
      user_id: null,
      content,
      is_ai: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}