import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import dbConnect from '@/utils/dbConnect';
import Stock from '@/models/Stock';
import { isValidObjectId } from 'mongoose';

// DELETE /api/stocks?id=<stockId>&userId=<userId>
// Removes a stock for a user
export async function DELETE(request: NextRequest) {
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

    // Get parameters from URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, message: 'Stock ID and User ID are required' },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Stock ID format' },
        { status: 400 }
      );
    }

    // Verify the user owns this stock
    const deletedStock = await Stock.findOneAndDelete({ _id: id, userId });

    if (!deletedStock) {
      return NextResponse.json(
        { success: false, message: 'Stock not found or user not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Stock deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Failed to delete stock:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete stock', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
