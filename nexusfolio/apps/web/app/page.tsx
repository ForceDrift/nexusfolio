import { Button } from "@workspace/ui/components/button"
import { HeroSectionOne } from "../components/hero-section-one"
import { WobbleCardDemo } from "../components/wobble-card-demo"

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSectionOne />

      {/* Wobble Card Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <WobbleCardDemo />
        </div>
      </section>

      {/* Content sections to demonstrate scroll effect */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Investment Solutions</h3>
              <p className="text-muted-foreground">
                Advanced portfolio management with AI-driven insights and real-time market analysis.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Risk Management</h3>
              <p className="text-muted-foreground">
                Comprehensive risk assessment tools to protect and optimize your financial assets.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Market Analytics</h3>
              <p className="text-muted-foreground">
                Real-time market data and predictive analytics to inform your investment decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Transform Your Portfolio?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of investors who trust NexusFolio for their financial growth.
          </p>
          <Button size="lg" className="px-12">
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  )
}
