"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MessageCircle, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { getUserById, getUserSkills, getCurrentUser } from "@/lib/database"
import type { User } from "@/lib/supabase"

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const [user, setUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [skills, setSkills] = useState<{ offered: any[]; wanted: any[] }>({ offered: [], wanted: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    try {
      const [userData, currentUserData, skillsData] = await Promise.all([
        getUserById(userId),
        getCurrentUser(),
        getUserSkills(userId),
      ])

      setUser(userData)
      setCurrentUser(currentUserData)
      setSkills(skillsData)
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (currentUser && user) {
      router.push(`/chat/${user.id}`)
    }
  }

  const handleSendSwapRequest = () => {
    if (currentUser && user) {
      router.push(`/swap-request/${user.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-white font-bold">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-white font-bold">User not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-black/30 border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              variant="ghost"
              className="text-white hover:bg-green-500/20 font-black"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <Logo className="w-10 h-10" />
              <span className="text-white font-black text-xl tracking-wide">Skill Swap India</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/search">
                <Button variant="ghost" className="text-white hover:bg-green-500/20 font-black">
                  Browse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <Avatar className="w-32 h-32 ring-4 ring-green-500/30">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-black">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-black text-white mb-2">{user.name}</h1>
                <div className="flex items-center space-x-4 text-gray-300 mb-4 font-bold">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{user.rating}</span>
                  </div>
                  <span>{user.completed_swaps} swaps completed</span>
                  <span className="text-green-400">{user.hourly_rate}/hour</span>
                </div>
                <p className="text-gray-300 mb-4 font-bold">{user.bio}</p>
                <p className="text-gray-300 font-bold">Available: {user.availability}</p>
              </div>

              {/* Action Buttons */}
              {currentUser && currentUser.id !== user.id && (
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleSendSwapRequest}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black"
                  >
                    Send Swap Request
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    variant="outline"
                    className="border-green-500/30 text-white hover:bg-green-500/20 font-black bg-transparent"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Skills Offered */}
          <Card className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-white font-black">Skills Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.offered.map((userSkill, index) => (
                  <Badge
                    key={index}
                    className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 font-black"
                  >
                    {userSkill.skill.name}
                  </Badge>
                ))}
                {skills.offered.length === 0 && <p className="text-gray-400 font-bold">No skills listed</p>}
              </div>
            </CardContent>
          </Card>

          {/* Skills Wanted */}
          <Card className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-white font-black">Skills Wanted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.wanted.map((userSkill, index) => (
                  <Badge
                    key={index}
                    className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 font-black"
                  >
                    {userSkill.skill.name}
                  </Badge>
                ))}
                {skills.wanted.length === 0 && <p className="text-gray-400 font-bold">No skills listed</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
