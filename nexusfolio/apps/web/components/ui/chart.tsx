import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
}

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({ config, children, className, ...props }: ChartContainerProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

export interface ChartTooltipProps {
  children: React.ReactNode
  content?: React.ComponentType<any>
}

export function ChartTooltip({ children, content: Content }: ChartTooltipProps) {
  return (
    <div className="relative">
      {children}
      {Content && <Content />}
    </div>
  )
}

export interface ChartTooltipContentProps {
  label?: string
  labelFormatter?: (value: any) => string
  formatter?: (value: any, name: string) => [string, string]
  indicator?: string
}

export function ChartTooltipContent({ 
  label, 
  labelFormatter, 
  formatter, 
  indicator = "line" 
}: ChartTooltipContentProps) {
  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <div className="grid gap-2">
        {label && (
          <div className="text-sm font-medium">
            {labelFormatter ? labelFormatter(label) : label}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Tooltip content
        </div>
      </div>
    </div>
  )
}

export interface ChartLegendProps {
  children: React.ReactNode
  content?: React.ComponentType<any>
}

export function ChartLegend({ children, content: Content }: ChartLegendProps) {
  return (
    <div className="flex items-center justify-center">
      {Content && <Content />}
    </div>
  )
}

export function ChartLegendContent() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 rounded-full bg-chart-1" />
        <span>Price</span>
      </div>
    </div>
  )
}
