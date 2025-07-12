"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserById, getCurrentUser, getSkills, createSwapRequest } from "@/lib/database"
import type { User, Skill } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function SwapRequestPage() {
  const { userId: recipientId } = useParams<{ userId: string }>()
  const router = useRouter()
  const [recipient, setRecipient] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [skillsOffered, setSkillsOffered] = useState<Skill[]>([])
  const [skillsWanted, setSkillsWanted] = useState<Skill[]>([])
  const [selectedSkillOffered, setSelectedSkillOffered] = useState("")
  const [selectedSkillWanted, setSelectedSkillWanted] = useState("")
  const [message, setMessage] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const current = await getCurrentUser()
      if (!current) {
        router.push("/auth")
        return
      }
      setCurrentUser(current)

      const fetchedRecipient = await getUserById(recipientId)
      setRecipient(fetchedRecipient)

      const allAvailableSkills = await getSkills()
      setSkillsOffered(allAvailableSkills)
      setSkillsWanted(allAvailableSkills)
      setLoading(false)
    }
    loadData()
  }, [recipientId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSkillOffered || !selectedSkillWanted || !recipientId) {
      toast({
        title: "Missing Information",
        description: "Please select both a skill you offer and a skill you want.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    const newSwapRequest = await createSwapRequest({
      recipient_id: recipientId,
      skill_offered_id: selectedSkillOffered,
      skill_wanted_id: selectedSkillWanted,
      message: message || undefined,
      hourly_rate: hourlyRate || undefined,
    })

    if (newSwapRequest) {
      toast({
        title: "Swap Request Sent!",
        description: `Your request to ${recipient?.name} has been sent.`,
      })
      router.push("/swaps")
    } else {
      toast({
        title: "Error",
        description: "Failed to send swap request. Please try again.",
        variant: "destructive",
      })
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentUser) {
    return null // Redirect handled by useEffect
  }

  if (!recipient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Recipient user not found.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Send Swap Request to {recipient.name}</CardTitle>
          <CardDescription>Propose a skill exchange with {recipient.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skill-offered">Skill You Offer</Label>
              <Select value={selectedSkillOffered} onValueChange={setSelectedSkillOffered}>
                <SelectTrigger id="skill-offered">
                  <SelectValue placeholder="Select a skill you can teach" />
                </SelectTrigger>
                <SelectContent>
                  {skillsOffered.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skill-wanted">Skill You Want to Learn</Label>
              <Select value={selectedSkillWanted} onValueChange={setSelectedSkillWanted}>
                <SelectTrigger id="skill-wanted">
                  <SelectValue placeholder="Select a skill you want to learn" />
                </SelectTrigger>
                <SelectContent>
                  {skillsWanted.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Hi, I'd love to swap skills with you..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourly-rate">Your Hourly Rate (Optional)</Label>
              <Input
                id="hourly-rate"
                type="text"
                placeholder="e.g., ₹500/hour or Negotiable"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending Request..." : "Send Swap Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
