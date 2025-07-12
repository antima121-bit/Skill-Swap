"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarIcon, MapPinIcon, SearchIcon } from "lucide-react"
import { searchUsers, getCurrentUser, getSkills } from "@/lib/database"
import type { User, Skill } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [locationFilter, setLocationFilter] = useState("any")
  const [availabilityFilter, setAvailabilityFilter] = useState("any")
  const [ratingFilter, setRatingFilter] = useState("any")
  const [allSkills, setAllSkills] = useState<Skill[]>([])

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      const fetchedUsers = await searchUsers("", {})
      setUsers(fetchedUsers)
      const user = await getCurrentUser()
      setCurrentUser(user)
      const skills = await getSkills()
      setAllSkills(skills)
      setLoading(false)
    }
    loadInitialData()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearchLoading(true)
    const filters = {
      location: locationFilter,
      availability: availabilityFilter,
      rating: ratingFilter,
    }
    const filteredUsers = await searchUsers(searchTerm, filters)
    setUsers(filteredUsers)
    setSearchLoading(false)
  }

  const handleClearFilters = async () => {
    setSearchTerm("")
    setLocationFilter("any")
    setAvailabilityFilter("any")
    setRatingFilter("any")
    setSearchLoading(true)
    const fetchedUsers = await searchUsers("", {})
    setUsers(fetchedUsers)
    setSearchLoading(false)
  }

  const uniqueLocations = Array.from(new Set(users.map((user) => user.location).filter(Boolean))) as string[]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4 md:p-6">
        <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-4 md:flex-row">
          <Input
            type="text"
            placeholder="Search for skills or users..."
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Location</SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="Evenings">Evenings</SelectItem>
              <SelectItem value="Weekends">Weekends</SelectItem>
              <SelectItem value="Weekdays after 6PM">Weekdays after 6PM</SelectItem>
              <SelectItem value="Flexible schedule">Flexible</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Min. Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="4.5">4.5+</SelectItem>
              <SelectItem value="4.0">4.0+</SelectItem>
              <SelectItem value="3.0">3.0+</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={searchLoading} className="w-full md:w-[120px]">
            {searchLoading ? "Searching..." : <SearchIcon className="h-4 w-4" />}
            <span className="sr-only">Search</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClearFilters}
            className="w-full md:w-[120px] bg-transparent"
          >
            Clear Filters
          </Button>
        </form>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex flex-col items-center p-6 text-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="mt-4 h-6 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </Card>
            ))
          ) : users.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No users found matching your criteria.</div>
          ) : (
            users.map((user) => (
              <Card key={user.id} className="flex flex-col items-center p-6 text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar_url || "/placeholder-user.jpg"} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-bold">{user.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{user.bio}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPinIcon className="mr-1 h-4 w-4" />
                  {user.location}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <StarIcon className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {user.rating} ({user.completed_swaps} swaps)
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {user.user_skills_offered?.map((us) => (
                    <Badge key={us.skill_id} variant="secondary">
                      {us.skills?.name}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href={`/profile/${user.id}`} passHref>
                    <Button variant="outline">View Profile</Button>
                  </Link>
                  {currentUser && currentUser.id !== user.id && (
                    <Link href={`/swap-request/${user.id}`} passHref>
                      <Button className="ml-2">Swap Skills</Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
