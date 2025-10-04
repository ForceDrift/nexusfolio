import { Button } from "@workspace/ui/components/button"

export function Hero() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col items-center justify-center gap-8 text-center px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground">
          NexusFolio
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
          The future of financial technology is here. Discover, invest, and grow with cutting-edge solutions.
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="px-8">
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
