import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { auth0 } from '@/lib/auth0';

// Collaboration model interfaces
interface ICollaboration extends Document {
  portfolioId: string;
  ownerId: string;
  collaborators: Array<{
    userId: string;
    email: string;
    role: 'viewer' | 'editor' | 'admin';
    invitedAt: Date;
    joinedAt?: Date;
  }>;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IPortfolioShare extends Document {
  portfolioId: string;
  sharedWith: string; // email
  sharedBy: string; // userId
  role: 'viewer' | 'editor' | 'admin';
  token: string; // unique share token
  expiresAt?: Date;
  createdAt: Date;
}

// GET - Get collaboration data for a portfolio
export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get('portfolioId') || 'default';

    // For now, we'll use a simple approach with the user's stocks
    // In a real app, you'd have a proper portfolio collection
    const collaboration = {
      portfolioId,
      ownerId: session.user.sub,
      collaborators: [
        {
          userId: session.user.sub,
          email: session.user.email || '',
          role: 'admin' as const,
          invitedAt: new Date(),
          joinedAt: new Date()
        }
      ],
      isPublic: false,
      sharedInsights: [
        {
          id: '1',
          author: session.user.name || 'You',
          content: 'Welcome to your collaborative portfolio! Share it with others to start collaborating.',
          timestamp: new Date().toISOString(),
          type: 'note'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: collaboration
    });
  } catch (error) {
    console.error('Error fetching collaboration data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Share portfolio with someone
export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { email, role = 'viewer', portfolioId = 'default' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a unique share token
    const shareToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);

    // Create share record (in a real app, you'd save this to database)
    const shareData = {
      portfolioId,
      sharedWith: email,
      sharedBy: session.user.sub,
      role,
      token: shareToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date()
    };

    // In a real app, you'd:
    // 1. Save the share record to database
    // 2. Send an email invitation
    // 3. Add the collaborator to the portfolio

    return NextResponse.json({
      success: true,
      message: `Portfolio shared with ${email}`,
      shareToken,
      shareUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/collaborative-portfolio/shared/${shareToken}`
    });
  } catch (error) {
    console.error('Error sharing portfolio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update collaboration settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { portfolioId = 'default', isPublic, collaboratorUpdates } = await request.json();

    // In a real app, you'd update the collaboration record in the database
    return NextResponse.json({
      success: true,
      message: 'Collaboration settings updated'
    });
  } catch (error) {
    console.error('Error updating collaboration settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove collaborator or revoke access
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const portfolioId = searchParams.get('portfolioId') || 'default';

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // In a real app, you'd remove the collaborator from the database
    return NextResponse.json({
      success: true,
      message: 'Collaborator removed'
    });
  } catch (error) {
    console.error('Error removing collaborator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
