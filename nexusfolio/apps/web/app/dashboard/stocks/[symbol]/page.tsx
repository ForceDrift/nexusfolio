import { auth0 } from "../../../../lib/auth0";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { StockNewsGenerator } from "@/components/stock-news-generator";

interface StockPageProps {
  params: {
    symbol: string;
  };
}

export default async function StockPage({ params }: StockPageProps) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { symbol } = params;

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">
                {decodeURIComponent(symbol)}
              </h1>
              <p className="text-muted-foreground">Stock Details & Analysis</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <StockNewsGenerator symbol={symbol} />
        </main>
      </div>
    </div>
  );
}
