"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { CommandList } from "./command-list"
import { getCommandByText, type SlashCommand } from "@/lib/slash-commands"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [showCommands, setShowCommands] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      // Check if it's a slash command
      const command = getCommandByText(input.trim())
      if (command) {
        // Send the display text to the user, but the full prompt to the AI
        onSendMessage(command.displayText || command.command, command.prompt)
      } else {
        onSendMessage(input.trim())
      }
      setInput("")
      setShowCommands(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInput(value)
    
    // Show commands when user types '/'
    if (value === '/') {
      setShowCommands(true)
    } else if (value.startsWith('/')) {
      setShowCommands(true)
    } else {
      setShowCommands(false)
    }
  }

  const handleSelectCommand = (command: SlashCommand) => {
    setInput(command.command)
    setShowCommands(false)
    textareaRef.current?.focus()
  }

  const handleCloseCommands = () => {
    setShowCommands(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="bg-background/95 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-6 py-3">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type Here"
                className="min-h-[44px] max-h-24 resize-none bg-gray-100 dark:bg-gray-800 border-0 rounded-2xl px-4 py-3 focus:ring-0 transition-all text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
                disabled={isLoading}
              />
              
              {/* Command List */}
              <CommandList
                isVisible={showCommands}
                query={input}
                onSelectCommand={handleSelectCommand}
                onClose={handleCloseCommands}
              />
            </div>
            <Button
              type="submit"
              size="icon"
              className="h-[44px] w-[44px] shrink-0 rounded-full bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 border-0"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4 text-white" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
