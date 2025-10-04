import { auth0 } from "../lib/auth0";
import { Button } from "@workspace/ui/components/button"
import { Hero } from "@/components/hero"
import { HeroSectionOne } from "@/components/hero-section-one"
import { WobbleCardDemo } from "@/components/wobble-card-demo"

export default async function Page() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSectionOne />

        {/* Content sections to demonstrate scroll effect */}
        <WobbleCardDemo />

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
