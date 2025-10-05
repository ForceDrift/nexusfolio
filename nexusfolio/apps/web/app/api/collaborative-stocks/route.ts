import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import CollaborativeStock from '@/models/CollaborativeStock';
import { auth0 } from '@/lib/auth0';

// GET - Get collaborative stocks for a portfolio
export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get('portfolioId') || 'default';

    const collaborativeStocks = await CollaborativeStock.find({ portfolioId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: collaborativeStocks
    });
  } catch (error) {
    console.error('Error fetching collaborative stocks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add a stock to collaborative portfolio
export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { stockCode, portfolioId = 'default', notes } = await request.json();

    if (!stockCode || !stockCode.trim()) {
      return NextResponse.json({ error: 'Stock code is required' }, { status: 400 });
    }

    // Check if stock already exists in this portfolio
    const existingStock = await CollaborativeStock.findOne({ 
      portfolioId, 
      stockCode: stockCode.trim().toUpperCase() 
    });

    if (existingStock) {
      return NextResponse.json({ 
        error: 'Stock already exists in this portfolio' 
      }, { status: 400 });
    }

    // Create new collaborative stock
    const collaborativeStock = new CollaborativeStock({
      portfolioId,
      addedBy: session.user.sub,
      addedByName: session.user.name || 'Unknown User',
      stockCode: stockCode.trim().toUpperCase(),
      notes: notes?.trim() || undefined
    });

    const savedStock = await collaborativeStock.save();

    return NextResponse.json({
      success: true,
      message: 'Stock added to collaborative portfolio',
      data: savedStock
    });
  } catch (error) {
    console.error('Error adding collaborative stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a stock from collaborative portfolio
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const stockId = searchParams.get('stockId');
    const portfolioId = searchParams.get('portfolioId') || 'default';

    if (!stockId) {
      return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
    }

    // Find the stock to check permissions
    const stock = await CollaborativeStock.findById(stockId);
    
    if (!stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    // Only allow the person who added it or portfolio owner to remove it
    // For now, we'll allow anyone with access to remove (in a real app, you'd check collaboration permissions)
    const deletedStock = await CollaborativeStock.findByIdAndDelete(stockId);

    if (!deletedStock) {
      return NextResponse.json({ error: 'Failed to delete stock' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Stock removed from collaborative portfolio'
    });
  } catch (error) {
    console.error('Error removing collaborative stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update stock notes
export async function PUT(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await dbConnect();

    const { stockId, notes } = await request.json();

    if (!stockId) {
      return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
    }

    const updatedStock = await CollaborativeStock.findByIdAndUpdate(
      stockId,
      { notes: notes?.trim() || undefined },
      { new: true }
    );

    if (!updatedStock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Stock notes updated',
      data: updatedStock
    });
  } catch (error) {
    console.error('Error updating collaborative stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
