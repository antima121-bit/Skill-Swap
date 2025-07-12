import { supabase, isSupabaseConfigured } from "./supabase"
import type { User, SwapRequest, Message, ActiveSwap } from "./supabase"

// Mock data for when Supabase is not configured
const mockUsers: User[] = [
  {
    id: "1",
    email: "arjun.sharma@example.com",
    name: "Arjun Sharma",
    location: "Bangalore, Karnataka",
    bio: "Full-stack developer passionate about creating innovative solutions",
    hourly_rate: "₹500",
    availability: "Evenings, Weekends",
    rating: 4.8,
    completed_swaps: 12,
    is_public: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    avatar_url: "/images/person-avatar.png", // Updated avatar URL
    user_skills_offered: [{ skill: { id: "react", name: "React" } }, { skill: { id: "nodejs", name: "Node.js" } }],
    user_skills_wanted: [
      { skill: { id: "ui-ux-design", name: "UI/UX Design" } },
      { skill: { id: "figma", name: "Figma" } },
    ],
  },
  {
    id: "2",
    email: "priya.patel@example.com",
    name: "Priya Patel",
    location: "Mumbai, Maharashtra",
    bio: "Graphic designer wanting to transition into data science",
    hourly_rate: "₹400",
    availability: "Weekdays after 6PM",
    rating: 4.9,
    completed_swaps: 8,
    is_public: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    avatar_url: "/images/person-avatar.png", // Updated avatar URL
    user_skills_offered: [
      { skill: { id: "photoshop", name: "Photoshop" } },
      { skill: { id: "illustrator", name: "Illustrator" } },
    ],
    user_skills_wanted: [
      { skill: { id: "python", name: "Python" } },
      { skill: { id: "data-analysis", name: "Data Analysis" } },
    ],
  },
  {
    id: "3",
    email: "rajesh.kumar@example.com",
    name: "Rajesh Kumar",
    location: "Delhi, NCR",
    bio: "Marketing professional looking to learn coding",
    hourly_rate: "₹350",
    availability: "Flexible schedule",
    rating: 4.7,
    completed_swaps: 15,
    is_public: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    avatar_url: "/images/person-avatar.png", // Updated avatar URL
    user_skills_offered: [
      { skill: { id: "digital-marketing", name: "Digital Marketing" } },
      { skill: { id: "seo", name: "SEO" } },
    ],
    user_skills_wanted: [
      { skill: { id: "web-development", name: "Web Development" } },
      { skill: { id: "javascript", name: "JavaScript" } },
    ],
  },
  {
    id: "4",
    email: "sneha.reddy@example.com",
    name: "Sneha Reddy",
    location: "Hyderabad, Telangana",
    bio: "Data scientist interested in mobile app development",
    hourly_rate: "₹600",
    availability: "Weekends",
    rating: 4.6,
    completed_swaps: 6,
    is_public: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    avatar_url: "/images/person-avatar.png", // Updated avatar URL
    user_skills_offered: [
      { skill: { id: "python", name: "Python" } },
      { skill: { id: "machine-learning", name: "Machine Learning" } },
    ],
    user_skills_wanted: [
      { skill: { id: "mobile-development", name: "Mobile Development" } },
      { skill: { id: "flutter", name: "Flutter" } },
    ],
  },
  {
    id: "5",
    email: "vikram.singh@example.com",
    name: "Vikram Singh",
    location: "Pune, Maharashtra",
    bio: "Video editor looking to expand into 3D animation",
    hourly_rate: "₹450",
    availability: "Evenings",
    rating: 4.8,
    completed_swaps: 10,
    is_public: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    avatar_url: "/images/person-avatar.png", // Updated avatar URL
    user_skills_offered: [
      { skill: { id: "video-editing", name: "Video Editing" } },
      { skill: { id: "after-effects", name: "After Effects" } },
    ],
    user_skills_wanted: [
      { skill: { id: "3d-modeling", name: "3D Modeling" } },
      { skill: { id: "blender", name: "Blender" } },
    ],
  },
  {
    id: "6",
    email: "kavya.nair@example.com",
    name: "Kavya Nair",
    location: "Chennai, Tamil Nadu",
    bio: "Project manager transitioning to product management",
    hourly_rate: "₹550",
    availability: "Flexible",
    rating: 4.9,
    completed_swaps: 14,
    is_public: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    avatar_url: "/images/person-avatar.png", // Updated avatar URL
    user_skills_offered: [
      { skill: { id: "project-management", name: "Project Management" } },
      { skill: { id: "agile", name: "Agile" } },
    ],
    user_skills_wanted: [
      { skill: { id: "product-design", name: "Product Design" } },
      { skill: { id: "user-research", name: "User Research" } },
    ],
  },
]

