"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Award, MessageSquare } from "lucide-react"
import { getCurrentUser, getUserById } from "@/lib/database"

// Reuse the mock skills from browse page
const SKILLS = [
  "React", "Node.js", "Python", "JavaScript", "TypeScript",
  "UI/UX Design", "Digital Marketing", "Content Writing",
  "Data Analysis", "Machine Learning"
]

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Get current user
        const current = await getCurrentUser()
        setCurrentUser(current)
        
        // Get profile user data
        const profileUser = await getUserById(userId as string)
        if (profileUser) {
          setUser(profileUser)
        } else {
          console.error("User not found")
        }
      } catch (error) {
        console.error("Error loading user:", error)
      }
      setLoading(false)
    }

    loadData()
  }, [userId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-secondary" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-secondary rounded" />
                  <div className="h-3 w-24 bg-secondary rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold">User not found</h2>
            <p className="text-muted-foreground mt-2">The user you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/browse")} className="mt-4">
              Browse Members
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>
                  {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.full_name}</h1>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="font-medium">{user.rating}</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-primary mr-1" />
                <span className="font-medium">{user.completed_swaps} swaps</span>
              </div>
              {currentUser?.id !== user.id && (
                <Button className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold mb-4">Skills Offering</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills_offering.map((skill: string) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Looking to Learn</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills_learning.map((skill: string) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>

          {currentUser?.id !== user.id && (
            <div className="mt-8">
              <Button size="lg" className="w-full md:w-auto">
                Request Skill Swap
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {user.bio || "No bio provided yet."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {user.availability || "Availability not specified."}
            </p>
            {user.hourly_rate && (
              <p className="mt-2 font-medium">
                Rate: ₹{user.hourly_rate}/hour
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Mock data generator for a single user
function getMockUser(userId: string) {
  return {
    id: userId,
    full_name: `User ${userId.split('-')[1]}`,
    username: `user${userId.split('-')[1]}`,
    avatar_url: null,
    location: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"][Math.floor(Math.random() * 5)],
    skills_offering: getRandomSkills(),
    skills_learning: getRandomSkills(),
    rating: (Math.random() * 2 + 3).toFixed(1),
    completed_swaps: Math.floor(Math.random() * 20),
    bio: "I am a passionate professional looking to exchange skills and knowledge with others in the community.",
    availability: "Weekdays after 6 PM IST, Weekends flexible",
    hourly_rate: Math.floor(Math.random() * 500) + 500,
  }
}

function getRandomSkills() {
  const shuffled = [...SKILLS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 1)
}
