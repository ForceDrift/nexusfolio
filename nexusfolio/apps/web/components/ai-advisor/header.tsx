import { Brain } from "lucide-react"

export function Header() {
  return (
    <header className="bg-background/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-6 py-2">
        <div className="flex items-center justify-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/5">
            <Brain className="h-3 w-3 text-foreground/60" />
          </div>
        </div>
      </div>
    </header>
  )
}
