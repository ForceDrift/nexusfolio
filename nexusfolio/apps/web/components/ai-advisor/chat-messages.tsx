"use client"

import { useEffect, useRef } from "react"
import type { Message } from "./chat-interface"
import { MessageBubble } from "./message-bubble"
import { LoadingStates } from "./loading-states"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto px-6 py-3">
        <div className="space-y-1">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              metadata={message.metadata}
              isSlashCommand={message.isSlashCommand}
              aiContext={message.aiContext}
            />
          ))}
          <LoadingStates isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
