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
import { searchUsers, getCurrentUser } from "@/lib/database"
import type { User } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      const fetchedUsers = await searchUsers("", {})
      setUsers(fetchedUsers)
      const user = await getCurrentUser()
      setCurrentUser(user)
      setLoading(false)
    }
    loadInitialData()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearchLoading(true)
    const filteredUsers = await searchUsers(searchTerm, {})
    setUsers(filteredUsers)
    setSearchLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Skill Swap Platform
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Connect with others to exchange skills and knowledge. Learn, teach, and grow together.
                </p>
              </div>
              <form onSubmit={handleSearch} className="flex w-full max-w-md items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search for skills or users..."
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" disabled={searchLoading}>
                  {searchLoading ? "Searching..." : <SearchIcon className="h-4 w-4" />}
                  <span className="sr-only">Search</span>
                </Button>
              </form>
            </div>
          </div>
        </section>
        <section className="w-full bg-gray-100 py-12 md:py-24 lg:py-32 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Skill Swappers</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover talented individuals ready to share their expertise and learn new skills.
                </p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                <div className="col-span-full text-center text-gray-500">No users found.</div>
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
          </div>
        </section>
      </main>
    </div>
  )
}
