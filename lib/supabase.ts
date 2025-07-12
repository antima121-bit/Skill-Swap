import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          bio: string | null
          location: string | null
          hourly_rate: number | null
          rating: number | null
          completed_swaps: number
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          location?: string | null
          hourly_rate?: number | null
          rating?: number | null
          completed_swaps?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          location?: string | null
          hourly_rate?: number | null
          rating?: number | null
          completed_swaps?: number
        }
      }
      skills: {
        Row: {
          id: string
          created_at: string
          name: string
          category: string | null
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          category?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          category?: string | null
          description?: string | null
        }
      }
      user_skills: {
        Row: {
          id: string
          created_at: string
          user_id: string
          skill_id: string
          proficiency_level: number
          is_offering: boolean
          is_learning: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          skill_id: string
          proficiency_level?: number
          is_offering?: boolean
          is_learning?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          skill_id?: string
          proficiency_level?: number
          is_offering?: boolean
          is_learning?: boolean
        }
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
  }
}
