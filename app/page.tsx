"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-16">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
          Connect, Trade, Grow
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Exchange skills with professionals across India. Learn something new while teaching what you know best.
        </p>
        <div className="max-w-2xl mx-auto flex gap-2 p-2 glass-card rounded-full">
          <Input 
            type="text"
            placeholder="Search for skills (e.g., React, Photoshop, Marketing...)"
            className="border-0 bg-transparent focus-visible:ring-0"
          />
          <Button size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Featured Swappers Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Featured Skill Swappers</h2>
          <Button variant="ghost" className="text-primary">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured User Card */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 hover-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    AS
                  </div>
                  <div>
                    <h3 className="font-semibold">Arjun Sharma</h3>
                    <p className="text-sm text-muted-foreground">Bangalore, Karnataka</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">4.8</span>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">
                Full-stack developer passionate about creating innovative solutions
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="skill-tag">React</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">TypeScript</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-primary">₹500/hour</span>
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-full">View Profile</Button>
                  <Button className="rounded-full">Swap</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Create Your Profile",
              description: "List your skills and what you want to learn"
            },
            {
              title: "Find Your Match",
              description: "Connect with others who complement your skill swap needs"
            },
            {
              title: "Start Learning",
              description: "Schedule sessions and begin your learning journey"
            }
          ].map((step, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto">
                {i + 1}
              </div>
              <h3 className="font-semibold text-xl">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-16">
        <h2 className="text-3xl font-bold">Ready to Start Your Skill Swap Journey?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join our community of learners and teachers today.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="rounded-full">Get Started</Button>
          <Button size="lg" variant="outline" className="rounded-full">Learn More</Button>
        </div>
      </section>
    </main>
  )
}
