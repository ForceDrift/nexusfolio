"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"
import { ProfileDropdown } from "@/components/profile-dropdown"

interface SidebarProps {
  className?: string
  user?: {
    name?: string
    email?: string
    sub?: string
    picture?: string
  }
}

export function Sidebar({ className, user }: SidebarProps) {
  const [activeSection, setActiveSection] = useState("stocks")

  const sections = [
    {
      id: "stocks",
      title: "Stocks",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      href: "/dashboard/stocks"
    },
    {
      id: "ai-advisor",
      title: "AI Advisor",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      href: "/dashboard/ai-advisor"
    },
    {
      id: "portfolio",
      title: "Portfolio",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      href: "/dashboard/portfolio"
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: "/dashboard/analytics"
    }
  ]

  return (
    <div className={cn("w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col", className)}>
      {/* Logo Header */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Image
            src="/download (2).png"
            alt="Logo"
            width={200}
            height={60}
            className="h-8 w-auto"
          />
          <div>
            <h2 className="text-sm font-semibold text-sidebar-foreground">NexusFolio</h2>
            <p className="text-xs text-sidebar-foreground/60">Finance Platform</p>
          </div>
        </Link>
      </div>

      {/* Platform Section */}
      <div className="flex-1 p-4">
        <div className="mb-4">
          <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3">Platform</h3>
          <nav className="space-y-1">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                  activeSection === section.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">Projects</h3>
            <button className="w-5 h-5 bg-sidebar-accent hover:bg-sidebar-accent/80 rounded-sm flex items-center justify-center transition-colors group">
              <svg className="w-3 h-3 text-sidebar-accent-foreground group-hover:text-sidebar-accent-foreground/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-sidebar-foreground/60 px-3 py-2">
            No projects yet
          </div>
        </div>
      </div>

      {/* Profile Dropdown at Bottom */}
      {user && (
        <div className="p-4 border-t border-sidebar-border">
          <ProfileDropdown user={user} />
        </div>
      )}
    </div>
  )
}

