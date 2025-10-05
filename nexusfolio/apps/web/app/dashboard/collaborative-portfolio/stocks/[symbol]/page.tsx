import { auth0 } from "../../../../../lib/auth0";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import CollaborativeStockDetailClient from "./collaborative-stock-detail-client";

interface CollaborativeStockDetailPageProps {
  params: {
    symbol: string;
  };
}

export default async function CollaborativeStockDetailPage({ params }: CollaborativeStockDetailPageProps) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/login");
  }

  const { symbol } = await params;

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={session.user} />
      
      {/* Main Content Area */}
      <CollaborativeStockDetailClient symbol={symbol} />
    </div>
  );
}
