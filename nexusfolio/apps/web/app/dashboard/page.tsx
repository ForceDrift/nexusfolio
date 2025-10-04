import { auth0 } from "../../lib/auth0";
import { Button } from "@workspace/ui/components/button";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function Dashboard() {
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
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="border-4 border-dashed border-border rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to NexusFolio</h2>
              <p className="text-muted-foreground mb-6">
                Select a section from the sidebar to get started with your financial journey.
              </p>
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2 text-card-foreground">Quick Stats:</h3>
                  <p className="text-card-foreground"><strong>Name:</strong> {session.user.name}</p>
                  <p className="text-card-foreground"><strong>Email:</strong> {session.user.email}</p>
                  <p className="text-card-foreground"><strong>Account:</strong> Free Plan</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
