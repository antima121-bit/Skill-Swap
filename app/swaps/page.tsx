"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarIcon, MessageSquareIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from "lucide-react"
import { getCurrentUser, getSwapRequests, updateSwapRequestStatus } from "@/lib/database"
import type { User, SwapRequest, ActiveSwap } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function SwapsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [swapRequests, setSwapRequests] = useState<{
    pending: SwapRequest[]
    active: ActiveSwap[]
    completed: SwapRequest[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const user = await getCurrentUser()
      if (!user) {
        router.push("/auth") // Redirect to login if not authenticated
        return
      }
      setCurrentUser(user)
      const fetchedSwapRequests = await getSwapRequests(user.id)
      setSwapRequests(fetchedSwapRequests)
      setLoading(false)
    }
    loadData()
  }, [router])

  const handleUpdateStatus = async (requestId: string, status: "accepted" | "rejected" | "cancelled") => {
    const updatedRequest = await updateSwapRequestStatus(requestId, status)
    if (updatedRequest) {
      toast({
        title: "Swap Request Updated",
        description: `Request status changed to ${status}.`,
      })
      // Re-fetch requests to update UI
      if (currentUser) {
        const fetchedSwapRequests = await getSwapRequests(currentUser.id)
        setSwapRequests(fetchedSwapRequests)
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to update swap request status.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center p-4">
        <Tabs defaultValue="pending" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </TabsList>
          <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
    )
  }

  if (!currentUser) {
    return null // Redirect handled by useEffect
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <Tabs defaultValue="pending" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({swapRequests?.pending.length || 0})</TabsTrigger>
          <TabsTrigger value="active">Active ({swapRequests?.active.length || 0})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({swapRequests?.completed.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {swapRequests?.pending.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No pending swap requests.</p>
          ) : (
            swapRequests?.pending.map((request) => (
              <Card key={request.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          request.requester_id === currentUser.id
                            ? request.recipient?.avatar_url || "/placeholder-user.jpg"
                            : request.requester?.avatar_url || "/placeholder-user.jpg"
                        }
                      />
                      <AvatarFallback>
                        {request.requester_id === currentUser.id
                          ? request.recipient?.name.charAt(0)
                          : request.requester?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">
                      {request.requester_id === currentUser.id ? request.recipient?.name : request.requester?.name}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    Pending
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  <p>
                    {request.requester_id === currentUser.id ? "You offered" : "They offered"}{" "}
                    <Badge>{request.skill_offered?.name}</Badge> for{" "}
                    {request.requester_id === currentUser.id ? "their" : "your"} desired skill{" "}
                    <Badge>{request.skill_wanted?.name}</Badge>.
                  </p>
                  {request.message && (
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">&quot;{request.message}&quot;</p>
                  )}
                  <div className="flex gap-2">
                    {request.requester_id !== currentUser.id && (
                      <>
                        <Button onClick={() => handleUpdateStatus(request.id, "accepted")}>
                          <CheckCircleIcon className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button variant="outline" onClick={() => handleUpdateStatus(request.id, "rejected")}>
                          <XCircleIcon className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Link
                      href={`/chat/${
                        request.requester_id === currentUser.id ? request.recipient_id : request.requester_id
                      }`}
                      passHref
                    >
                      <Button variant="ghost">
                        <MessageSquareIcon className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-4 space-y-4">
          {swapRequests?.active.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No active swap sessions.</p>
          ) : (
            swapRequests?.active.map((swap) => (
              <Card key={swap.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          swap.user1_id === currentUser.id
                            ? swap.user2?.avatar_url || "/placeholder-user.jpg"
                            : swap.user1?.avatar_url || "/placeholder-user.jpg"
                        }
                      />
                      <AvatarFallback>
                        {swap.user1_id === currentUser.id ? swap.user2?.name.charAt(0) : swap.user1?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">
                      {swap.user1_id === currentUser.id ? swap.user2?.name : swap.user1?.name}
                    </CardTitle>
                  </div>
                  <Badge className="flex items-center gap-1">Active</Badge>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  <p>
                    Exchanging <Badge>{swap.skill1?.name}</Badge> for <Badge>{swap.skill2?.name}</Badge>.
                  </p>
                  {swap.next_session && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Next session: {new Date(swap.next_session).toLocaleString()}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Link href={`/chat/${swap.user1_id === currentUser.id ? swap.user2_id : swap.user1_id}`} passHref>
                      <Button variant="outline">
                        <MessageSquareIcon className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </Link>
                    {/* Add buttons for scheduling, completing, cancelling */}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-4">
          {swapRequests?.completed.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No completed swap requests.</p>
          ) : (
            swapRequests?.completed.map((request) => (
              <Card key={request.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          request.requester_id === currentUser.id
                            ? request.recipient?.avatar_url || "/placeholder-user.jpg"
                            : request.requester?.avatar_url || "/placeholder-user.jpg"
                        }
                      />
                      <AvatarFallback>
                        {request.requester_id === currentUser.id
                          ? request.recipient?.name.charAt(0)
                          : request.requester?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">
                      {request.requester_id === currentUser.id ? request.recipient?.name : request.requester?.name}
                    </CardTitle>
                  </div>
                  <Badge variant="default">Completed</Badge>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  <p>
                    {request.requester_id === currentUser.id ? "You offered" : "They offered"}{" "}
                    <Badge>{request.skill_offered?.name}</Badge> for{" "}
                    {request.requester_id === currentUser.id ? "their" : "your"} desired skill{" "}
                    <Badge>{request.skill_wanted?.name}</Badge>.
                  </p>
                  {request.feedback && (
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">
                      Feedback: &quot;{request.feedback}&quot;
                    </p>
                  )}
                  {request.rating && (
                    <div className="flex items-center text-sm">
                      <StarIcon className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{request.rating} / 5</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link
                      href={`/chat/${
                        request.requester_id === currentUser.id ? request.recipient_id : request.requester_id
                      }`}
                      passHref
                    >
                      <Button variant="outline">
                        <MessageSquareIcon className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
