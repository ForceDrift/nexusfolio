import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '../../../../lib/auth0';
import dbConnect from '../../../../utils/dbConnect';
import Report from '../../../../models/Report';

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { reportId } = await params;

    const report = await Report.findOne({ 
      _id: reportId, 
      userId: session.user.sub 
    }).lean();

    if (!report) {
      return NextResponse.json({
        success: false,
        message: 'Report not found or not authorized'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch report'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, metadata } = body;

    await dbConnect();

    const { reportId } = await params;

    const updateData: any = { updatedAt: new Date() };
    
    if (title) updateData.title = title;
    if (content) {
      updateData.content = content;
      updateData['metadata.wordCount'] = content.split(/\s+/).length;
    }
    if (metadata) {
      updateData.metadata = { ...metadata };
    }

    const report = await Report.findOneAndUpdate(
      { _id: reportId, userId: session.user.sub },
      updateData,
      { new: true, runValidators: true }
    );

    if (!report) {
      return NextResponse.json({
        success: false,
        message: 'Report not found or not authorized'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: report,
      message: 'Report updated successfully'
    });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update report'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { reportId } = await params;

    const result = await Report.deleteOne({ 
      _id: reportId, 
      userId: session.user.sub 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Report not found or not authorized'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete report'
    }, { status: 500 });
  }
}
