import { forwardRef } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
        <input
          className={cn(
            "flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

AuthInput.displayName = "AuthInput"
