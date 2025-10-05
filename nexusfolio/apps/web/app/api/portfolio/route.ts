import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET(request: NextRequest) {
  try {
    // Get the user session
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.sub;
    
    // Fetch user's stocks from the database
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-stocks?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user stocks: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      return NextResponse.json(
        { error: "Failed to fetch portfolio data" },
        { status: 500 }
      );
    }

    // Transform the data to match our Portfolio interface
    const portfolio = {
      stocks: data.data.map((userStock: any) => ({
        symbol: userStock.stockCode,
        name: userStock.stockName || userStock.stockCode,
        shares: userStock.shares || 0,
        sector: userStock.sector || 'Unknown',
        weight: 0, // Will be calculated based on current prices
        purchasePrice: userStock.purchasePrice || 0,
        currentPrice: 0, // Will be fetched from market data
        totalValue: 0, // Will be calculated
        gainLoss: 0, // Will be calculated
        gainLossPercent: 0 // Will be calculated
      })),
      totalValue: 0, // Will be calculated
      lastUpdated: new Date()
    };

    return NextResponse.json({ 
      success: true, 
      data: portfolio 
    });

  } catch (error) {
    console.error("Portfolio API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}