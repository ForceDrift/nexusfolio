"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { User, Bot, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    analysisType?: string
    relevantStocks?: string[]
    sources?: string[]
  }
  isSlashCommand?: boolean
  aiContext?: string
}

export function MessageBubble({ role, content, timestamp, metadata, isSlashCommand, aiContext }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (role === "user") {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[70%]">
          {isSlashCommand ? (
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl rounded-br-md px-4 py-2.5 shadow-lg border border-slate-600/20">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-blue-300/90 tracking-wider">{content}</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 text-white rounded-2xl rounded-br-md px-4 py-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            </div>
          )}
          <div className="text-right mt-1">
            <span className="text-xs text-muted-foreground">
              {formatTime(timestamp)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-3 group">
      <div className="max-w-[80%]">
        <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
          <MarkdownRenderer content={content} />
          
          {/* Minimal metadata */}
          {metadata && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="flex gap-1 text-xs text-gray-600 dark:text-gray-400">
                {metadata.analysisType && (
                  <span className="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-xs">
                    {metadata.analysisType.replace('-', ' ')}
                  </span>
                )}
                {metadata.relevantStocks && metadata.relevantStocks.length > 0 && (
                  <span className="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-xs">
                    {metadata.relevantStocks.slice(0, 2).join(', ')}
                    {metadata.relevantStocks.length > 2 && ` +${metadata.relevantStocks.length - 2}`}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-xs text-muted-foreground">
            {formatTime(timestamp)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-40 hover:opacity-60 transition-opacity"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
