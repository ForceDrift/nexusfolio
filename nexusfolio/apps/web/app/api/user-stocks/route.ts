import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import dbConnect from '@/utils/dbConnect';
import Stock from '@/models/Stock';

// GET /api/user-stocks
// Fetches all stocks for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get Auth0 session
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get user ID from Auth0 session
    const userId = session.user.sub;

    // Fetch user's stocks
    const stocks = await Stock.find({ userId }).sort({ createdAt: -1 });

    // Convert Mongoose documents to plain objects
    const plainStocks = stocks.map(stock => ({
      _id: stock._id.toString(),
      userId: stock.userId,
      stockCode: stock.stockCode,
      createdAt: stock.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: stock.updatedAt?.toISOString() || new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: plainStocks,
      message: `Found ${plainStocks.length} stocks for user`
    });

  } catch (error: any) {
    console.error('Error fetching user stocks:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch user stocks',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
