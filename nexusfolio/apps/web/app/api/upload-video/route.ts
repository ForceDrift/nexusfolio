import { NextRequest, NextResponse } from 'next/server';
import { uploadVideoToGCS } from '@/lib/gcs';
import { dbConnect } from '@/lib/mongodb';
import Video from '@/models/Video';
import User from '@/models/User';
import { auth0 } from '@/lib/auth0';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('video') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const visibility = formData.get('visibility') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'File must be a video' }, { status: 400 });
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 100MB' }, { status: 400 });
    }

    // Upload to Google Cloud Storage
    const uploadResult = await uploadVideoToGCS(file, title, {
      description,
      category,
      tags,
      visibility,
    });

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      );
    }

    // Connect to database
    await dbConnect();

    // Ensure user exists in database (create or update)
    let user = await User.findById(session.user.sub);
    if (!user) {
      // Create new user
      user = new User({
        _id: session.user.sub,
        name: session.user.name || 'Unknown User',
        email: session.user.email || '',
        picture: session.user.picture || '',
        sub: session.user.sub
      });
      await user.save();
      console.log('Created new user:', user.name);
    } else {
      // Update existing user info (in case it changed)
      user.name = session.user.name || user.name;
      user.email = session.user.email || user.email;
      user.picture = session.user.picture || user.picture;
      await user.save();
      console.log('Updated user info:', user.name);
    }

    // Parse tags
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    // Create video document
    const videoDoc = new Video({
      userId: session.user.sub,
      displayName: session.user.name || 'Unknown User',
      profileIcon: session.user.picture || '',
      title: title.trim(),
      description: description?.trim(),
      category: category || 'other',
      tags: tagsArray,
      visibility: visibility || 'public',
      fileName: uploadResult.fileName!,
      originalFileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      gcsUrl: uploadResult.url!,
      metadata: {
        uploadedAt: new Date(),
        viewCount: 0,
        downloadCount: 0,
        likeCount: 0,
      },
    });

    // Save to database
    const savedVideo = await videoDoc.save();

    return NextResponse.json({
      success: true,
      videoId: savedVideo._id,
      url: uploadResult.url,
      fileName: uploadResult.fileName,
      message: 'Video uploaded and saved successfully!',
      redirect: '/dashboard/nexus'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}