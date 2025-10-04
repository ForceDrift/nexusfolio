"use client"

import { useState, useEffect } from "react"
import { SLASH_COMMANDS, type SlashCommand } from "@/lib/slash-commands"

interface CommandListProps {
  isVisible: boolean
  query: string
  onSelectCommand: (command: SlashCommand) => void
  onClose: () => void
}

export function CommandList({ isVisible, query, onSelectCommand, onClose }: CommandListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [filteredCommands, setFilteredCommands] = useState<SlashCommand[]>([])

  useEffect(() => {
    if (query.startsWith('/')) {
      const searchQuery = query.slice(1) // Remove the '/' from the query
      const filtered = SLASH_COMMANDS.filter(cmd => 
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCommands(filtered)
      setSelectedIndex(0)
    } else {
      setFilteredCommands(SLASH_COMMANDS)
      setSelectedIndex(0)
    }
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            onSelectCommand(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, selectedIndex, filteredCommands, onSelectCommand, onClose])

  if (!isVisible || filteredCommands.length === 0) return null

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
        <div className="p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1 mb-1">
            Commands
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCommands.map((command, index) => {
              const Icon = command.icon;
              return (
                <button
                  key={command.command}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 ${
                    index === selectedIndex
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                  onClick={() => onSelectCommand(command)}
                >
                  <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {command.command}
                      </div>
                      <div className="text-xs font-mono text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                        preview
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {command.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
