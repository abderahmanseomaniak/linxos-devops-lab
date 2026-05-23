export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      allocations: {
        Row: {
          application_id: string
          created_at: string | null
          id: string
          quantity: number
          status: string
        }
        Insert: {
          application_id: string
          created_at?: string | null
          id?: string
          quantity?: number
          status?: string
        }
        Update: {
          application_id?: string
          created_at?: string | null
          id?: string
          quantity?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "allocations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          created_at: string | null
          form1_data: Json | null
          id: string
          name: string | null
          priority: number
          reference_code: string
          state: string
          submitter_email: string | null
          submitter_user_id: string | null
          updated_at: string | null
          version: number
        }
        Insert: {
          created_at?: string | null
          form1_data?: Json | null
          id?: string
          name?: string | null
          priority?: number
          reference_code: string
          state?: string
          submitter_email?: string | null
          submitter_user_id?: string | null
          updated_at?: string | null
          version?: number
        }
        Update: {
          created_at?: string | null
          form1_data?: Json | null
          id?: string
          name?: string | null
          priority?: number
          reference_code?: string
          state?: string
          submitter_email?: string | null
          submitter_user_id?: string | null
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          application_id: string
          created_at: string | null
          from_state: string | null
          id: number
          metadata: Json | null
          to_state: string
          triggered_by: string
        }
        Insert: {
          application_id: string
          created_at?: string | null
          from_state?: string | null
          id?: number
          metadata?: Json | null
          to_state: string
          triggered_by?: string
        }
        Update: {
          application_id?: string
          created_at?: string | null
          from_state?: string | null
          id?: number
          metadata?: Json | null
          to_state?: string
          triggered_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      confirmations: {
        Row: {
          application_id: string
          confirmed_at: string | null
          form2_data: Json | null
          id: string
        }
        Insert: {
          application_id: string
          confirmed_at?: string | null
          form2_data?: Json | null
          id?: string
        }
        Update: {
          application_id?: string
          confirmed_at?: string | null
          form2_data?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "confirmations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      execution_records: {
        Row: {
          application_id: string
          created_at: string | null
          delivery_tracking: Json | null
          id: string
          logistics_status: string | null
          ugc_reporting: Json | null
          updated_at: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          delivery_tracking?: Json | null
          id?: string
          logistics_status?: string | null
          ugc_reporting?: Json | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          delivery_tracking?: Json | null
          id?: string
          logistics_status?: string | null
          ugc_reporting?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "execution_records_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      logistics_history: {
        Row: {
          application_id: string | null
          created_at: string | null
          from_status: string | null
          id: string
          metadata: Json | null
          notes: string | null
          to_status: string
          triggered_by: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          to_status: string
          triggered_by?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          to_status?: string
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logistics_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          application_id: string | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      scoring_results: {
        Row: {
          application_id: string
          confidence_score: number | null
          created_at: string | null
          failed_gate: string | null
          gates_passed: boolean
          id: string
          llm_raw_output: Json | null
          scores: Json | null
          scoring_profile_id: string | null
          tier: string
          total_score: number
        }
        Insert: {
          application_id: string
          confidence_score?: number | null
          created_at?: string | null
          failed_gate?: string | null
          gates_passed?: boolean
          id?: string
          llm_raw_output?: Json | null
          scores?: Json | null
          scoring_profile_id?: string | null
          tier?: string
          total_score?: number
        }
        Update: {
          application_id?: string
          confidence_score?: number | null
          created_at?: string | null
          failed_gate?: string | null
          gates_passed?: boolean
          id?: string
          llm_raw_output?: Json | null
          scores?: Json | null
          scoring_profile_id?: string | null
          tier?: string
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "scoring_results_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_history: {
        Row: {
          application_id: string | null
          created_at: string | null
          details: Json | null
          event_type: string
          from_state: string | null
          id: string
          to_state: string | null
          triggered_by: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          details?: Json | null
          event_type: string
          from_state?: string | null
          id?: string
          to_state?: string | null
          triggered_by?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          details?: Json | null
          event_type?: string
          from_state?: string | null
          id?: string
          to_state?: string | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof DatabaseWithoutInternals, "public">]

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
