import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '../../../lib/auth0';
import dbConnect from '../../../utils/dbConnect';
import StockAnalysis from '../../../models/StockAnalysis';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required' 
        },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const stockCode = searchParams.get('stockCode');
    const userId = session.user.sub;

    let query: any = { userId };
    
    // If specific stock code is provided, filter by it
    if (stockCode) {
      query.stockCode = stockCode.toUpperCase();
    }

    // Get analyses for the user, sorted by creation date (newest first)
    const analyses = await StockAnalysis.find(query)
      .sort({ createdAt: -1 })
      .select('stockCode companyName analysisDate createdAt updatedAt')
      .lean();

    return NextResponse.json({
      success: true,
      data: analyses
    });

  } catch (error) {
    console.error('Error fetching user analyses:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch analyses',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required' 
        },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const stockCode = searchParams.get('stockCode');
    const userId = session.user.sub;

    if (!stockCode) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Stock code is required' 
        },
        { status: 400 }
      );
    }

    // Delete analysis for the specific user and stock
    const result = await StockAnalysis.deleteOne({ 
      userId, 
      stockCode: stockCode.toUpperCase() 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Analysis not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Analysis deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting analysis:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete analysis',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
