"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"

interface User {
  name: string
  email: string
  sub: string
  picture?: string
}

interface ProfileDropdownProps {
  user: User
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          {user.picture ? (
            <img
              src={user.picture}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <span className="text-sm text-gray-600 hidden sm:block">{user.name}</span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute right-0 mt-2 w-80 h-80 bg-white shadow-lg border border-gray-200 p-3 z-50 transition-all duration-300 ease-out transform flex flex-col ${
        isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
      }`}>
        {/* User Info Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            {user.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{user.name}</h3>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* User Details */}
        <div className="flex-1 py-3 space-y-2 overflow-y-auto">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">User ID</label>
            <p className="text-xs text-gray-900 font-mono truncate">{user.sub}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
            <p className="text-xs text-gray-900 truncate">{user.email}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
            <p className="text-xs text-gray-900 truncate">{user.name}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-gray-100">
          <a href="/auth/logout" className="w-full">
            <Button variant="destructive" size="sm" className="w-full text-xs py-2">
              <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
