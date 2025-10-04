export function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Large circles */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/5 animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-chart-1/10 animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-40 w-40 h-40 rounded-full bg-chart-2/8 animate-pulse delay-2000" />
        
        {/* Squares */}
        <div className="absolute top-60 left-1/4 w-16 h-16 bg-chart-3/10 rotate-45 animate-pulse delay-500" />
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-chart-4/8 rotate-12 animate-pulse delay-1500" />
        
        {/* Triangles */}
        <div className="absolute top-32 right-1/3 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-chart-5/15 animate-pulse delay-300" />
        <div className="absolute bottom-60 left-1/3 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[24px] border-l-transparent border-r-transparent border-b-primary/10 animate-pulse delay-1200" />
        
        {/* Hexagons */}
        <div className="absolute top-1/2 left-16 w-12 h-12 bg-muted/20 rotate-45 animate-pulse delay-800" />
        <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-accent/15 rotate-12 animate-pulse delay-1800" />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/10 via-transparent to-background/20" />
    </div>
  )
}
