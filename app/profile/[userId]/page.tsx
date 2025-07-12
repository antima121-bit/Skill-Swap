"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPinIcon, StarIcon, MessageSquareIcon, CalendarIcon } from "lucide-react"
import { getUserById, getCurrentUser, getSwapRequests } from "@/lib/database"
import type { User, SwapRequest, ActiveSwap } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [swapRequests, setSwapRequests] = useState<{
    pending: SwapRequest[]
    active: ActiveSwap[]
    completed: SwapRequest[]
  } | null>(null)

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true)
      const fetchedUser = await getUserById(userId)
      setUser(fetchedUser)
      const current = await getCurrentUser()
      setCurrentUser(current)

      if (current) {
        const fetchedSwapRequests = await getSwapRequests(current.id)
        setSwapRequests(fetchedSwapRequests)
      }
      setLoading(false)
    }
    loadUserData()
  }, [userId])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader className="flex flex-col items-center space-y-4 p-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">User not found.</p>
      </div>
    )
  }

  const isCurrentUserProfile = currentUser?.id === user.id

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-col items-center space-y-4 p-6">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} />
            <AvatarFallback className="text-5xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
          <p className="text-center text-gray-500 dark:text-gray-400">{user.bio}</p>
          <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <MapPinIcon className="mr-1 h-4 w-4" />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center">
              <StarIcon className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>
                {user.rating} ({user.completed_swaps} swaps)
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {!isCurrentUserProfile && (
              <>
                <Link href={`/swap-request/${user.id}`} passHref>
                  <Button>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Swap Skills
                  </Button>
                </Link>
                <Link href={`/chat/${user.id}`} passHref>
                  <Button variant="outline">
                    <MessageSquareIcon className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </Link>
              </>
            )}
            {isCurrentUserProfile && (
              <Link href="/profile/edit" passHref>
                <Button variant="outline">Edit Profile</Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div>
            <h3 className="mb-3 text-2xl font-semibold">Skills Offered</h3>
            <div className="flex flex-wrap gap-2">
              {user.user_skills_offered?.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No skills offered.</p>
              ) : (
                user.user_skills_offered?.map((us) => (
                  <Badge key={us.skill_id} variant="secondary">
                    {us.skills?.name}
                  </Badge>
                ))
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-2xl font-semibold">Skills Wanted</h3>
            <div className="flex flex-wrap gap-2">
              {user.user_skills_wanted?.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No skills wanted.</p>
              ) : (
                user.user_skills_wanted?.map((us) => (
                  <Badge key={us.skill_id} variant="secondary">
                    {us.skills?.name}
                  </Badge>
                ))
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-2xl font-semibold">Availability</h3>
            <p className="text-gray-700 dark:text-gray-300">{user.availability || "Not specified"}</p>
          </div>
          <div>
            <h3 className="mb-3 text-2xl font-semibold">Hourly Rate</h3>
            <p className="text-gray-700 dark:text-gray-300">{user.hourly_rate || "Not specified"}</p>
          </div>
          {isCurrentUserProfile && swapRequests && (
            <div>
              <h3 className="mb-3 text-2xl font-semibold">My Swap History</h3>
              <div className="space-y-4">
                {swapRequests.completed.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No completed swaps yet.</p>
                ) : (
                  swapRequests.completed.map((swap) => (
                    <Card key={swap.id} className="p-4">
                      <p className="text-sm text-gray-500">
                        {new Date(swap.updated_at).toLocaleDateString()} - Completed
                      </p>
                      <p className="mt-2">
                        You {swap.requester_id === user.id ? "offered" : "received"} {swap.skill_offered?.name} for{" "}
                        {swap.skill_wanted?.name} with{" "}
                        {swap.requester_id === user.id ? swap.recipient?.name : swap.requester?.name}.
                      </p>
                      {swap.feedback && (
                        <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400">
                          Feedback: &quot;{swap.feedback}&quot;
                        </p>
                      )}
                      {swap.rating && (
                        <div className="mt-2 flex items-center text-sm">
                          <StarIcon className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{swap.rating} / 5</span>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
