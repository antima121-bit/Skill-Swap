"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { getAllSkills, getUserSkills } from "@/lib/database"
import { supabase } from "@/lib/supabase"

export default function BrowsePage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        // Get all users
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .ilike('name', `%${searchTerm}%`)
          .order('created_at', { ascending: false })

        if (error) {
          console.error("Error fetching users:", error)
          setUsers([])
        } else if (users) {
          // Get skills for each user
          const usersWithSkills = await Promise.all(
            users.map(async (user) => {
              const skills = await getUserSkills(user.id)
              return {
                ...user,
                skills_offering: skills?.offering.map(s => s?.name || '') || [],
                skills_learning: skills?.learning.map(s => s?.name || '') || []
              }
            })
          )
          setUsers(usersWithSkills)
        }
      } catch (error) {
        console.error("Error loading users:", error)
        setUsers([])
      }
      setLoading(false)
    }

    loadUsers()
  }, [searchTerm])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Browse Skill Swap Members</h1>
        <p className="text-muted-foreground">
          Find members to connect with and start your skill exchange journey.
        </p>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Show loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="hover-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-secondary animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-secondary animate-pulse rounded" />
                    <div className="h-3 w-32 bg-secondary animate-pulse rounded" />
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-20 bg-secondary animate-pulse rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-secondary animate-pulse rounded-full" />
                    <div className="h-6 w-16 bg-secondary animate-pulse rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : users.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No users found matching your search.</p>
          </div>
        ) : (
          users.map((user) => (
            <Link href={`/profile/${user.id}`} key={user.id}>
              <Card className="hover-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>
                        {user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{user.name || "Anonymous User"}</h3>
                      <p className="text-sm text-muted-foreground">{user.location || "Location not specified"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 text-foreground">Skills Offering:</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skills_offering?.length > 0 ? (
                        user.skills_offering.map((skill: string) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No skills listed</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 text-foreground">Looking to Learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skills_learning?.length > 0 ? (
                        user.skills_learning.map((skill: string) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No skills listed</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </main>
  )
} 