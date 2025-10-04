"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"
import { Bot, Search, Brain, TrendingUp, Zap, BarChart3, X, Check } from "lucide-react"

export type LoadingState = 'searching' | 'analyzing' | 'generating' | 'processing'

interface LoadingStatesProps {
  isLoading: boolean
  currentState?: LoadingState
}

const loadingStates = [
  { state: 'searching' as const, icon: Search, text: 'Searching...', duration: 2000 },
  { state: 'analyzing' as const, icon: Brain, text: 'Analyzing...', duration: 2500 },
  { state: 'processing' as const, icon: BarChart3, text: 'Processing...', duration: 2000 },
  { state: 'generating' as const, icon: Zap, text: 'Generating...', duration: 1500 }
]

export function LoadingStates({ isLoading, currentState }: LoadingStatesProps) {
  const [activeState, setActiveState] = useState<LoadingState>('searching')
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!isLoading) {
      setActiveState('searching')
      setProgress(0)
      return
    }

    let currentIndex = 0
    let currentProgress = 0
    const totalDuration = loadingStates.reduce((sum, state) => sum + state.duration, 0)

    const interval = setInterval(() => {
      currentProgress += 30
      setProgress((currentProgress / totalDuration) * 100)

      if (currentIndex < loadingStates.length) {
        setActiveState(loadingStates[currentIndex].state)
        
        setTimeout(() => {
          currentIndex++
        }, loadingStates[currentIndex].duration)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) return null

  const currentStateData = loadingStates.find(s => s.state === activeState)
  const Icon = currentStateData?.icon || Search

  return (
    <div className="flex justify-start mb-3">
      <div className="max-w-[80%]">
        <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {currentStateData?.text}
            </span>
          </div>
          
          {/* Subtle progress indicator */}
          <div className="flex gap-0.5">
            {loadingStates.map((state, index) => {
              const isActive = state.state === activeState
              const isCompleted = loadingStates.findIndex(s => s.state === activeState) > index
              
              return (
                <div
                  key={state.state}
                  className={`w-1 h-1 rounded-full transition-all duration-700 ${
                    isCompleted 
                      ? 'bg-gray-500 dark:bg-gray-400' 
                      : isActive 
                        ? 'bg-gray-400 dark:bg-gray-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
