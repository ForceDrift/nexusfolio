import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '../../../lib/auth0';
import dbConnect from '../../../utils/dbConnect';
import Report from '../../../models/Report';

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const stockCode = searchParams.get('stockCode');
    const reportType = searchParams.get('reportType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    const query: any = { userId: session.user.sub };
    
    if (stockCode) {
      query.stockCode = stockCode.toUpperCase();
    }
    
    if (reportType) {
      query.reportType = reportType;
    }

    const reports = await Report.find(query)
      .sort({ reportDate: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    const total = await Report.countDocuments(query);

    return NextResponse.json({ 
      success: true, 
      data: reports,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { stockCode, companyName, reportType, title, content, metadata } = body;

    if (!stockCode || !companyName || !title || !content) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: stockCode, companyName, title, content' 
      }, { status: 400 });
    }

    await dbConnect();

    const report = new Report({
      userId: session.user.sub,
      stockCode: stockCode.toUpperCase(),
      companyName,
      reportType: reportType || 'analysis',
      title,
      content,
      reportDate: new Date(),
      metadata: {
        source: 'gemini-ai',
        confidence: 0.8,
        tags: [],
        wordCount: content.split(/\s+/).length,
        ...metadata
      }
    });

    await report.save();

    return NextResponse.json({ 
      success: true, 
      data: report,
      message: 'Report created successfully' 
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ success: false, message: 'Failed to create report' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');
    const stockCode = searchParams.get('stockCode');

    if (!reportId && !stockCode) {
      return NextResponse.json({ 
        success: false, 
        message: 'Either reportId or stockCode is required' 
      }, { status: 400 });
    }

    await dbConnect();

    let result;
    if (reportId) {
      result = await Report.deleteOne({ 
        _id: reportId, 
        userId: session.user.sub 
      });
    } else {
      result = await Report.deleteMany({ 
        stockCode: stockCode!.toUpperCase(), 
        userId: session.user.sub 
      });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Report(s) not found or not authorized' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${result.deletedCount} report(s) successfully` 
    });
  } catch (error) {
    console.error('Error deleting reports:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete reports' }, { status: 500 });
  }
}
