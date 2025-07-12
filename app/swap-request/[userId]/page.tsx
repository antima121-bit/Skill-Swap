"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"
import { useParams, useRouter } from "next/navigation"
import { getUserById, getCurrentUser, getUserSkills, createSwapRequest } from "@/lib/database"
import type { User } from "@/lib/supabase"

export default function SwapRequestPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const [user, setUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userSkills, setUserSkills] = useState<{ offered: any[]; wanted: any[] }>({ offered: [], wanted: [] })
  const [currentUserSkills, setCurrentUserSkills] = useState<{ offered: any[]; wanted: any[] }>({
    offered: [],
    wanted: [],
  })
  const [selectedSkillOffered, setSelectedSkillOffered] = useState("")
  const [selectedSkillWanted, setSelectedSkillWanted] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      const [userData, currentUserData] = await Promise.all([getUserById(userId), getCurrentUser()])

      if (userData && currentUserData) {
        setUser(userData)
        setCurrentUser(currentUserData)

        const [userSkillsData, currentUserSkillsData] = await Promise.all([
          getUserSkills(userId),
          getUserSkills(currentUserData.id),
        ])

        setUserSkills(userSkillsData)
        setCurrentUserSkills(currentUserSkillsData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSkillOffered || !selectedSkillWanted || !currentUser) return

    setSubmitting(true)
    try {
      const request = await createSwapRequest({
        recipient_id: userId,
        skill_offered_id: selectedSkillOffered,
        skill_wanted_id: selectedSkillWanted,
        message: message.trim(),
        hourly_rate: currentUser.hourly_rate,
      })

      if (request) {
        router.push("/swaps")
      }
    } catch (error) {
      console.error("Error creating swap request:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-white font-bold">Loading...</div>
      </div>
    )
  }

  if (!user || !currentUser) {
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
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-white font-black text-center">Send Swap Request</CardTitle>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <Avatar className="w-12 h-12 ring-2 ring-green-500/30">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-black">{user.name}</h3>
                <p className="text-gray-300 font-bold text-sm">{user.location}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Skill You Offer */}
              <div>
                <Label className="text-white font-black mb-2 block">Skill You Offer</Label>
                <Select value={selectedSkillOffered} onValueChange={setSelectedSkillOffered}>
                  <SelectTrigger className="bg-black/30 backdrop-blur-md border-green-500/30 text-white rounded-xl font-bold">
                    <SelectValue placeholder="Select a skill you can teach" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUserSkills.offered.map((userSkill) => (
                      <SelectItem key={userSkill.skill.id} value={userSkill.skill.id}>
                        {userSkill.skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentUserSkills.offered.length === 0 && (
                  <p className="text-gray-400 text-sm mt-1 font-bold">You need to add skills to your profile first</p>
                )}
              </div>

              {/* Skill You Want */}
              <div>
                <Label className="text-white font-black mb-2 block">Skill You Want to Learn</Label>
                <Select value={selectedSkillWanted} onValueChange={setSelectedSkillWanted}>
                  <SelectTrigger className="bg-black/30 backdrop-blur-md border-green-500/30 text-white rounded-xl font-bold">
                    <SelectValue placeholder="Select a skill you want to learn" />
                  </SelectTrigger>
                  <SelectContent>
                    {userSkills.offered.map((userSkill) => (
                      <SelectItem key={userSkill.skill.id} value={userSkill.skill.id}>
                        {userSkill.skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div>
                <Label className="text-white font-black mb-2 block">Message (Optional)</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself and explain why you'd like to swap skills..."
                  className="bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-xl font-bold"
                  rows={4}
                />
              </div>

              {/* Rate Display */}
              <div className="bg-black/20 rounded-xl p-4">
                <Label className="text-white font-black mb-2 block">Your Rate</Label>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-black">
                  {currentUser.hourly_rate}/hour
                </Badge>
              </div>

              <Button
                type="submit"
                disabled={!selectedSkillOffered || !selectedSkillWanted || submitting}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black"
              >
                {submitting ? (
                  "Sending Request..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Swap Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
