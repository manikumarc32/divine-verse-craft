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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          body: string | null
          category: string
          created_at: string
          excerpt: string
          id: string
          is_published: boolean | null
          published_at: string
          read_time_min: number
          slug: string
          title: string
        }
        Insert: {
          body?: string | null
          category: string
          created_at?: string
          excerpt: string
          id?: string
          is_published?: boolean | null
          published_at?: string
          read_time_min?: number
          slug: string
          title: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          excerpt?: string
          id?: string
          is_published?: boolean | null
          published_at?: string
          read_time_min?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      bundle_items: {
        Row: {
          bundle_id: string
          id: string
          product_id: string
          quantity: number
          sort_order: number | null
        }
        Insert: {
          bundle_id: string
          id?: string
          product_id: string
          quantity?: number
          sort_order?: number | null
        }
        Update: {
          bundle_id?: string
          id?: string
          product_id?: string
          quantity?: number
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bundles: {
        Row: {
          badge: string | null
          bundle_price: number
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          bundle_price: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          bundle_price?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      custom_quote_drafts: {
        Row: {
          created_at: string
          id: string
          payload: Json
          preview_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload: Json
          preview_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          preview_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      frames: {
        Row: {
          code: string
          id: string
          label: string
          price_modifier: number
          sort_order: number | null
        }
        Insert: {
          code: string
          id?: string
          label: string
          price_modifier?: number
          sort_order?: number | null
        }
        Update: {
          code?: string
          id?: string
          label?: string
          price_modifier?: number
          sort_order?: number | null
        }
        Relationships: []
      }
      india_signups: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          code: string
          id: string
          label: string
          price_modifier: number
          sort_order: number | null
        }
        Insert: {
          code: string
          id?: string
          label: string
          price_modifier?: number
          sort_order?: number | null
        }
        Update: {
          code?: string
          id?: string
          label?: string
          price_modifier?: number
          sort_order?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          custom_data: Json | null
          frame_code: string | null
          id: string
          is_custom: boolean | null
          language_code: string | null
          line_total: number
          material_code: string | null
          order_id: string
          product_id: string | null
          product_title: string
          quantity: number
          size_code: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          custom_data?: Json | null
          frame_code?: string | null
          id?: string
          is_custom?: boolean | null
          language_code?: string | null
          line_total: number
          material_code?: string | null
          order_id: string
          product_id?: string | null
          product_title: string
          quantity?: number
          size_code?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string
          custom_data?: Json | null
          frame_code?: string | null
          id?: string
          is_custom?: boolean | null
          language_code?: string | null
          line_total?: number
          material_code?: string | null
          order_id?: string
          product_id?: string | null
          product_title?: string
          quantity?: number
          size_code?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          currency: string
          email: string
          full_name: string
          id: string
          phone: string | null
          postcode: string
          shipping_cost: number
          shipping_zone: string
          status: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          currency?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          postcode: string
          shipping_cost?: number
          shipping_zone: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          subtotal: number
          total: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          currency?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          postcode?: string
          shipping_cost?: number
          shipping_zone?: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: Database["public"]["Enums"]["product_badge"] | null
          base_price: number
          category: Database["public"]["Enums"]["product_category"]
          chapter_ref: string | null
          created_at: string
          deeper_meaning: string | null
          deeper_meaning_te: string | null
          description: string | null
          english_meaning: string | null
          full_text_en: string | null
          full_text_te: string | null
          hero_image_url: string | null
          id: string
          is_active: boolean | null
          layout_mode: string
          rating: number | null
          review_count: number | null
          sanskrit: string | null
          slug: string
          sold_count: number
          sort_order: number | null
          stock_limit: number | null
          telugu_meaning: string | null
          title: string
          updated_at: string
        }
        Insert: {
          badge?: Database["public"]["Enums"]["product_badge"] | null
          base_price: number
          category: Database["public"]["Enums"]["product_category"]
          chapter_ref?: string | null
          created_at?: string
          deeper_meaning?: string | null
          deeper_meaning_te?: string | null
          description?: string | null
          english_meaning?: string | null
          full_text_en?: string | null
          full_text_te?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean | null
          layout_mode?: string
          rating?: number | null
          review_count?: number | null
          sanskrit?: string | null
          slug: string
          sold_count?: number
          sort_order?: number | null
          stock_limit?: number | null
          telugu_meaning?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          badge?: Database["public"]["Enums"]["product_badge"] | null
          base_price?: number
          category?: Database["public"]["Enums"]["product_category"]
          chapter_ref?: string | null
          created_at?: string
          deeper_meaning?: string | null
          deeper_meaning_te?: string | null
          description?: string | null
          english_meaning?: string | null
          full_text_en?: string | null
          full_text_te?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean | null
          layout_mode?: string
          rating?: number | null
          review_count?: number | null
          sanskrit?: string | null
          slug?: string
          sold_count?: number
          sort_order?: number | null
          stock_limit?: number | null
          telugu_meaning?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          author_name: string
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          user_id?: string | null
        }
        Update: {
          author_name?: string
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_zones: {
        Row: {
          code: string
          flag: string
          free_threshold: number
          id: string
          label: string
          price: number
          sort_order: number | null
        }
        Insert: {
          code: string
          flag: string
          free_threshold: number
          id?: string
          label: string
          price: number
          sort_order?: number | null
        }
        Update: {
          code?: string
          flag?: string
          free_threshold?: number
          id?: string
          label?: string
          price?: number
          sort_order?: number | null
        }
        Relationships: []
      }
      sizes: {
        Row: {
          code: string
          id: string
          label: string
          price_modifier: number
          sort_order: number | null
        }
        Insert: {
          code: string
          id?: string
          label: string
          price_modifier?: number
          sort_order?: number | null
        }
        Update: {
          code?: string
          id?: string
          label?: string
          price_modifier?: number
          sort_order?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "customer" | "admin" | "super_admin"
      order_status:
        | "pending"
        | "paid"
        | "fulfilled"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      product_badge: "best_seller" | "new" | "premium" | "hand_written"
      product_category:
        | "gita_quote"
        | "god_portrait"
        | "symbol"
        | "hand_written"
        | "ramayana_quote"
        | "ramayana_scene"
        | "hanuman_chalisa"
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
      app_role: ["customer", "admin", "super_admin"],
      order_status: [
        "pending",
        "paid",
        "fulfilled",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      product_badge: ["best_seller", "new", "premium", "hand_written"],
      product_category: [
        "gita_quote",
        "god_portrait",
        "symbol",
        "hand_written",
        "ramayana_quote",
        "ramayana_scene",
        "hanuman_chalisa",
      ],
    },
  },
} as const
