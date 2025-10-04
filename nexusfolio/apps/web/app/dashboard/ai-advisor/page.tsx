import { auth0 } from "../../../lib/auth0";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/ai-advisor/chat-interface";
import { Header } from "@/components/ai-advisor/header";

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
        <Header />

        {/* Chat Interface */}
        <main className="flex-1 overflow-hidden">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}
