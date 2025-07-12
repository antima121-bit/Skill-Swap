"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, Clock, ArrowLeft, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { Logo } from "@/components/logo"

import { searchUsers } from "@/lib/database" // Import searchUsers from database
import type { User } from "@/lib/supabase" // Import User type

// Remove the mockUsers array
// const mockUsers = [...]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]) // Initialize with empty array
  const [loading, setLoading] = useState(true) // Add loading state
  const [filters, setFilters] = useState({
    location: "",
    availability: "",
    rating: "",
    onlineOnly: false,
  })

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const users = await searchUsers(searchTerm, filters)
        setFilteredUsers(users)
      } catch (error) {
        console.error("Error fetching users for search:", error)
        setFilteredUsers([]) // Set to empty on error
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [searchTerm, filters]) // Depend on searchTerm and filters

  const clearFilters = () => {
    setFilters({
      location: "",
      availability: "",
      rating: "",
      onlineOnly: false,
    })
    setSearchTerm("")
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
              <Link href="/profile">
                <Button variant="ghost" className="text-white hover:bg-green-500/20 font-black">
                  Profile
                </Button>
              </Link>
              <Link href="/swaps">
                <Button variant="ghost" className="text-white hover:bg-green-500/20 font-black">
                  My Swaps
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-4">
            Browse
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Skills</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 font-bold">
            Find the perfect skill exchange partner from our Indian community
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for skills, people, or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-2xl text-lg font-bold"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="border-green-500/30 text-white hover:bg-green-500/20 rounded-xl bg-transparent font-black"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gradient-to-br from-gray-900/95 via-green-900/95 to-black/95 backdrop-blur-md border-green-500/30">
                <SheetHeader>
                  <SheetTitle className="text-white font-black">Filter Results</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  {/* Location Filter */}
                  <div>
                    <Label className="text-white mb-2 block font-black">Location</Label>
                    <Input
                      placeholder="Enter city or state"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-xl font-bold"
                    />
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <Label className="text-white mb-2 block font-black">Availability</Label>
                    <Select
                      value={filters.availability}
                      onValueChange={(value) => setFilters({ ...filters, availability: value })}
                    >
                      <SelectTrigger className="bg-black/30 backdrop-blur-md border-green-500/30 text-white rounded-xl font-bold">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any time</SelectItem>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="evenings">Evenings</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <Label className="text-white mb-2 block font-black">Minimum Rating</Label>
                    <Select value={filters.rating} onValueChange={(value) => setFilters({ ...filters, rating: value })}>
                      <SelectTrigger className="bg-black/30 backdrop-blur-md border-green-500/30 text-white rounded-xl font-bold">
                        <SelectValue placeholder="Select minimum rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any rating</SelectItem>
                        <SelectItem value="4.0">4.0+ stars</SelectItem>
                        <SelectItem value="4.5">4.5+ stars</SelectItem>
                        <SelectItem value="4.8">4.8+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Online Only Filter */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="online-only"
                      checked={filters.onlineOnly}
                      onCheckedChange={(checked) => setFilters({ ...filters, onlineOnly: checked as boolean })}
                      className="border-green-500/30 data-[state=checked]:bg-green-500"
                    />
                    <Label htmlFor="online-only" className="text-white font-bold">
                      Show only online users
                    </Label>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full border-green-500/30 text-white hover:bg-green-500/20 rounded-xl bg-transparent font-black"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="text-gray-300 font-bold">
              {filteredUsers.length} {filteredUsers.length === 1 ? "result" : "results"} found
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center text-white font-bold">Loading results...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-green-400/50"
              >
                <CardContent className="p-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-green-500/30">
                        <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {/* Assuming is_online property exists on User for demo */}
                      {/* {user.is_online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )} */}
                    </div>
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

                  {/* Skills Offered */}
                  <div className="mb-4">
                    <h4 className="text-sm font-black text-gray-300 mb-2">Skills Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.user_skills_offered?.map((userSkill, index) => (
                        <Badge
                          key={index}
                          className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 font-black"
                        >
                          {userSkill.skill?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Skills Wanted */}
                  <div className="mb-4">
                    <h4 className="text-sm font-black text-gray-300 mb-2">Skills Wanted</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.user_skills_wanted?.map((userSkill, index) => (
                        <Badge
                          key={index}
                          className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 font-black"
                        >
                          {userSkill.skill?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Availability & Price */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-300 font-bold">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{user.availability}</span>
                      </div>
                      <span className="text-green-400 font-black">{user.hourly_rate}/hour</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 font-bold">{user.bio}</p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link href={`/swap-request/${user.id}`}>
                      <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black">
                        Send Request
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
        )}

        {/* No Results */}
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-black/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">No results found</h3>
            <p className="text-gray-300 mb-4 font-bold">Try adjusting your search terms or filters</p>
            <Button
              onClick={clearFilters}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
