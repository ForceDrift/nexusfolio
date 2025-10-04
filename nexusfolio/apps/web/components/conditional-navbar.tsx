"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./navbar"

export function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Hide navbar on auth pages and dashboard
  const hideNavbar = pathname === "/login" || pathname === "/signup" || pathname === "/dashboard"
  
  // Debug: log the current pathname
  console.log("Current pathname:", pathname, "Hide navbar:", hideNavbar)
  
  if (hideNavbar) {
    return null
  }
  
  return <Navbar />
}
