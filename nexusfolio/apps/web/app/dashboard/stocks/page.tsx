import { auth0 } from "../../../lib/auth0";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { TrendingUp, BarChart3 } from "lucide-react";

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
            
            {/* Right side - Add Stock Button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full flex items-center space-x-1 transition-colors">
              <BarChart3 className="w-3 h-3" />
              <span className="text-sm">Add Stock</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Call to Action Container */}
          <div className="flex items-center justify-center min-h-full">
            <div className="max-w-sm mx-auto text-left">
              <div className="p-4">
                {/* Icon */}
                <div className="mb-3">
                  <BarChart3 className="w-8 h-8 text-black mb-2" />
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-gray-700 mb-2">Stocks</h2>
                
                {/* Description */}
                <p className="text-gray-500 mb-3 text-sm leading-relaxed">
                  Add your first stock to begin tracking your investments and getting AI-powered insights.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
                    Add Stock
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-3 py-1.5 rounded text-sm font-medium transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
