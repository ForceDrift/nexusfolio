import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Like from '@/models/Like';
import Video from '@/models/Video';
import { auth0 } from '@/lib/auth0';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Check if user already liked this video
    const existingLike = await Like.findOne({ userId: session.user.sub, videoId });
    if (existingLike) {
      return NextResponse.json({ error: 'Video already liked' }, { status: 400 });
    }

    // Create like
    const like = new Like({
      userId: session.user.sub,
      videoId: videoId,
    });

    await like.save();

    // Update video like count
    await Video.findByIdAndUpdate(videoId, {
      $inc: { 'metadata.likeCount': 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Video liked successfully',
      likeCount: (video.metadata.likeCount || 0) + 1,
    });
  } catch (error) {
    console.error('Error liking video:', error);
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

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Find and delete the like
    const deletedLike = await Like.findOneAndDelete({ 
      userId: session.user.sub, 
      videoId: videoId 
    });

    if (!deletedLike) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

    // Update video like count
    await Video.findByIdAndUpdate(videoId, {
      $inc: { 'metadata.likeCount': -1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Video unliked successfully',
      likeCount: Math.max((video.metadata.likeCount || 0) - 1, 0),
    });
  } catch (error) {
    console.error('Error unliking video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    // Check if user liked this video
    const like = await Like.findOne({ userId: session.user.sub, videoId });

    return NextResponse.json({
      success: true,
      isLiked: !!like,
    });
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
