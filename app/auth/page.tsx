"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { createUserProfile } from "@/lib/database"

export default function AuthPage() {
  const [isLogin, setIsLogin] = React.useState(true)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/profile')
      }
    }
    checkAuth()
  }, [router])

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        console.log('Attempting login with:', { email })
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          console.error('Login error:', error)
          toast({
            variant: "destructive",
            title: "Login Error",
            description: error.message,
            action: {
              label: "Close",
              onClick: () => {}
            }
          })
        } else if (data.user) {
          // If login successful, show success message and redirect
          toast({
            title: "Success!",
            description: "Logged in successfully!",
            action: {
              label: "Close",
              onClick: () => {}
            }
          })
          router.push("/profile")
        }
      } else {
        // Validate password for signup
        const passwordError = validatePassword(password)
        if (passwordError) {
          toast({
            variant: "destructive",
            title: "Password Error",
            description: passwordError,
            action: {
              label: "Close",
              onClick: () => {}
            }
          })
          return
        }

        // Check if passwords match
        if (password !== confirmPassword) {
          toast({
            variant: "destructive",
            title: "Password Error",
            description: "Passwords do not match",
            action: {
              label: "Close",
              onClick: () => {}
            }
          })
          return
        }

        // Attempt signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          console.error('Signup error:', error)
          toast({
            variant: "destructive",
            title: "Signup Error",
            description: error.message,
            action: {
              label: "Close",
              onClick: () => {}
            }
          })
        } else if (data.user) {
          // Create user profile
          await createUserProfile(data.user.id, email)
          
          toast({
            title: "Success!",
            description: "Account created successfully! Please check your email to confirm your registration.",
            action: {
              label: "Close",
              onClick: () => {}
            }
          })
          // Reset form and switch to login mode
          setEmail("")
          setPassword("")
          setConfirmPassword("")
          setIsLogin(true)
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        action: {
          label: "Close",
          onClick: () => {}
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const validatePassword = (pass: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(pass)
    const hasLowerCase = /[a-z]/.test(pass)
    const hasNumbers = /\d/.test(pass)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass)

    if (pass.length < minLength) {
      return "Password must be at least 8 characters long"
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter"
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter"
    }
    if (!hasNumbers) {
      return "Password must contain at least one number"
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character"
    }
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin ? "Enter your credentials to access your account." : "Create a new account to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long and contain uppercase, lowercase, 
                  number, and special character.
                </p>
              )}
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button 
              variant="link" 
              onClick={() => {
                setIsLogin(!isLogin)
                setPassword("")
                setConfirmPassword("")
              }} 
              className="p-0"
            >
              {isLogin ? "Sign Up" : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
