export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      applicants: {
        Row: {
          ai_score: number | null
          applicant_name: string
          application_number: string
          company_name: string
          created_at: string
          documents_submitted: boolean
          email: string
          id: string
          phone: string | null
          qualification_status: boolean | null
          rfp_id: string
          status: string
          submission_date: string
          updated_at: string
          workflow_step: string
        }
        Insert: {
          ai_score?: number | null
          applicant_name: string
          application_number: string
          company_name: string
          created_at?: string
          documents_submitted?: boolean
          email: string
          id?: string
          phone?: string | null
          qualification_status?: boolean | null
          rfp_id: string
          status?: string
          submission_date?: string
          updated_at?: string
          workflow_step?: string
        }
        Update: {
          ai_score?: number | null
          applicant_name?: string
          application_number?: string
          company_name?: string
          created_at?: string
          documents_submitted?: boolean
          email?: string
          id?: string
          phone?: string | null
          qualification_status?: boolean | null
          rfp_id?: string
          status?: string
          submission_date?: string
          updated_at?: string
          workflow_step?: string
        }
        Relationships: [
          {
            foreignKeyName: "applicants_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfps"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_management: {
        Row: {
          id: string
          name: string
          vendor: string | null
          contract_details: string | null
          value: number | null
          status: string
          lifecycle_alerts: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          vendor?: string | null
          contract_details?: string | null
          value?: number | null
          status?: string
          lifecycle_alerts?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          vendor?: string | null
          contract_details?: string | null
          value?: number | null
          status?: string
          lifecycle_alerts?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_management_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rfps: {
        Row: {
          category: string
          closing_date: string
          created_at: string
          created_by: string | null
          id: string
          issue_date: string
          name: string
          number: string
          status: string | null
          tender_document_url: string | null
          total_applicants: number | null
          updated_at: string
          workflow_step: string | null
        }
        Insert: {
          category: string
          closing_date: string
          created_at?: string
          created_by?: string | null
          id?: string
          issue_date: string
          name: string
          number: string
          status?: string | null
          tender_document_url?: string | null
          total_applicants?: number | null
          updated_at?: string
          workflow_step?: string | null
        }
        Update: {
          category?: string
          closing_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          issue_date?: string
          name?: string
          number?: string
          status?: string | null
          tender_document_url?: string | null
          total_applicants?: number | null
          updated_at?: string
          workflow_step?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rfps_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prebid_query_uploads: {
        Row: {
          id: string
          rfp_id: string | null
          file_name: string
          processing_reference_id: string
          status: string
          upload_date: string
          vendor_name: string
          queries_count: number | null
          answers_generated: number | null
          csv_s3_uri: string | null
          result_s3_uri: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          rfp_id?: string | null
          file_name: string
          processing_reference_id: string
          status?: string
          upload_date?: string
          vendor_name: string
          queries_count?: number | null
          answers_generated?: number | null
          csv_s3_uri?: string | null
          result_s3_uri?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rfp_id?: string | null
          file_name?: string
          processing_reference_id?: string
          status?: string
          upload_date?: string
          vendor_name?: string
          queries_count?: number | null
          answers_generated?: number | null
          csv_s3_uri?: string | null
          result_s3_uri?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prebid_query_uploads_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfps"
            referencedColumns: ["id"]
          },
        ]
      }
      prebid_queries: {
        Row: {
          id: string
          upload_id: string | null
          rfp_id: string | null
          question: string
          answer: string | null
          vendor_name: string
          query_type: string
          query_group: string | null
          flag_for_intervention: boolean
          is_answered: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          upload_id?: string | null
          rfp_id?: string | null
          question: string
          answer?: string | null
          vendor_name: string
          query_type?: string
          query_group?: string | null
          flag_for_intervention?: boolean
          is_answered?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          upload_id?: string | null
          rfp_id?: string | null
          question?: string
          answer?: string | null
          vendor_name?: string
          query_type?: string
          query_group?: string | null
          flag_for_intervention?: boolean
          is_answered?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prebid_queries_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "prebid_query_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prebid_queries_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfps"
            referencedColumns: ["id"]
          },
                 ]
       }
       literature: {
         Row: {
           id: string
           rfp_id: string | null
           title: string
           author: string
           source: string
           publication_date: string
           keywords: string[]
           type: string
           url: string | null
           file_size: string | null
           abstract: string | null
           uploaded_by: string
           upload_date: string
           version: string | null
           last_modified: string
           editor: string | null
           file_path: string | null
           file_name: string | null
           mime_type: string | null
           created_at: string
           updated_at: string
         }
         Insert: {
           id?: string
           rfp_id?: string | null
           title: string
           author: string
           source: string
           publication_date: string
           keywords?: string[]
           type?: string
           url?: string | null
           file_size?: string | null
           abstract?: string | null
           uploaded_by: string
           upload_date?: string
           version?: string | null
           last_modified?: string
           editor?: string | null
           file_path?: string | null
           file_name?: string | null
           mime_type?: string | null
           created_at?: string
           updated_at?: string
         }
         Update: {
           id?: string
           rfp_id?: string | null
           title?: string
           author?: string
           source?: string
           publication_date?: string
           keywords?: string[]
           type?: string
           url?: string | null
           file_size?: string | null
           abstract?: string | null
           uploaded_by?: string
           upload_date?: string
           version?: string | null
           last_modified?: string
           editor?: string | null
           file_path?: string | null
           file_name?: string | null
           mime_type?: string | null
           created_at?: string
           updated_at?: string
         }
         Relationships: [
           {
             foreignKeyName: "literature_rfp_id_fkey"
             columns: ["rfp_id"]
             isOneToOne: false
             referencedRelation: "rfps"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
