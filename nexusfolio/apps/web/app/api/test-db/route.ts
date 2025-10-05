import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Stock from '@/models/Stock';

export async function GET(request: NextRequest) {
  try {
    console.log('Test DB: Starting database connection test');
    
    // Check for MongoDB URI
    if (!process.env.MONGODB_URI) {
      console.error('Test DB: MONGODB_URI not configured');
      return NextResponse.json(
        { 
          success: false, 
          message: 'MONGODB_URI environment variable not configured',
          error: 'MONGODB_URI_MISSING'
        },
        { status: 500 }
      );
    }

    console.log('Test DB: MONGODB_URI is configured');
    console.log('Test DB: Connecting to database...');
    
    // Connect to database
    await dbConnect();
    console.log('Test DB: Database connected successfully');

    // Test a simple query
    console.log('Test DB: Testing database query...');
    const stockCount = await Stock.countDocuments();
    console.log('Test DB: Stock count:', stockCount);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connected: true,
        stockCount: stockCount,
        mongodbUri: process.env.MONGODB_URI ? 'configured' : 'missing'
      }
    });

  } catch (error: any) {
    console.error('Test DB: Database connection failed:', error);
    console.error('Test DB: Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: error.message,
        details: {
          name: error.name,
          message: error.message
        }
      },
      { status: 500 }
    );
  }
}
