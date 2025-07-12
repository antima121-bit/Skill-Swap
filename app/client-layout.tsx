"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MenuIcon } from "lucide-react"
import { getCurrentUser } from "@/lib/database"
import { handleSignOut } from "@/lib/actions"
import { useEffect, useState } from "react"
import type { Profile } from "@/lib/database"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser()
      setCurrentUser(user)
    }

    fetchCurrentUser()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        const user = await getCurrentUser()
        setCurrentUser(user)
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">S</span>
              </div>
              <span className="font-bold text-xl">Skill Swap India</span>
            </Link>
            <nav className="hidden items-center space-x-6 md:flex">
              <Link 
                href="/browse" 
                className="text-sm font-medium transition-colors hover:text-primary" 
                prefetch={false}
              >
                Browse
              </Link>
              <Link 
                href="/my-swaps" 
                className="text-sm font-medium transition-colors hover:text-primary" 
                prefetch={false}
              >
                My Swaps
              </Link>
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatar_url || "/placeholder-user.jpg"} alt={currentUser.full_name || 'User'} />
                        <AvatarFallback>
                          {currentUser.full_name?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <Link href="/profile" passHref>
                      <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={async () => {
                      await handleSignOut()
                      setCurrentUser(null)
                    }} className="cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth" passHref>
                  <Button variant="ghost" className="rounded-full">Sign In</Button>
                </Link>
              )}
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/browse" passHref>
                  <DropdownMenuItem>Browse</DropdownMenuItem>
                </Link>
                <Link href="/my-swaps" passHref>
                  <DropdownMenuItem>My Swaps</DropdownMenuItem>
                </Link>
                {currentUser ? (
                  <>
                    <Link href="/profile" passHref>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={async () => {
                      await handleSignOut()
                      setCurrentUser(null)
                    }}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <Link href="/auth" passHref>
                    <DropdownMenuItem>Sign In</DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {children}
        <footer className="w-full border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6">
          <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Skill Swap India. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                Contact
              </Link>
            </nav>
          </div>
        </footer>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
