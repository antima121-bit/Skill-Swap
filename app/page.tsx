"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MessageCircle, Star, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import Link from "next/link"

// Remove the mockSkillListings array and replace with:
import { searchUsers } from "@/lib/database"
import type { User } from "@/lib/supabase"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      searchUsersWithTerm()
    } else {
      loadUsers()
    }
  }, [searchTerm])

  const loadUsers = async () => {
    try {
      const userData = await searchUsers("", {})
      setUsers(userData.slice(0, 6)) // Show first 6 users
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchUsersWithTerm = async () => {
    try {
      const userData = await searchUsers(searchTerm, {})
      setUsers(userData)
    } catch (error) {
      console.error("Error searching users:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-black/30 border-b border-green-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Logo className="w-10 h-10" />
              <span className="text-white font-black text-xl tracking-wide">Skill Swap India</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/search">
                <Button variant="ghost" className="text-white hover:bg-green-500/20 font-bold">
                  Browse
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="text-white hover:bg-green-500/20 font-bold">
                  Profile
                </Button>
              </Link>
              <Link href="/swaps">
                <Button variant="ghost" className="text-white hover:bg-green-500/20 font-bold">
                  My Swaps
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Connect, Trade,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Grow</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-bold">
            Exchange skills with professionals across India. Learn something new while teaching what you know best.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for skills (e.g., React, Photoshop, Marketing...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-2xl text-lg font-bold"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-black">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Skill Listings */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card
              key={user.id}
              className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-green-400/50"
            >
              <CardContent className="p-6">
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12 ring-2 ring-green-500/30">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-white font-black">{user.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-300 font-bold">
                      <MapPin className="w-3 h-3" />
                      <span>{user.location}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{user.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-300 text-sm mb-4 font-bold">{user.bio}</p>

                {/* Rate */}
                <div className="mb-4">
                  <span className="text-green-400 font-black">{user.hourly_rate}/hour</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link href={`/swap-request/${user.id}`}>
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Swap
                    </Button>
                  </Link>
                  <Link href={`/profile/${user.id}`}>
                    <Button
                      variant="outline"
                      className="border-green-500/30 text-white hover:bg-green-500/20 bg-transparent font-black"
                    >
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-black text-white mb-4">Ready to Start Swapping?</h2>
              <p className="text-gray-300 mb-6 font-bold">
                Join thousands of Indian professionals exchanging skills and growing together.
              </p>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg px-8 py-3 font-black">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
