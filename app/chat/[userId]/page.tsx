"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Phone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getCurrentUser, getUserById, getMessages, sendMessage } from "@/lib/database"
import type { User, Message } from "@/lib/supabase"

export default function ChatPage() {
  const params = useParams()
  const userId = params.userId as string
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadData = async () => {
    try {
      const [current, other] = await Promise.all([getCurrentUser(), getUserById(userId)])

      if (current && other) {
        setCurrentUser(current)
        setOtherUser(other)

        const messageData = await getMessages(current.id, userId)
        setMessages(messageData)
      }
    } catch (error) {
      console.error("Error loading chat data:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser) return

    try {
      const message = await sendMessage(userId, newMessage.trim())
      if (message) {
        setMessages((prev) => [...prev, message])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-white font-bold">Loading chat...</div>
      </div>
    )
  }

  if (!otherUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-white font-bold">User not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex flex-col">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-black/30 border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/swaps">
              <Button variant="ghost" className="text-white hover:bg-green-500/20 font-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Swaps
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Logo className="w-10 h-10" />
              <span className="text-white font-black text-xl tracking-wide">Skill Swap India</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-green-500/20 font-black">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-green-500/20 font-black">
                <Video className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Header */}
      <div className="backdrop-blur-md bg-black/20 border-b border-green-500/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
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
            <h2 className="text-white font-black text-lg">{otherUser.name}</h2>
            <p className="text-gray-300 font-bold text-sm">{otherUser.location}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-xs lg:max-w-md ${
                  message.sender_id === currentUser?.id
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-black/30 border-green-500/30"
                }`}
              >
                <CardContent className="p-3">
                  <p className="text-white font-bold text-sm">{message.content}</p>
                  <p className="text-gray-300 text-xs mt-1">{new Date(message.created_at).toLocaleTimeString()}</p>
                </CardContent>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="backdrop-blur-md bg-black/20 border-t border-green-500/30 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-xl font-bold"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black"
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
