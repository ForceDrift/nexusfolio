"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./navbar"

export function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Hide navbar on auth pages
  const hideNavbar = pathname === "/login" || pathname === "/signup"
  
  if (hideNavbar) {
    return null
  }
  
  return <Navbar />
}
