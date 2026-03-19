import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          settings: any;
        };
        Insert: Omit<Database["public"]["Tables"]["organisations"]["Row"], "id" | "created_at">;
      };
      users: {
        Row: {
          id: string;
          organisation_id: string;
          email: string;
          full_name: string;
          role: "admin" | "bid_manager" | "contributor";
          created_at: string;
        };
      };
      tenders: {
        Row: {
          id: string;
          organisation_id: string;
          title: string;
          authority: string;
          deadline: string;
          value: string;
          service_type: string;
          location: string;
          status: "new" | "review" | "bid" | "no_bid" | "submitted" | "awarded" | "lost";
          ai_score: number;
          decision: "bid" | "no_bid" | "review" | null;
          created_at: string;
          updated_at: string;
        };
      };
      tender_files: {
        Row: {
          id: string;
          tender_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          extracted_text: string;
          created_at: string;
        };
      };
      tender_scores: {
        Row: {
          id: string;
          tender_id: string;
          service_fit: number;
          geography_fit: number;
          compliance_fit: number;
          evidence_fit: number;
          total_score: number;
          reasoning: string;
          risks: string[];
          missing_evidence: string[];
          created_at: string;
        };
      };
      evidence_library: {
        Row: {
          id: string;
          organisation_id: string;
          category: string;
          title: string;
          content: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
      };
      documents: {
        Row: {
          id: string;
          tender_id: string;
          created_by: string;
          type: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          tender_id: string;
          assigned_to: string;
          created_by: string;
          title: string;
          description: string;
          status: "not_started" | "in_progress" | "review" | "completed";
          due_date: string;
          created_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          tender_id: string;
          user_id: string;
          content: string;
          is_ai: boolean;
          created_at: string;
        };
      };
    };
  };
};