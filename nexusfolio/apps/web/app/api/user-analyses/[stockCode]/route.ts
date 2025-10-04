import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '../../../../lib/auth0';
import dbConnect from '../../../../utils/dbConnect';
import StockAnalysis from '../../../../models/StockAnalysis';

export async function GET(
  request: NextRequest,
  { params }: { params: { stockCode: string } }
) {
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

    const { stockCode } = await params;
    const userId = session.user.sub;

    // Get analysis for the specific user and stock
    const analysis = await StockAnalysis.findOne({ 
      userId, 
      stockCode: stockCode.toUpperCase() 
    }).lean();

    if (!analysis) {
      return NextResponse.json({
        success: false,
        message: 'Analysis not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        symbol: analysis.stockCode,
        companyName: analysis.companyName,
        analysisDate: analysis.analysisDate,
        markdownReport: analysis.markdownReport,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch analysis',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
