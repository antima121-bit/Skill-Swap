"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, XCircle, MessageCircle, Star, ArrowLeft, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Logo } from "@/components/logo"

import { getSwapRequests, updateSwapRequestStatus, getCurrentUser } from "@/lib/database"
import type { SwapRequest, ActiveSwap, User as UserType } from "@/lib/supabase"

export default function SwapsPage() {
  const [selectedTab, setSelectedTab] = useState("pending")
  const [feedbackDialog, setFeedbackDialog] = useState<string | null>(null)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(5)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [swapData, setSwapData] = useState<{
    pending: SwapRequest[]
    active: ActiveSwap[]
    completed: SwapRequest[]
  }>({ pending: [], active: [], completed: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSwapData()
  }, [])

  const loadSwapData = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        setCurrentUser(user)
        const data = await getSwapRequests(user.id)
        setSwapData(data)
      }
    } catch (error) {
      console.error("Error loading swap data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (id: string) => {
    try {
      await updateSwapRequestStatus(id, "accepted")
      loadSwapData() // Reload data
    } catch (error) {
      console.error("Error accepting request:", error)
    }
  }

  const handleRejectRequest = async (id: string) => {
    try {
      await updateSwapRequestStatus(id, "rejected")
      loadSwapData() // Reload data
    } catch (error) {
      console.error("Error rejecting request:", error)
    }
  }

  const handleCancelRequest = async (id: string) => {
    try {
      await updateSwapRequestStatus(id, "cancelled")
      loadSwapData() // Reload data
    } catch (error) {
      console.error("Error cancelling request:", error)
    }
  }

  const submitFeedback = () => {
    console.log("Submitting feedback:", { feedback, rating })
    setFeedbackDialog(null)
    setFeedback("")
    setRating(5)
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  // Helper function to get the other user from a request
  const getOtherUser = (request: SwapRequest) => {
    if (request.requester_id === currentUser?.id) {
      return request.recipient
    }
    return request.requester
  }

  // Helper function to get the other user from an active swap
  const getOtherUserFromSwap = (swap: ActiveSwap) => {
    if (swap.user1_id === currentUser?.id) {
      return swap.user2
    }
    return swap.user1
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-white font-bold">Loading swaps...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-black/30 border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-green-500/20 font-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
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
              <Link href="/profile">
                <Button variant="ghost" className="text-white hover:bg-green-500/20 font-black">
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-4">
            My
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Swaps</span>
          </h1>
          <p className="text-xl text-gray-300 font-bold">Manage your skill exchange requests and sessions</p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/30 backdrop-blur-md rounded-2xl p-1 mb-8">
            <TabsTrigger
              value="pending"
              className="text-white data-[state=active]:bg-green-500/30 data-[state=active]:text-white rounded-xl py-3 font-black"
            >
              Pending ({swapData.pending.length})
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="text-white data-[state=active]:bg-green-500/30 data-[state=active]:text-white rounded-xl py-3 font-black"
            >
              Active ({swapData.active.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-white data-[state=active]:bg-green-500/30 data-[state=active]:text-white rounded-xl py-3 font-black"
            >
              Completed ({swapData.completed.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-6">
            {swapData.pending.map((request) => {
              const otherUser = getOtherUser(request)
              if (!otherUser) return null

              return (
                <Card
                  key={request.id}
                  className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12 ring-2 ring-green-500/30">
                          <AvatarImage src={otherUser.avatar_url || "/placeholder.svg"} alt={otherUser.name} />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black">
                            {otherUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-black">{otherUser.name}</h3>
                          <div className="flex items-center space-x-2">
                            {renderStars(otherUser.rating)}
                            <span className="text-gray-300 text-sm font-bold">({otherUser.rating})</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge
                          className={`${
                            request.requester_id === currentUser?.id
                              ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          } font-black`}
                        >
                          {request.requester_id === currentUser?.id ? "Outgoing" : "Incoming"}
                        </Badge>
                        <span className="text-green-400 font-black text-sm">{request.hourly_rate}/hour</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/20 rounded-xl p-4">
                        <h4 className="text-sm font-black text-gray-300 mb-2">
                          {request.requester_id === currentUser?.id ? "You Offer" : "They Offer"}
                        </h4>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-black">
                          {request.skill_offered?.name || "Unknown Skill"}
                        </Badge>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4">
                        <h4 className="text-sm font-black text-gray-300 mb-2">
                          {request.requester_id === currentUser?.id ? "You Want" : "They Want"}
                        </h4>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-black">
                          {request.skill_wanted?.name || "Unknown Skill"}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-xl p-4 mb-4">
                      <h4 className="text-sm font-black text-gray-300 mb-2">Message</h4>
                      <p className="text-gray-300 font-bold">{request.message || "No message provided"}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-300 font-bold">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2">
                        {request.requester_id !== currentUser?.id ? (
                          <>
                            <Button
                              onClick={() => handleAcceptRequest(request.id)}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-black"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleRejectRequest(request.id)}
                              variant="outline"
                              className="border-red-500/30 text-red-300 hover:bg-red-500/10 font-black bg-transparent"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleCancelRequest(request.id)}
                            variant="outline"
                            className="border-green-500/30 text-green-300 hover:bg-green-500/20 font-black bg-transparent"
                          >
                            Cancel Request
                          </Button>
                        )}
                        <Link href={`/chat/${otherUser.id}`}>
                          <Button
                            variant="outline"
                            className="border-green-500/30 text-white hover:bg-green-500/20 bg-transparent font-black"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {swapData.pending.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">No pending requests</h3>
                <p className="text-gray-300 font-bold">Your swap requests will appear here</p>
              </div>
            )}
          </TabsContent>

          {/* Active Swaps */}
          <TabsContent value="active" className="space-y-6">
            {swapData.active.map((swap) => {
              const otherUser = getOtherUserFromSwap(swap)
              if (!otherUser) return null

              return (
                <Card key={swap.id} className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12 ring-2 ring-green-500/30">
                          <AvatarImage src={otherUser.avatar_url || "/placeholder.svg"} alt={otherUser.name} />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black">
                            {otherUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-black">{otherUser.name}</h3>
                          <div className="flex items-center space-x-2">
                            {renderStars(otherUser.rating)}
                            <span className="text-gray-300 text-sm font-bold">({otherUser.rating})</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-black">Active</Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/20 rounded-xl p-4">
                        <h4 className="text-sm font-black text-gray-300 mb-2">You're Learning</h4>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-black">
                          {swap.skill2?.name || "Unknown Skill"}
                        </Badge>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4">
                        <h4 className="text-sm font-black text-gray-300 mb-2">You're Teaching</h4>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-black">
                          {swap.skill1?.name || "Unknown Skill"}
                        </Badge>
                      </div>
                    </div>

                    {swap.next_session && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
                        <h4 className="text-sm font-black text-green-300 mb-2">Next Session</h4>
                        <div className="flex items-center space-x-2 text-green-300 font-bold">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(swap.next_session).toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-300 font-bold">
                        <span>Started: {new Date(swap.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/chat/${otherUser.id}`}>
                          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="border-green-500/30 text-white hover:bg-green-500/20 bg-transparent font-black"
                        >
                          Schedule Session
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {swapData.active.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">No active swaps</h3>
                <p className="text-gray-300 font-bold">Your active skill exchanges will appear here</p>
              </div>
            )}
          </TabsContent>

          {/* Completed Swaps */}
          <TabsContent value="completed" className="space-y-6">
            {swapData.completed.map((swap) => {
              const otherUser = getOtherUser(swap)
              if (!otherUser) return null

              return (
                <Card key={swap.id} className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12 ring-2 ring-green-500/30">
                          <AvatarImage src={otherUser.avatar_url || "/placeholder.svg"} alt={otherUser.name} />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black">
                            {otherUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-black">{otherUser.name}</h3>
                          <div className="flex items-center space-x-2">
                            {renderStars(otherUser.rating)}
                            <span className="text-gray-300 text-sm font-bold">({otherUser.rating})</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 font-black">Completed</Badge>
                        <span className="text-green-400 font-black text-sm">{swap.hourly_rate}/hour</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/20 rounded-xl p-4">
                        <h4 className="text-sm font-black text-gray-300 mb-2">You Learned</h4>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-black">
                          {swap.skill_offered?.name || "Unknown Skill"}
                        </Badge>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4">
                        <h4 className="text-sm font-black text-gray-300 mb-2">You Taught</h4>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-black">
                          {swap.skill_wanted?.name || "Unknown Skill"}
                        </Badge>
                      </div>
                    </div>

                    {(swap as any).rating && (
                      <div className="bg-black/20 rounded-xl p-4 mb-4">
                        <h4 className="text-sm font-black text-gray-300 mb-2">Your Rating</h4>
                        <div className="flex items-center space-x-2">
                          {renderStars((swap as any).rating)}
                          <span className="text-gray-300 font-bold">({(swap as any).rating}/5)</span>
                        </div>
                        {(swap as any).feedback && (
                          <p className="text-gray-300 mt-2 text-sm font-bold">{(swap as any).feedback}</p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-300 font-bold">
                        <span>Completed: {new Date(swap.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2">
                        {!(swap as any).rating && (
                          <Dialog
                            open={feedbackDialog === swap.id}
                            onOpenChange={(open) => setFeedbackDialog(open ? swap.id : null)}
                          >
                            <DialogTrigger asChild>
                              <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 font-black">
                                <Star className="w-4 h-4 mr-2" />
                                Rate & Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gradient-to-br from-gray-900/95 via-green-900/95 to-black/95 backdrop-blur-md border-green-500/30">
                              <DialogHeader>
                                <DialogTitle className="text-white font-black">Rate Your Experience</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-white mb-2 block font-black">Rating</Label>
                                  {renderStars(rating, true, setRating)}
                                </div>
                                <div>
                                  <Label htmlFor="feedback" className="text-white mb-2 block font-black">
                                    Feedback (Optional)
                                  </Label>
                                  <Textarea
                                    id="feedback"
                                    placeholder="Share your experience..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-xl font-bold"
                                    rows={4}
                                  />
                                </div>
                                <Button
                                  onClick={submitFeedback}
                                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black"
                                >
                                  Submit Review
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Link href={`/chat/${otherUser.id}`}>
                          <Button
                            variant="outline"
                            className="border-green-500/30 text-white hover:bg-green-500/20 bg-transparent font-black"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {swapData.completed.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">No completed swaps</h3>
                <p className="text-gray-300 font-bold">Your completed skill exchanges will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
