import { auth0 } from "../../../lib/auth0";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Users, Eye } from "lucide-react";
import { CollaborativePortfolio } from "@/components/collaborative-portfolio";

interface SharedPortfolioPageProps {
  params: {
    token: string;
  };
}

export default async function SharedPortfolioPage({ params }: SharedPortfolioPageProps) {
  const session = await auth0.getSession();

  // For shared portfolios, we might want to allow viewing without authentication
  // or require authentication but with different permissions
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={session.user} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
        </header>

        {/* Title Section */}
        <div className="bg-white px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Shared Portfolio Title */}
            <div className="flex items-center space-x-2">
              <Eye className="w-6 h-6 text-gray-700" />
              <h1 className="text-xl font-semibold text-gray-900">Shared Portfolio</h1>
            </div>
            
            {/* Right side - Share Info */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Viewing shared portfolio</span>
              <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Shared
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <CollaborativePortfolio />
        </main>
      </div>
    </div>
  );
}
