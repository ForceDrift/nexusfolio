import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Video from '@/models/Video';
import { auth0 } from '@/lib/auth0';

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const visibility = searchParams.get('visibility');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query - show all public videos and user's own videos
    const query: any = {
      $or: [
        { visibility: 'public' }, // Show all public videos
        { userId: session.user.sub } // Show user's own videos regardless of visibility
      ]
    };
    
    if (category && category !== 'all') {
      query.$and = [{ category }];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [videos, totalCount] = await Promise.all([
      Video.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v') // Exclude version field
        .lean(), // Return plain objects for better performance
      Video.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        videos,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user session
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Find and delete video (only if user owns it)
    const deletedVideo = await Video.findOneAndDelete({
      _id: videoId,
      userId: session.user.sub,
    });

    if (!deletedVideo) {
      return NextResponse.json({ error: 'Video not found or access denied' }, { status: 404 });
    }

    // TODO: Also delete from Google Cloud Storage
    // await deleteVideoFromGCS(deletedVideo.fileName);

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}