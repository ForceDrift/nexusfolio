"use client"

import { useState } from "react"
import { WelcomeScreen } from "./welcome-screen"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    analysisType?: string
    relevantStocks?: string[]
    sources?: string[]
  }
  isSlashCommand?: boolean
  aiContext?: string // The full prompt sent to AI for slash commands
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string, aiContext?: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      isSlashCommand: !!aiContext,
      aiContext
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // BACKEND TODO: Replace this with actual Gemini API call
      // See /api/chat/route.ts for implementation details
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: aiContext || content, history: messages }),
      })

      const data = await response.json()

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        metadata: data.metadata
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 ? (
        <WelcomeScreen onQuickAction={handleQuickAction} />
      ) : (
        <ChatMessages messages={messages} isLoading={isLoading} />
      )}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}
