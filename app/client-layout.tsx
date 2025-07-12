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

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser()
      setCurrentUser(user)
    }

    fetchCurrentUser()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-950">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold" prefetch={false}>
              <img src="/placeholder-logo.svg" alt="Logo" className="h-6 w-6" />
              <span>Skill Swap</span>
            </Link>
            <nav className="hidden items-center space-x-4 md:flex">
              <Link href="/search" className="text-sm font-medium hover:underline" prefetch={false}>
                Find Swaps
              </Link>
              <Link href="/swaps" className="text-sm font-medium hover:underline" prefetch={false}>
                My Swaps
              </Link>
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatar_url || "/placeholder-user.jpg"} />
                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <Link href="/profile" passHref>
                      <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={async () => await handleSignOut()} className="cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth" passHref>
                  <Button variant="outline">Login</Button>
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
                <Link href="/search" passHref>
                  <DropdownMenuItem>Find Swaps</DropdownMenuItem>
                </Link>
                <Link href="/swaps" passHref>
                  <DropdownMenuItem>My Swaps</DropdownMenuItem>
                </Link>
                {currentUser ? (
                  <>
                    <Link href="/profile" passHref>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={async () => await handleSignOut()}>Logout</DropdownMenuItem>
                  </>
                ) : (
                  <Link href="/auth" passHref>
                    <DropdownMenuItem>Login</DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {children}
        <footer className="w-full border-t bg-white py-6 dark:bg-gray-950">
          <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; 2024 Skill Swap Platform. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="#" className="text-sm hover:underline" prefetch={false}>
                Privacy
              </Link>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>
                Terms
              </Link>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>
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
