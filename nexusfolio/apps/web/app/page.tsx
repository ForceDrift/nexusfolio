import { auth0 } from "../lib/auth0";
import { Button } from "@workspace/ui/components/button"
import { Hero } from "@/components/hero"
import { HeroSectionOne } from "@/components/hero-section-one"

export default async function Page() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSectionOne />

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
            <div className="space-x-4">
              <a href="/api/auth/login?screen_hint=signup">
                <Button size="lg" className="px-8">
                  Sign Up
                </Button>
              </a>
              <a href="/api/auth/login">
                <Button size="lg" variant="outline" className="px-8">
                  Log In
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Redirect logged-in users to dashboard
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.name}!</h1>
        <p className="text-muted-foreground mb-4">Redirecting to dashboard...</p>
        <script dangerouslySetInnerHTML={{
          __html: `setTimeout(() => { window.location.href = "/dashboard"; }, 1000);`
        }} />
      </div>
    </div>
  );
}
