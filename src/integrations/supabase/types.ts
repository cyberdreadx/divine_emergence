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
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      deliverables: {
        Row: {
          asset_type: string
          created_at: string
          description: string | null
          due_date: string | null
          file_url: string | null
          id: string
          partner_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          asset_type?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          partner_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          asset_type?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          partner_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      event_flow_segments: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          event_id: string
          facilitator: string | null
          facilitator_instagram: string | null
          id: string
          segment_order: number
          segment_type: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          event_id: string
          facilitator?: string | null
          facilitator_instagram?: string | null
          id?: string
          segment_order?: number
          segment_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          event_id?: string
          facilitator?: string | null
          facilitator_instagram?: string | null
          id?: string
          segment_order?: number
          segment_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_flow_segments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_settings: {
        Row: {
          created_at: string
          event_id: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_settings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sponsors: {
        Row: {
          created_at: string
          cta_label: string | null
          cta_link: string | null
          description: string | null
          display_order: number
          event_id: string
          id: string
          is_main: boolean
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          description?: string | null
          display_order?: number
          event_id: string
          id?: string
          is_main?: boolean
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          description?: string | null
          display_order?: number
          event_id?: string
          id?: string
          is_main?: boolean
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cover_image: string | null
          created_at: string
          date: string | null
          description: string | null
          end_time: string | null
          highlights: Json | null
          id: string
          location: string | null
          max_guests: number | null
          name: string
          status: string
          ticket_price: number | null
          time: string | null
          updated_at: string
          venue_name: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          end_time?: string | null
          highlights?: Json | null
          id?: string
          location?: string | null
          max_guests?: number | null
          name: string
          status?: string
          ticket_price?: number | null
          time?: string | null
          updated_at?: string
          venue_name?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          end_time?: string | null
          highlights?: Json | null
          id?: string
          location?: string | null
          max_guests?: number | null
          name?: string
          status?: string
          ticket_price?: number | null
          time?: string | null
          updated_at?: string
          venue_name?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          check_in_time: string | null
          company: string | null
          created_at: string
          dietary_requirements: string | null
          email: string
          event_id: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          rsvp_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          check_in_time?: string | null
          company?: string | null
          created_at?: string
          dietary_requirements?: string | null
          email: string
          event_id?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          rsvp_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          check_in_time?: string | null
          company?: string | null
          created_at?: string
          dietary_requirements?: string | null
          email?: string
          event_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          rsvp_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          event_id: string | null
          guest_id: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          purchaser_email: string
          purchaser_name: string
          quantity: number
          status: string
          ticket_type: string
          total_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          guest_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          purchaser_email: string
          purchaser_name: string
          quantity?: number
          status?: string
          ticket_type?: string
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          guest_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          purchaser_email?: string
          purchaser_name?: string
          quantity?: number
          status?: string
          ticket_type?: string
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_assets: {
        Row: {
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          notes: string | null
          partner_id: string
          uploaded_at: string
        }
        Insert: {
          file_name: string
          file_size?: number | null
          file_type?: string
          file_url: string
          id?: string
          notes?: string | null
          partner_id: string
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          notes?: string | null
          partner_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_assets_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_recaps: {
        Row: {
          created_at: string
          engagement_rate: number | null
          event_id: string
          id: string
          impressions: number | null
          notes: string | null
          partner_id: string
          photos_count: number | null
          recap_url: string | null
          social_mentions: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          engagement_rate?: number | null
          event_id: string
          id?: string
          impressions?: number | null
          notes?: string | null
          partner_id: string
          photos_count?: number | null
          recap_url?: string | null
          social_mentions?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          engagement_rate?: number | null
          event_id?: string
          id?: string
          impressions?: number | null
          notes?: string | null
          partner_id?: string
          photos_count?: number | null
          recap_url?: string | null
          social_mentions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_recaps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_recaps_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          affiliate_link: string | null
          company_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          instagram: string | null
          monetary_value: number | null
          notes: string | null
          phone: string | null
          quantity: number | null
          status: string
          tier: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          affiliate_link?: string | null
          company_name: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          instagram?: string | null
          monetary_value?: number | null
          notes?: string | null
          phone?: string | null
          quantity?: number | null
          status?: string
          tier?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          affiliate_link?: string | null
          company_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          instagram?: string | null
          monetary_value?: number | null
          notes?: string | null
          phone?: string | null
          quantity?: number | null
          status?: string
          tier?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          created_at: string
          event_id: string
          favorite_moment: string | null
          guest_id: string | null
          id: string
          overall_rating: number
          respondent_email: string | null
          respondent_name: string | null
          suggestions: string | null
          would_attend_again: boolean | null
        }
        Insert: {
          created_at?: string
          event_id: string
          favorite_moment?: string | null
          guest_id?: string | null
          id?: string
          overall_rating: number
          respondent_email?: string | null
          respondent_name?: string | null
          suggestions?: string | null
          would_attend_again?: boolean | null
        }
        Update: {
          created_at?: string
          event_id?: string
          favorite_moment?: string | null
          guest_id?: string | null
          id?: string
          overall_rating?: number
          respondent_email?: string | null
          respondent_name?: string | null
          suggestions?: string | null
          would_attend_again?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_tiers: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          display_order: number
          event_id: string
          id: string
          name: string
          price: number
          sales_end_date: string | null
          sales_end_time: string | null
          sold_count: number
          status: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          display_order?: number
          event_id: string
          id?: string
          name: string
          price?: number
          sales_end_date?: string | null
          sales_end_time?: string | null
          sold_count?: number
          status?: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          display_order?: number
          event_id?: string
          id?: string
          name?: string
          price?: number
          sales_end_date?: string | null
          sales_end_time?: string | null
          sold_count?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_tiers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "partner"
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
      app_role: ["admin", "partner"],
    },
  },
} as const
