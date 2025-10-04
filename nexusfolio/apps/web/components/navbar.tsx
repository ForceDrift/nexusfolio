"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    
    // Determine scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setScrollDirection('down')
    } else {
      setScrollDirection('up')
    }
    
    // Update scrolled state with threshold
    setIsScrolled(currentScrollY > 20)
    setLastScrollY(currentScrollY)
  }, [lastScrollY])

  useEffect(() => {
    // Throttle scroll events for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    return () => window.removeEventListener("scroll", throttledHandleScroll)
  }, [handleScroll])

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { 
      label: "Discovery", 
      href: "/discovery",
      icon: (
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          className="ml-1 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110"
        >
          <path 
            d="M2 10L10 2M10 2H4M10 2V8" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
      )
    }
  ]

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        scrollDirection === 'down' && isScrolled ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div 
        className={cn(
          "mx-auto px-6 py-4 transition-all duration-300 ease-out",
          isScrolled 
            ? "max-w-5xl rounded-3xl mt-6 shadow-2xl bg-background/95 backdrop-blur-xl border border-border/20 mx-auto" 
            : "max-w-7xl"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-bold text-foreground hover:text-primary transition-all duration-200 hover:scale-105"
          >
            NexusFolio
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 relative py-2",
                  "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 after:ease-out",
                  "hover:after:w-full hover:scale-105"
                )}
              >
                {item.label}
                {item.icon}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d="M3 5H17M3 10H17M3 15H17" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
