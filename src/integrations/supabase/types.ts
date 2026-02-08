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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_number: string
          certificate_type: string
          created_at: string
          id: string
          issued_at: string
          learner_name: string
          stage_name: string
          user_id: string
        }
        Insert: {
          certificate_number: string
          certificate_type: string
          created_at?: string
          id?: string
          issued_at?: string
          learner_name: string
          stage_name: string
          user_id: string
        }
        Update: {
          certificate_number?: string
          certificate_type?: string
          created_at?: string
          id?: string
          issued_at?: string
          learner_name?: string
          stage_name?: string
          user_id?: string
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          course_id: string
          enrolled_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          aligned_certifications: string[] | null
          career_roles: Json | null
          code: string
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          level: number
          order_index: number
          required_tier_level: number
          skills: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          aligned_certifications?: string[] | null
          career_roles?: Json | null
          code: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          level?: number
          order_index?: number
          required_tier_level?: number
          skills?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          aligned_certifications?: string[] | null
          career_roles?: Json | null
          code?: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          level?: number
          order_index?: number
          required_tier_level?: number
          skills?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content_markdown: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          module_id: string
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content_markdown?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          module_id: string
          order_index?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content_markdown?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          module_id?: string
          order_index?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order_index: number
          skills: Json | null
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          skills?: Json | null
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          skills?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_snapshots: {
        Row: {
          certification_goals: Json | null
          courses_completed: Json | null
          created_at: string
          display_name: string
          skills: Json | null
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          certification_goals?: Json | null
          courses_completed?: Json | null
          created_at?: string
          display_name: string
          skills?: Json | null
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          certification_goals?: Json | null
          courses_completed?: Json | null
          created_at?: string
          display_name?: string
          skills?: Json | null
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_question_options: {
        Row: {
          id: string
          is_correct: boolean
          option_text: string
          order_index: number
          question_id: string
        }
        Insert: {
          id?: string
          is_correct?: boolean
          option_text: string
          order_index?: number
          question_id: string
        }
        Update: {
          id?: string
          is_correct?: boolean
          option_text?: string
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          order_index: number
          question_text: string
          question_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          order_index?: number
          question_text: string
          question_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          order_index?: number
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          created_at: string
          icon: string | null
          id: string
          max_level: number
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          icon?: string | null
          id?: string
          max_level?: number
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          icon?: string | null
          id?: string
          max_level?: number
          name?: string
        }
        Relationships: []
      }
      stage_requirements: {
        Row: {
          career_roles: Json | null
          created_at: string
          id: string
          min_assessment_score: number
          prerequisite_stage: string | null
          required_courses: string[] | null
          stage_key: string
          stage_level: number
          stage_name: string
        }
        Insert: {
          career_roles?: Json | null
          created_at?: string
          id?: string
          min_assessment_score?: number
          prerequisite_stage?: string | null
          required_courses?: string[] | null
          stage_key: string
          stage_level: number
          stage_name: string
        }
        Update: {
          career_roles?: Json | null
          created_at?: string
          id?: string
          min_assessment_score?: number
          prerequisite_stage?: string | null
          required_courses?: string[] | null
          stage_key?: string
          stage_level?: number
          stage_name?: string
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          created_at: string
          features: Json | null
          id: string
          level: number
          name: string
          price_zar: number
        }
        Insert: {
          created_at?: string
          features?: Json | null
          id?: string
          level: number
          name: string
          price_zar: number
        }
        Update: {
          created_at?: string
          features?: Json | null
          id?: string
          level?: number
          name?: string
          price_zar?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          starts_at: string
          status: string
          tier_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          starts_at?: string
          status?: string
          tier_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          starts_at?: string
          status?: string
          tier_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certification_goals: {
        Row: {
          certification_slug: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          certification_slug: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          certification_slug?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_attempts: {
        Row: {
          attempted_at: string
          id: string
          lesson_id: string
          passed: boolean
          score: number
          total_questions: number
          user_id: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          lesson_id: string
          passed?: boolean
          score?: number
          total_questions?: number
          user_id: string
        }
        Update: {
          attempted_at?: string
          id?: string
          lesson_id?: string
          passed?: boolean
          score?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
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
      user_skills: {
        Row: {
          current_level: number
          id: string
          skill_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          current_level?: number
          id?: string
          skill_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          current_level?: number
          id?: string
          skill_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stage_completions: {
        Row: {
          average_score: number
          completed_at: string
          id: string
          stage_key: string
          user_id: string
        }
        Insert: {
          average_score?: number
          completed_at?: string
          id?: string
          stage_key: string
          user_id: string
        }
        Update: {
          average_score?: number
          completed_at?: string
          id?: string
          stage_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stage_completions_stage_key_fkey"
            columns: ["stage_key"]
            isOneToOne: false
            referencedRelation: "stage_requirements"
            referencedColumns: ["stage_key"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tier_level: { Args: { _user_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student"
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
      app_role: ["admin", "student"],
    },
  },
} as const
