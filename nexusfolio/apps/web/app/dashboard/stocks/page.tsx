import { auth0 } from "../../../lib/auth0";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { TrendingUp } from "lucide-react";
import { AddStockDropdown } from "@/components/add-stock-dropdown";
import { StocksPortfolio } from "@/components/stocks-portfolio";

export default async function StocksPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
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
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-7 h-7 text-black" />
              <h1 className="text-lg font-semibold text-gray-900">Stocks Dashboard</h1>
            </div>
            
            {/* Right side - Add Stock Button with Dropdown */}
            <AddStockDropdown />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <StocksPortfolio />
        </main>
      </div>
    </div>
  );
}
