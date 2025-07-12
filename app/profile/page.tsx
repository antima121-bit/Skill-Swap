"use client"

import { useState } from "react"
import { Camera, MapPin, Star, Edit, Plus, X, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Arjun Sharma",
    email: "arjun.sharma@example.com",
    location: "Bangalore, Karnataka",
    bio: "Full-stack developer passionate about creating innovative solutions. Love learning new technologies and sharing knowledge with fellow Indian developers.",
    avatar: "/images/person-avatar.png", // Updated to a more realistic image
    isPublic: true,
    skillsOffered: ["React", "Node.js", "TypeScript", "Python"],
    skillsWanted: ["UI/UX Design", "Figma", "Adobe Creative Suite"],
    availability: "Evenings and Weekends",
    rating: 4.8,
    completedSwaps: 12,
    hourlyRate: "₹500",
  })

  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")

  const handleSave = () => {
    setIsEditing(false)
    // Save profile logic here
    console.log("Profile saved:", profile)
  }

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setProfile({
        ...profile,
        skillsOffered: [...profile.skillsOffered, newSkillOffered.trim()],
      })
      setNewSkillOffered("")
    }
  }

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setProfile({
        ...profile,
        skillsWanted: [...profile.skillsWanted, newSkillWanted.trim()],
      })
      setNewSkillWanted("")
    }
  }

  const removeSkillOffered = (index: number) => {
    setProfile({
      ...profile,
      skillsOffered: profile.skillsOffered.filter((_, i) => i !== index),
    })
  }

  const removeSkillWanted = (index: number) => {
    setProfile({
      ...profile,
      skillsWanted: profile.skillsWanted.filter((_, i) => i !== index),
    })
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
              <Link href="/swaps">
                <Button variant="ghost" className="text-white hover:bg-green-500/20 font-black">
                  My Swaps
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 ring-4 ring-green-500/30">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-black">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 font-black"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white font-black">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-white font-black">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-white font-black">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-xl font-bold"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourlyRate" className="text-white font-black">
                        Hourly Rate
                      </Label>
                      <Input
                        id="hourlyRate"
                        value={profile.hourlyRate}
                        onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                        className="bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-xl font-bold"
                        placeholder="₹500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-black text-white mb-2">{profile.name}</h1>
                    <div className="flex items-center space-x-4 text-gray-300 mb-4 font-bold">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{profile.rating}</span>
                      </div>
                      <span>{profile.completedSwaps} swaps completed</span>
                      <span className="text-green-400">{profile.hourlyRate}/hour</span>
                    </div>
                    <p className="text-gray-300 mb-4 font-bold">{profile.bio}</p>
                  </div>
                )}

                {/* Profile Visibility */}
                <div className="flex items-center space-x-3 mb-4">
                  <Switch
                    checked={profile.isPublic}
                    onCheckedChange={(checked) => setProfile({ ...profile, isPublic: checked })}
                    disabled={!isEditing}
                  />
                  <Label className="text-white font-black">Public Profile</Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-black"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-green-500/30 text-green-300 hover:bg-green-500/20 font-black bg-transparent"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Skills Offered */}
          <Card className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between font-black">
                Skills I Offer
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-500/30 text-green-300 hover:bg-green-500/20 bg-transparent font-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing && (
                <div className="flex space-x-2 mb-4">
                  <Input
                    placeholder="Add a skill you can teach"
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    className="bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-xl font-bold"
                    onKeyPress={(e) => e.key === "Enter" && addSkillOffered()}
                  />
                  <Button
                    onClick={addSkillOffered}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-green-600 font-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {profile.skillsOffered.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 relative group font-black"
                  >
                    {skill}
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2 h-4 w-4 p-0 text-green-300 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeSkillOffered(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Wanted */}
          <Card className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between font-black">
                Skills I Want to Learn
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-500/30 text-green-300 hover:bg-green-500/20 bg-transparent font-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing && (
                <div className="flex space-x-2 mb-4">
                  <Input
                    placeholder="Add a skill you want to learn"
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    className="bg-black/30 backdrop-blur-md border-green-500/30 text-white placeholder-gray-400 rounded-xl font-bold"
                    onKeyPress={(e) => e.key === "Enter" && addSkillWanted()}
                  />
                  <Button
                    onClick={addSkillWanted}
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 font-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {profile.skillsWanted.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 relative group font-black"
                  >
                    {skill}
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2 h-4 w-4 p-0 text-emerald-300 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeSkillWanted(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Availability */}
        <Card className="backdrop-blur-md bg-black/30 border-green-500/30 rounded-2xl shadow-xl mt-8">
          <CardHeader>
            <CardTitle className="text-white font-black">Availability</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Select
                value={profile.availability}
                onValueChange={(value) => setProfile({ ...profile, availability: value })}
              >
                <SelectTrigger className="bg-black/30 backdrop-blur-md border-green-500/30 text-white rounded-xl font-bold">
                  <SelectValue placeholder="Select your availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekdays">Weekdays</SelectItem>
                  <SelectItem value="Evenings">Evenings</SelectItem>
                  <SelectItem value="Weekends">Weekends</SelectItem>
                  <SelectItem value="Evenings and Weekends">Evenings and Weekends</SelectItem>
                  <SelectItem value="Flexible">Flexible Schedule</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-300 font-bold">{profile.availability}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
