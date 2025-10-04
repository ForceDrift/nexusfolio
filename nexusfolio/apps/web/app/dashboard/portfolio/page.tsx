import { auth0 } from "../../../lib/auth0";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function PortfolioPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={session.user} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <h1 className="text-2xl font-bold text-card-foreground">Portfolio</h1>
          <p className="text-muted-foreground">View and manage your complete investment portfolio</p>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="border-4 border-dashed border-border rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Portfolio Dashboard</h2>
              <p className="text-muted-foreground mb-6">
                This is the Portfolio page placeholder. Here you'll be able to:
              </p>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="bg-card p-4 rounded-lg border border-border text-left">
                  <h3 className="font-semibold mb-2 text-card-foreground">Features Coming Soon:</h3>
                  <ul className="text-card-foreground space-y-1 text-sm">
                    <li>• View portfolio overview and performance</li>
                    <li>• Track asset allocation and diversification</li>
                    <li>• Monitor portfolio value changes</li>
                    <li>• Analyze investment returns and metrics</li>
                    <li>• Rebalance portfolio automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
