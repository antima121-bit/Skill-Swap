"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">S</span>
          </div>
          <span className="font-bold text-xl">Skill Swap India</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/browse" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/browse" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Browse
          </Link>
          <Link 
            href="/my-swaps" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/my-swaps" ? "text-primary" : "text-muted-foreground"
            )}
          >
            My Swaps
          </Link>
          <Link 
            href="/messages" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/messages" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Messages
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/auth">
            <Button variant="ghost" className="rounded-full">Sign In</Button>
          </Link>
          <Link href="/auth?mode=signup">
            <Button className="rounded-full">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
} 