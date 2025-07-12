import { supabase } from './supabase'

export interface Profile {
  id: string
  email: string
  name: string
  avatar_url: string | null
  location: string | null
  bio: string | null
  hourly_rate: string | null
  availability: string | null
  is_public: boolean
  rating: number | null
  completed_swaps: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string | null
}

export async function getCurrentUser(): Promise<Profile | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return null
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return null
    }

    return profile
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export async function createUserProfile(userId: string, email: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email: email,
          name: email.split('@')[0], // Default name from email
          is_public: true,
          completed_swaps: 0,
          rating: 0
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in createUserProfile:', error)
    return null
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in updateProfile:', error)
    return null
  }
}

export async function addUserSkill(userId: string, skillId: string, isOffering: boolean) {
  try {
    const table = isOffering ? 'user_skills_offered' : 'user_skills_wanted'
    const { error } = await supabase
      .from(table)
      .insert([
        {
          user_id: userId,
          skill_id: skillId
        }
      ])

    if (error) {
      console.error(`Error adding ${isOffering ? 'offered' : 'wanted'} skill:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in addUserSkill:', error)
    return false
  }
}

export async function getUserSkills(userId: string) {
  try {
    // Get skills user is offering
    const { data: offeredSkills, error: offeredError } = await supabase
      .from('user_skills_offered')
      .select(`
        skill_id,
        skills (
          id,
          name,
          category
        )
      `)
      .eq('user_id', userId)

    if (offeredError) {
      console.error('Error fetching offered skills:', offeredError)
      return null
    }

    // Get skills user wants to learn
    const { data: wantedSkills, error: wantedError } = await supabase
      .from('user_skills_wanted')
      .select(`
        skill_id,
        skills (
          id,
          name,
          category
        )
      `)
      .eq('user_id', userId)

    if (wantedError) {
      console.error('Error fetching wanted skills:', wantedError)
      return null
    }

    return {
      offering: offeredSkills.map(s => s.skills),
      learning: wantedSkills.map(s => s.skills)
    }
  } catch (error) {
    console.error('Error in getUserSkills:', error)
    return null
  }
}

export async function getAllSkills() {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching skills:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Error in getAllSkills:', error)
    return []
  }
}