const mockSwapRequests = {
  pending: [
    {
      id: "1",
      requester_id: "2",
      recipient_id: "1",
      skill_offered_id: "photoshop",
      skill_wanted_id: "react",
      message: "Hi! I'd love to learn React from you. I can teach you Photoshop in return.",
      status: "pending" as const,
      hourly_rate: "₹400",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      requester: mockUsers[1], // Priya Patel
      recipient: mockUsers[0], // Arjun Sharma
      skill_offered: { id: "photoshop", name: "Photoshop" },
      skill_wanted: { id: "react", name: "React" },
    },
    {
      id: "2",
      requester_id: "1",
      recipient_id: "3",
      skill_offered_id: "react",
      skill_wanted_id: "marketing",
      message: "I'm interested in learning digital marketing and can teach you React.",
      status: "pending" as const,
      hourly_rate: "₹500",
      created_at: "2024-01-14T15:30:00Z",
      updated_at: "2024-01-14T15:30:00Z",
      requester: mockUsers[0], // Arjun Sharma
      recipient: mockUsers[2], // Rajesh Kumar
      skill_offered: { id: "react", name: "React" },
      skill_wanted: { id: "marketing", name: "Digital Marketing" },
    },
  ],
  active: [
    {
      id: "3",
      swap_request_id: "old-request-1",
      user1_id: "1",
      user2_id: "4",
      skill1_id: "typescript",
      skill2_id: "python",
      status: "active" as const,
      next_session: "2024-01-20T14:00:00Z",
      total_sessions: 3,
      created_at: "2024-01-10T09:00:00Z",
      updated_at: "2024-01-10T09:00:00Z",
      user1: mockUsers[0], // Arjun Sharma
      user2: mockUsers[3], // Sneha Reddy
      skill1: { id: "typescript", name: "TypeScript" },
      skill2: { id: "python", name: "Python" },
    },
  ],
  completed: [
    {
      id: "4",
      requester_id: "1",
      recipient_id: "5",
      skill_offered_id: "nodejs",
      skill_wanted_id: "video-editing",
      message: "Great experience learning video editing!",
      status: "accepted" as const,
      hourly_rate: "₹450",
      created_at: "2024-01-05T12:00:00Z",
      updated_at: "2024-01-08T16:00:00Z",
      requester: mockUsers[0], // Arjun Sharma
      recipient: mockUsers[4], // Vikram Singh
      skill_offered: { id: "nodejs", name: "Node.js" },
      skill_wanted: { id: "video-editing", name: "Video Editing" },
      rating: 5,
      feedback: "Excellent teacher, very patient and knowledgeable.",
    },
    {
      id: "5",
      requester_id: "6",
      recipient_id: "1",
      skill_offered_id: "project-management",
      skill_wanted_id: "react",
      message: "Thanks for the great React lessons!",
      status: "accepted" as const,
      hourly_rate: "₹550",
      created_at: "2023-12-28T10:00:00Z",
      updated_at: "2024-01-02T14:00:00Z",
      requester: mockUsers[5], // Kavya Nair
      recipient: mockUsers[0], // Arjun Sharma
      skill_offered: { id: "project-management", name: "Project Management" },
      skill_wanted: { id: "react", name: "React" },
      rating: 4,
      feedback: "Very helpful sessions, learned a lot about React fundamentals.",
    },
  ],
}

