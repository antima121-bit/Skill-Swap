import { createClient } from "@supabase/supabase-js"

// Use fallback values for development/preview
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Create client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Enable session persistence
  },
})

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Types
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  location?: string
  bio?: string
  hourly_rate?: string
  availability?: string
  is_public: boolean
  rating: number
  completed_swaps: number
  created_at: string
  updated_at: string
  user_skills_offered?: { skill_id: string; skill?: Skill }[] // Add skills to User type
  user_skills_wanted?: { skill_id: string; skill?: Skill }[] // Add skills to User type
}

export interface Skill {
  id: string
  name: string
  category?: string
}

export interface SwapRequest {
  id: string
  requester_id: string
  recipient_id: string
  skill_offered_id: string
  skill_wanted_id: string
  message?: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  hourly_rate?: string
  created_at: string
  updated_at: string
  requester?: User
  recipient?: User
  skill_offered?: Skill
  skill_wanted?: Skill
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  swap_request_id?: string
  content: string
  is_read: boolean
  created_at: string
  sender?: User
}

export interface ActiveSwap {
  id: string
  swap_request_id: string
  user1_id: string
  user2_id: string
  skill1_id: string
  skill2_id: string
  status: "active" | "completed" | "cancelled"
  next_session?: string
  total_sessions: number
  created_at: string
  updated_at: string
  user1?: User // Add user relations
  user2?: User // Add user relations
  skill1?: Skill // Add skill relations
  skill2?: Skill // Add skill relations
}
