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

// Extended mock data for search - Indian context
const mockUsers = [
  {
    id: 1,
    name: "Arjun Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Bangalore, Karnataka",
    rating: 4.8,
    skillsOffered: ["React", "Node.js", "TypeScript"],
    skillsWanted: ["UI/UX Design", "Figma"],
    availability: "Evenings, Weekends",
    description: "Full-stack developer looking to learn design skills",
    isOnline: true,
    hourlyRate: "₹500",
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Mumbai, Maharashtra",
    rating: 4.9,
    skillsOffered: ["Photoshop", "Illustrator", "Branding"],
    skillsWanted: ["Python", "Data Analysis"],
    availability: "Weekdays after 6PM",
    description: "Graphic designer wanting to transition into data science",
    isOnline: false,
    hourlyRate: "₹400",
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Delhi, NCR",
    rating: 4.7,
    skillsOffered: ["Digital Marketing", "SEO", "Content Writing"],
    skillsWanted: ["Web Development", "JavaScript"],
    availability: "Flexible schedule",
    description: "Marketing professional looking to learn coding",
    isOnline: true,
    hourlyRate: "₹350",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Hyderabad, Telangana",
    rating: 4.6,
    skillsOffered: ["Python", "Machine Learning", "Data Science"],
    skillsWanted: ["Mobile Development", "Flutter"],
    availability: "Weekends",
    description: "Data scientist interested in mobile app development",
    isOnline: true,
    hourlyRate: "₹600",
  },
  {
    id: 5,
    name: "Vikram Singh",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Pune, Maharashtra",
    rating: 4.8,
    skillsOffered: ["Video Editing", "After Effects", "Motion Graphics"],
    skillsWanted: ["3D Modeling", "Blender"],
    availability: "Evenings",
    description: "Video editor looking to expand into 3D animation",
    isOnline: false,
    hourlyRate: "₹450",
  },
  {
    id: 6,
    name: "Kavya Nair",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Chennai, Tamil Nadu",
    rating: 4.9,
    skillsOffered: ["Project Management", "Agile", "Scrum"],
    skillsWanted: ["Product Design", "User Research"],
    availability: "Flexible",
    description: "Project manager transitioning to product management",
    isOnline: true,
    hourlyRate: "₹550",
  },
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [filters, setFilters] = useState({
    location: "",
    availability: "",
    rating: "",
    onlineOnly: false,
  })

  useEffect(() => {
    let filtered = mockUsers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.skillsOffered.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
          user.skillsWanted.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((user) => user.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    // Availability filter
    if (filters.availability) {
      filtered = filtered.filter((user) => user.availability.toLowerCase().includes(filters.availability.toLowerCase()))
    }

    // Rating filter
    if (filters.rating) {
      const minRating = Number.parseFloat(filters.rating)
      filtered = filtered.filter((user) => user.rating >= minRating)
    }

    // Online only filter
    if (filters.onlineOnly) {
      filtered = filtered.filter((user) => user.isOnline)
    }

    setFilteredUsers(filtered)
  }, [searchTerm, filters])

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
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
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
                    {user.skillsOffered.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 font-black"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div className="mb-4">
                  <h4 className="text-sm font-black text-gray-300 mb-2">Skills Wanted</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 font-black"
                      >
                        {skill}
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
                    <span className="text-green-400 font-black">{user.hourlyRate}/hour</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 font-bold">{user.description}</p>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black">
                    Send Request
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-500/30 text-white hover:bg-green-500/20 bg-transparent font-black"
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredUsers.length === 0 && (
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
