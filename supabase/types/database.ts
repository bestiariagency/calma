// Generado con mcp__supabase__generate_typescript_types (proyecto lgiajkdvuftvtincbqzi).
// Solo referencia: no editar a mano; regenerar tras cambios de esquema.
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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      content_revisions: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: number
          key: string
          snapshot: Json
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: never
          key: string
          snapshot: Json
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: never
          key?: string
          snapshot?: Json
        }
        Relationships: []
      }
      media: {
        Row: {
          alt: string
          blurhash: string | null
          bytes: number
          created_at: string
          created_by: string | null
          height: number
          id: string
          mime: string
          path: string
          updated_at: string
          width: number
        }
        Insert: {
          alt?: string
          blurhash?: string | null
          bytes: number
          created_at?: string
          created_by?: string | null
          height: number
          id?: string
          mime: string
          path: string
          updated_at?: string
          width: number
        }
        Update: {
          alt?: string
          blurhash?: string | null
          bytes?: number
          created_at?: string
          created_by?: string | null
          height?: number
          id?: string
          mime?: string
          path?: string
          updated_at?: string
          width?: number
        }
        Relationships: []
      }
      section_content: {
        Row: {
          content: Json
          key: string
          schema_version: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content: Json
          key: string
          schema_version?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          key?: string
          schema_version?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string
          city: string
          email: string
          id: boolean
          maps_url: string
          name: string
          opening_hours: string
          phone: string
          region: string
          social: Json
          tagline: string
          updated_at: string
          updated_by: string | null
          whatsapp: string
          whatsapp_message: string
        }
        Insert: {
          address?: string
          city?: string
          email: string
          id?: boolean
          maps_url?: string
          name: string
          opening_hours?: string
          phone: string
          region?: string
          social?: Json
          tagline?: string
          updated_at?: string
          updated_by?: string | null
          whatsapp: string
          whatsapp_message?: string
        }
        Update: {
          address?: string
          city?: string
          email?: string
          id?: boolean
          maps_url?: string
          name?: string
          opening_hours?: string
          phone?: string
          region?: string
          social?: Json
          tagline?: string
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string
          whatsapp_message?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_site_content: { Args: never; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      list_orphan_media: {
        Args: never
        Returns: {
          bytes: number
          created_at: string
          media_id: string | null
          path: string
          reason: string
        }[]
      }
      media_usage: {
        Args: never
        Returns: {
          media_id: string
          path: string
          used_in: string[]
          uses: number
        }[]
      }
      restore_revision: { Args: { p_revision_id: number }; Returns: Json }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
