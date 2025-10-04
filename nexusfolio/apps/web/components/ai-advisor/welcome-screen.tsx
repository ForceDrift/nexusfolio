"use client"
import { TrendingUp, MessageSquare, Shield, Target, Lightbulb } from "lucide-react"

const quickActions = [
  {
    icon: TrendingUp,
    prompt: "Investment recommendations for my portfolio",
    tooltip: "Get recommendations",
  },
  {
    icon: MessageSquare,
    prompt: "Current market trends and opportunities",
    tooltip: "Market trends",
  },
  {
    icon: Shield,
    prompt: "Risk assessment and portfolio analysis",
    tooltip: "Risk analysis",
  },
  {
    icon: Target,
    prompt: "Portfolio optimization strategies",
    tooltip: "Optimize portfolio",
  },
  {
    icon: Lightbulb,
    prompt: "Key market insights today",
    tooltip: "Market insights",
  },
]

interface WelcomeScreenProps {
  onQuickAction: (prompt: string) => void
}

export function WelcomeScreen({ onQuickAction }: WelcomeScreenProps) {
  return (
    <div className="flex-1 overflow-auto flex items-center justify-center">
      <div className="max-w-xl mx-auto px-6">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">AI Advisor</h2>
          <p className="text-sm text-muted-foreground">
            Ask about your investments
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all duration-200"
                  onClick={() => onQuickAction(action.prompt)}
                  title={action.tooltip}
                >
                  <Icon className="h-4 w-4 text-foreground/50 group-hover:text-foreground/70 transition-colors" />
                  
                  {/* Concise tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {action.tooltip}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-foreground"></div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
