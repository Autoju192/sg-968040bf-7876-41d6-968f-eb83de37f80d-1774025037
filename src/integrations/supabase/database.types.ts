 
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          file_url: string | null
          id: string
          tender_id: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          file_url?: string | null
          id?: string
          tender_id: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          file_url?: string | null
          id?: string
          tender_id?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      email_settings: {
        Row: {
          created_at: string | null
          from_email: string | null
          from_name: string | null
          id: string
          organisation_id: string | null
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: string | null
          smtp_username: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          organisation_id?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: string | null
          smtp_username?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          organisation_id?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: string | null
          smtp_username?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_settings_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: true
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_library: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          organisation_id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          organisation_id: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          organisation_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_library_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      historical_bids: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          organisation_id: string
          outcome: string | null
          tender_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          organisation_id: string
          outcome?: string | null
          tender_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          organisation_id?: string
          outcome?: string | null
          tender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historical_bids_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historical_bids_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          deadline: string | null
          id: string
          is_ai: boolean | null
          message_text: string | null
          parsed_action: string | null
          source: string | null
          tender_id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deadline?: string | null
          id?: string
          is_ai?: boolean | null
          message_text?: string | null
          parsed_action?: string | null
          source?: string | null
          tender_id: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deadline?: string | null
          id?: string
          is_ai?: boolean | null
          message_text?: string | null
          parsed_action?: string | null
          source?: string | null
          tender_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string | null
          deadline_reminders: boolean | null
          email_frequency: string | null
          id: string
          new_tender_alerts: boolean | null
          status_updates: boolean | null
          team_mentions: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deadline_reminders?: boolean | null
          email_frequency?: string | null
          id?: string
          new_tender_alerts?: boolean | null
          status_updates?: boolean | null
          team_mentions?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deadline_reminders?: boolean | null
          email_frequency?: string | null
          id?: string
          new_tender_alerts?: boolean | null
          status_updates?: boolean | null
          team_mentions?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          organisation_id: string | null
          read: boolean | null
          task_id: string | null
          tender_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          organisation_id?: string | null
          read?: boolean | null
          task_id?: string | null
          tender_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          organisation_id?: string | null
          read?: boolean | null
          task_id?: string | null
          tender_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          created_at: string | null
          geography_focus: string[] | null
          id: string
          name: string
          sector: string | null
          settings: Json | null
        }
        Insert: {
          created_at?: string | null
          geography_focus?: string[] | null
          id?: string
          name: string
          sector?: string | null
          settings?: Json | null
        }
        Update: {
          created_at?: string | null
          geography_focus?: string[] | null
          id?: string
          name?: string
          sector?: string | null
          settings?: Json | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          status: string
          tender_id: string
          title: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          tender_id: string
          title: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          tender_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_files: {
        Row: {
          created_at: string | null
          extracted_text: string | null
          file_name: string
          file_path: string
          file_type: string
          file_url: string | null
          id: string
          parsed_text: string | null
          tender_id: string
        }
        Insert: {
          created_at?: string | null
          extracted_text?: string | null
          file_name: string
          file_path: string
          file_type: string
          file_url?: string | null
          id?: string
          parsed_text?: string | null
          tender_id: string
        }
        Update: {
          created_at?: string | null
          extracted_text?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          file_url?: string | null
          id?: string
          parsed_text?: string | null
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_files_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_pipeline: {
        Row: {
          created_at: string | null
          id: string
          next_action: string | null
          next_action_date: string | null
          owner: string | null
          priority: string | null
          status: string | null
          tender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          next_action?: string | null
          next_action_date?: string | null
          owner?: string | null
          priority?: string | null
          status?: string | null
          tender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          next_action?: string | null
          next_action_date?: string | null
          owner?: string | null
          priority?: string | null
          status?: string | null
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_pipeline_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_pipeline_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_questions: {
        Row: {
          created_at: string | null
          id: string
          question_text: string | null
          required: boolean | null
          section: string | null
          tender_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_text?: string | null
          required?: boolean | null
          section?: string | null
          tender_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_text?: string | null
          required?: boolean | null
          section?: string | null
          tender_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tender_questions_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_scores: {
        Row: {
          compliance_fit: number
          created_at: string | null
          evidence_fit: number
          geography_fit: number
          id: string
          missing_evidence: string[] | null
          reasoning: string | null
          risks: string[] | null
          service_fit: number
          tender_id: string
          total_score: number
        }
        Insert: {
          compliance_fit: number
          created_at?: string | null
          evidence_fit: number
          geography_fit: number
          id?: string
          missing_evidence?: string[] | null
          reasoning?: string | null
          risks?: string[] | null
          service_fit: number
          tender_id: string
          total_score: number
        }
        Update: {
          compliance_fit?: number
          created_at?: string | null
          evidence_fit?: number
          geography_fit?: number
          id?: string
          missing_evidence?: string[] | null
          reasoning?: string | null
          risks?: string[] | null
          service_fit?: number
          tender_id?: string
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "tender_scores_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          ai_score: number | null
          authority: string
          category: string | null
          created_at: string | null
          deadline: string
          decision: string | null
          dedup_key: string | null
          description: string | null
          id: string
          link: string | null
          location: string | null
          organisation_id: string
          service_type: string | null
          source: string | null
          status: string
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          ai_score?: number | null
          authority: string
          category?: string | null
          created_at?: string | null
          deadline: string
          decision?: string | null
          dedup_key?: string | null
          description?: string | null
          id?: string
          link?: string | null
          location?: string | null
          organisation_id: string
          service_type?: string | null
          source?: string | null
          status?: string
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          ai_score?: number | null
          authority?: string
          category?: string | null
          created_at?: string | null
          deadline?: string
          decision?: string | null
          dedup_key?: string | null
          description?: string | null
          id?: string
          link?: string | null
          location?: string | null
          organisation_id?: string
          service_type?: string | null
          source?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tenders_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          onboarding_completed: boolean | null
          organisation_id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          onboarding_completed?: boolean | null
          organisation_id: string
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          onboarding_completed?: boolean | null
          organisation_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organisation: {
        Args: { org_name: string }
        Returns: {
          id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
