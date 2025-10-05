import { auth0 } from "../../../lib/auth0";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { CollaborationClient } from "./collaboration-client";

export default async function CollaborationPage() {
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
          <h1 className="text-2xl font-bold text-card-foreground">Nexus Collaboration</h1>
          <p className="text-muted-foreground">Connect, share, and collaborate on investment strategies with the Nexus community</p>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <CollaborationClient />
        </main>
      </div>
    </div>
  );
}