// User operations
export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    // Return mock current user for demo
    return mockUsers[0]
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        user_skills_offered(skill_id, skill(name)),
        user_skills_wanted(skill_id, skill(name))
      `,
      )
      .eq("id", user.id) // Use user.id directly
      .single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return mockUsers[0] // Fallback to mock user
  }
}

export async function getUserById(id: string): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return mockUsers.find((user) => user.id === id) || null
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        user_skills_offered(skill_id, skill(name)),
        user_skills_wanted(skill_id, skill(name))
      `,
      )
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching user by ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserById:", error)
    return mockUsers.find((user) => user.id === id) || null
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    console.log("Mock: Updating user", id, updates)
    return mockUsers.find((user) => user.id === id) || null
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateUser:", error)
    return null
  }
}

// Swap request operations
export async function createSwapRequest(request: {
  recipient_id: string
  skill_offered_id: string
  skill_wanted_id: string
  message?: string
  hourly_rate?: string
}): Promise<SwapRequest | null> {
  if (!isSupabaseConfigured()) {
    console.log("Mock: Creating swap request", request)
    return {
      id: Date.now().toString(),
      requester_id: "1",
      ...request,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return null

    const { data, error } = await supabase
      .from("swap_requests")
      .insert({
        requester_id: currentUser.id,
        ...request,
      })
      .select(
        `
        *,
        requester:users!requester_id(*),
        recipient:users!recipient_id(*),
        skill_offered:skills!skill_offered_id(*),
        skill_wanted:skills!skill_wanted_id(*)
      `,
      )
      .single()

    if (error) {
      console.error("Error creating swap request:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createSwapRequest:", error)
    return null
  }
}

export async function getSwapRequests(userId: string): Promise<{
  pending: SwapRequest[]
  active: ActiveSwap[]
  completed: SwapRequest[]
}> {
  if (!isSupabaseConfigured()) {
    return mockSwapRequests
  }

  try {
    // Get pending requests
    const { data: pendingData, error: pendingError } = await supabase
      .from("swap_requests")
      .select(
        `
        *,
        requester:users!requester_id(*),
        recipient:users!recipient_id(*),
        skill_offered:skills!skill_offered_id(*),
        skill_wanted:skills!skill_wanted_id(*)
      `,
      )
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
      .eq("status", "pending")

    // Get active swaps
    const { data: activeData, error: activeError } = await supabase
      .from("active_swaps")
      .select(
        `
        *,
        user1:users!user1_id(*),
        user2:users!user2_id(*),
        skill1:skills!skill1_id(*),
        skill2:skills!skill2_id(*)
      `,
      )
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq("status", "active")

    // Get completed requests
    const { data: completedData, error: completedError } = await supabase
      .from("swap_requests")
      .select(
        `
        *,
        requester:users!requester_id(*),
        recipient:users!recipient_id(*),
        skill_offered:skills!skill_offered_id(*),
        skill_wanted:skills!skill_wanted_id(*)
      `,
      )
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
      .eq("status", "accepted")

    return {
      pending: pendingData || [],
      active: activeData || [],
      completed: completedData || [],
    }
  } catch (error) {
    console.error("Error in getSwapRequests:", error)
    return mockSwapRequests
  }
}

export async function updateSwapRequestStatus(
  requestId: string,
  status: "accepted" | "rejected" | "cancelled",
): Promise<SwapRequest | null> {
  if (!isSupabaseConfigured()) {
    console.log("Mock: Updating swap request status", requestId, status)
    return mockSwapRequests.pending[0] || null
  }

  try {
    const { data, error } = await supabase
      .from("swap_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", requestId)
      .select(
        `
        *,
        requester:users!requester_id(*),
        recipient:users!recipient_id(*),
        skill_offered:skills!skill_offered_id(*),
        skill_wanted:skills!skill_wanted_id(*)
      `,
      )
      .single()

    if (error) {
      console.error("Error updating swap request:", error)
      return null
    }

    // If accepted, create active swap
    if (status === "accepted") {
      await createActiveSwap(data)
    }

    return data
  } catch (error) {
    console.error("Error in updateSwapRequestStatus:", error)
    return null
  }
}

export async function createActiveSwap(swapRequest: SwapRequest): Promise<ActiveSwap | null> {
  if (!isSupabaseConfigured()) {
    console.log("Mock: Creating active swap", swapRequest)
    return null
  }

  try {
    const { data, error } = await supabase
      .from("active_swaps")
      .insert({
        swap_request_id: swapRequest.id,
        user1_id: swapRequest.requester_id,
        user2_id: swapRequest.recipient_id,
        skill1_id: swapRequest.skill_offered_id,
        skill2_id: swapRequest.skill_wanted_id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating active swap:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createActiveSwap:", error)
    return null
  }
}

// Message operations
export async function sendMessage(
  recipientId: string,
  content: string,
  swapRequestId?: string,
): Promise<Message | null> {
  if (!isSupabaseConfigured()) {
    console.log("Mock: Sending message", { recipientId, content })
    return {
      id: Date.now().toString(),
      sender_id: "1",
      recipient_id: recipientId,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
      swap_request_id: swapRequestId,
    }
  }

  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return null

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUser.id,
        recipient_id: recipientId,
        content,
        swap_request_id: swapRequestId,
      })
      .select(
        `
        *,
        sender:users!sender_id(*)
      `,
      )
      .single()

    if (error) {
      console.error("Error sending message:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in sendMessage:", error)
    return null
  }
}

export async function getMessages(userId: string, otherUserId: string): Promise<Message[]> {
  if (!isSupabaseConfigured()) {
    return [
      {
        id: "1",
        sender_id: userId,
        recipient_id: otherUserId,
        content: "Hello! This is a demo message.",
        is_read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        sender_id: otherUserId,
        recipient_id: userId,
        content: "Hi there! This is a demo response.",
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]
  }

  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:users!sender_id(*)
      `,
      )
      .or(
        `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`,
      )
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getMessages:", error)
    return []
  }
}

// Search operations
export async function searchUsers(
  query: string,
  filters: {
    location?: string
    availability?: string
    rating?: string
    onlineOnly?: boolean
  },
): Promise<User[]> {
  if (!isSupabaseConfigured()) {
    let filteredUsers = [...mockUsers]

    if (query) {
      const lowerCaseQuery = query.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerCaseQuery) ||
          user.location?.toLowerCase().includes(lowerCaseQuery) ||
          user.bio?.toLowerCase().includes(lowerCaseQuery) ||
          user.user_skills_offered?.some((us) => us.skill?.name.toLowerCase().includes(lowerCaseQuery)) ||
          user.user_skills_wanted?.some((us) => us.skill?.name.toLowerCase().includes(lowerCaseQuery)),
      )
    }

    if (filters.location) {
      filteredUsers = filteredUsers.filter((user) =>
        user.location?.toLowerCase().includes(filters.location!.toLowerCase()),
      )
    }

    if (filters.rating) {
      const minRating = Number.parseFloat(filters.rating)
      filteredUsers = filteredUsers.filter((user) => user.rating >= minRating)
    }

    // Note: onlineOnly filter is not directly supported by mock data structure
    // If it were, you'd add:
    // if (filters.onlineOnly) {
    //   filteredUsers = filteredUsers.filter((user) => user.is_online);
    // }

    return filteredUsers
  }

  try {
    let queryBuilder = supabase
      .from("users")
      .select(
        `
        *,
        user_skills_offered(skill_id, skill(name)),
        user_skills_wanted(skill_id, skill(name))
      `,
      )
      .eq("is_public", true)

    if (filters.location) {
      queryBuilder = queryBuilder.ilike("location", `%${filters.location}%`)
    }

    if (filters.availability && filters.availability !== "any") {
      queryBuilder = queryBuilder.ilike("availability", `%${filters.availability}%`)
    }

    if (filters.rating && filters.rating !== "any") {
      queryBuilder = queryBuilder.gte("rating", Number.parseFloat(filters.rating))
    }

    // Note: Supabase does not have a direct 'is_online' column in the provided schema.
    // If you had one, you'd add:
    // if (filters.onlineOnly) {
    //   queryBuilder = queryBuilder.eq("is_online", true);
    // }

    const { data, error } = await queryBuilder

    if (error) {
      console.error("Error searching users:", error)
      return []
    }

    let finalUsers = data || []

    // Client-side filtering for skills if query is present
    if (query) {
      const lowerCaseQuery = query.toLowerCase()
      finalUsers = finalUsers.filter((user) => {
        const offeredSkills = user.user_skills_offered?.map((us) => us.skill?.name.toLowerCase()) || []
        const wantedSkills = user.user_skills_wanted?.map((us) => us.skill?.name.toLowerCase()) || []

        return (
          user.name.toLowerCase().includes(lowerCaseQuery) ||
          (user.location && user.location.toLowerCase().includes(lowerCaseQuery)) ||
          (user.bio && user.bio.toLowerCase().includes(lowerCaseQuery)) ||
          offeredSkills.some((skillName) => skillName.includes(lowerCaseQuery)) ||
          wantedSkills.some((skillName) => skillName.includes(lowerCaseQuery))
        )
      })
    }

    return finalUsers as User[]
  } catch (error) {
    console.error("Error in searchUsers:", error)
    return mockUsers // Fallback to mock users
  }
}

// Skills operations
export async function getSkills(): Promise<any[]> {
  if (!isSupabaseConfigured()) {
    return [
      { id: "react", name: "React", category: "Frontend" },
      { id: "nodejs", name: "Node.js", category: "Backend" },
      { id: "typescript", name: "TypeScript", category: "Programming Languages" },
      { id: "python", name: "Python", category: "Programming Languages" },
      { id: "ui-ux-design", name: "UI/UX Design", category: "Design" },
      { id: "figma", name: "Figma", category: "Design Tools" },
      { id: "photoshop", name: "Photoshop", category: "Design Tools" },
      { id: "illustrator", name: "Illustrator", category: "Design Tools" },
      { id: "digital-marketing", name: "Digital Marketing", category: "Marketing" },
      { id: "seo", name: "SEO", category: "Marketing" },
      { id: "content-writing", name: "Content Writing", category: "Writing" },
      { id: "machine-learning", name: "Machine Learning", category: "Data Science" },
      { id: "data-analysis", name: "Data Analysis", category: "Data Science" },
      { id: "video-editing", name: "Video Editing", category: "Media" },
      { id: "after-effects", name: "After Effects", category: "Media" },
      { id: "project-management", name: "Project Management", category: "Business" },
      { id: "agile", name: "Agile", category: "Business" },
      { id: "scrum", name: "Scrum", category: "Business" },
      { id: "mobile-development", name: "Mobile Development", category: "Development" },
      { id: "flutter", name: "Flutter", category: "Mobile Development" },
      { id: "3d-modeling", name: "3D Modeling", category: "Design" },
      { id: "blender", name: "Blender", category: "Design Tools" },
      { id: "product-design", name: "Product Design", category: "Design" },
      { id: "user-research", name: "User Research", category: "Research" },
      { id: "web-development", name: "Web Development", category: "Development" },
      { id: "javascript", name: "JavaScript", category: "Programming Languages" },
    ]
  }

  try {
    const { data, error } = await supabase.from("skills").select("*").order("name")

    if (error) {
      console.error("Error fetching skills:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getSkills:", error)
    return []
  }
}

export async function getUserSkills(userId: string): Promise<{
  offered: any[]
  wanted: any[]
}> {
  if (!isSupabaseConfigured()) {
    const user = mockUsers.find((u) => u.id === userId)
    return {
      offered: user?.user_skills_offered || [],
      wanted: user?.user_skills_wanted || [],
    }
  }

  try {
    const { data: offeredData } = await supabase
      .from("user_skills_offered")
      .select(
        `
        *,
        skill:skills(*)
      `,
      )
      .eq("user_id", userId)

    const { data: wantedData } = await supabase
      .from("user_skills_wanted")
      .select(
        `
        *,
        skill:skills(*)
      `,
      )
      .eq("user_id", userId)

    return {
      offered: offeredData || [],
      wanted: wantedData || [],
    }
  } catch (error) {
    console.error("Error in getUserSkills:", error)
    return { offered: [], wanted: [] }
  }
}
