import { auth0 } from "../lib/auth0";
import { Button } from "@workspace/ui/components/button"
import { Hero } from "@/components/hero"
import { HeroSectionOne } from "@/components/hero-section-one"
import { WobbleCardDemo } from "@/components/wobble-card-demo"
import { PageContent } from "@/components/page-content"

export default async function Page() {
  const session = await auth0.getSession();

  if (!session) {
    return <PageContent />;
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
