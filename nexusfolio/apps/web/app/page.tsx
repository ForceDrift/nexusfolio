import { auth0 } from "../lib/auth0";
import { Button } from "@workspace/ui/components/button"
import { Hero } from "@/components/hero"
import { HeroSectionOne } from "@/components/hero-section-one"
import { WobbleCardDemo } from "@/components/wobble-card-demo"
import { PageContent } from "@/components/page-content"
import { Grid } from 'ldrs/react';
import 'ldrs/react/Grid.css';

export default async function Page() {
  const session = await auth0.getSession();

  if (!session) {
    return <PageContent />;
  }

  // Redirect logged-in users to dashboard
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Welcome, {session.user.name}!</h1>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
        
        {/* Loading Grid */}
        <div className="flex justify-center">
          <Grid
            size="60"
            speed="1.5"
            color="black" 
          />
        </div>
        
        <script dangerouslySetInnerHTML={{
          __html: `setTimeout(() => { window.location.href = "/dashboard"; }, 2000);`
        }} />
      </div>
    </div>
  );
}
