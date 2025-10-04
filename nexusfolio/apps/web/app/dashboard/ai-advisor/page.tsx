import { auth0 } from "../../../lib/auth0";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function AIAdvisorPage() {
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
          <h1 className="text-2xl font-bold text-card-foreground">AI Advisor</h1>
          <p className="text-muted-foreground">Get personalized investment advice powered by artificial intelligence</p>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="border-4 border-dashed border-border rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">AI Advisor Dashboard</h2>
              <p className="text-muted-foreground mb-6">
                This is the AI Advisor page placeholder. Here you'll be able to:
              </p>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="bg-card p-4 rounded-lg border border-border text-left">
                  <h3 className="font-semibold mb-2 text-card-foreground">Features Coming Soon:</h3>
                  <ul className="text-card-foreground space-y-1 text-sm">
                    <li>• Get personalized investment recommendations</li>
                    <li>• Chat with AI about market trends</li>
                    <li>• Receive risk assessment analysis</li>
                    <li>• Get portfolio optimization suggestions</li>
                    <li>• Access AI-powered market insights</li>
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
