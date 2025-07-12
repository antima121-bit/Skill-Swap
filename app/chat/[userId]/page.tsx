"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SendIcon } from "lucide-react"
import { getMessages, sendMessage, getUserById, getCurrentUser } from "@/lib/database"
import type { Message, User } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChatPage() {
  const { userId: otherUserId } = useParams<{ userId: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadChat = async () => {
      setLoading(true)
      const current = await getCurrentUser()
      setCurrentUser(current)

      if (current && otherUserId) {
        const fetchedMessages = await getMessages(current.id, otherUserId)
        setMessages(fetchedMessages)
        const fetchedOtherUser = await getUserById(otherUserId)
        setOtherUser(fetchedOtherUser)
      }
      setLoading(false)
    }
    loadChat()
  }, [otherUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "" || !currentUser || !otherUserId) return

    const sentMessage = await sendMessage(otherUserId, newMessage)
    if (sentMessage) {
      setMessages((prevMessages) => [...prevMessages, sentMessage])
      setNewMessage("")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="flex h-[500px] flex-col justify-end space-y-4 overflow-hidden p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <Skeleton className="h-12 w-2/3 rounded-lg" />
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 flex-grow" />
              <Skeleton className="h-10 w-10" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentUser || !otherUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">User not found or not logged in.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <Card className="flex h-[calc(100vh-32px)] w-full max-w-2xl flex-col">
        <CardHeader className="flex flex-row items-center space-x-4 border-b p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser.avatar_url || "/placeholder-user.jpg"} />
            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{otherUser.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender_id === currentUser.id
                    ? "bg-blue-500 text-white dark:bg-blue-600"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                <p>{msg.content}</p>
                <span className="mt-1 block text-xs opacity-75">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 border-t p-4">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" disabled={newMessage.trim() === ""}>
            <SendIcon className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </Card>
    </div>
  )
}
