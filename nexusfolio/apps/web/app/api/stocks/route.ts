import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'

// GET - Fetch all stocks for a specific user
export async function GET(request: NextRequest) {
  try {
    console.log('📖 Fetching stocks for user...')
    
    // Connect to MongoDB
    await dbConnect()
    
    // Get userId from query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'userId parameter is required'
      }, { status: 400 })
    }
    
    // Import mongoose to access the database
    const mongoose = require('mongoose')
    const db = mongoose.connection.db
    const stocksCollection = db.collection('stocks')
    
    // Find stocks for the specific user
    const stocks = await stocksCollection.find({ userId }).sort({ createdAt: -1 }).toArray()
    
    console.log(`✅ Found ${stocks.length} stocks for user ${userId}`)
    
    return NextResponse.json({
      success: true,
      message: `Found ${stocks.length} stocks for user`,
      data: stocks
    })
    
  } catch (error) {
    console.error('❌ Error fetching stocks:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch stocks',
      error: error.message
    }, { status: 500 })
  }
}

// POST - Add a new stock for a user
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Adding stock for user...')
    
    // Connect to MongoDB
    await dbConnect()
    
    // Get data from request body
    const body = await request.json()
    const { userId, stockCode } = body
    
    if (!userId || !stockCode) {
      return NextResponse.json({
        success: false,
        message: 'userId and stockCode are required'
      }, { status: 400 })
    }
    
    // Import mongoose to access the database
    const mongoose = require('mongoose')
    const db = mongoose.connection.db
    const stocksCollection = db.collection('stocks')
    
    // Check if stock already exists for this user
    const existingStock = await stocksCollection.findOne({ 
      userId, 
      stockCode: stockCode.toUpperCase().trim() 
    })
    
    if (existingStock) {
      return NextResponse.json({
        success: false,
        message: 'Stock already exists in your portfolio'
      }, { status: 409 })
    }
    
    // Create new stock document
    const newStock = {
      userId,
      stockCode: stockCode.toUpperCase().trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Insert the document
    const result = await stocksCollection.insertOne(newStock)
    
    console.log(`✅ Stock ${stockCode} added for user ${userId}`)
    
    return NextResponse.json({
      success: true,
      message: `Stock ${stockCode} added successfully`,
      data: {
        _id: result.insertedId,
        ...newStock
      }
    })
    
  } catch (error) {
    console.error('❌ Error adding stock:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to add stock',
      error: error.message
    }, { status: 500 })
  }
}

// DELETE - Remove a stock for a user
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Removing stock for user...')
    
    // Connect to MongoDB
    await dbConnect()
    
    // Get parameters from query string
    const { searchParams } = new URL(request.url)
    const stockId = searchParams.get('id')
    const userId = searchParams.get('userId')
    
    if (!stockId || !userId) {
      return NextResponse.json({
        success: false,
        message: 'id and userId parameters are required'
      }, { status: 400 })
    }
    
    // Import mongoose to access the database
    const mongoose = require('mongoose')
    const db = mongoose.connection.db
    const stocksCollection = db.collection('stocks')
    
    // Convert string ID to ObjectId
    const ObjectId = mongoose.Types.ObjectId
    
    // Delete the stock (ensure user can only delete their own stocks)
    const result = await stocksCollection.deleteOne({ 
      _id: new ObjectId(stockId), 
      userId 
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Stock not found or you do not have permission to delete it'
      }, { status: 404 })
    }
    
    console.log(`✅ Stock ${stockId} removed for user ${userId}`)
    
    return NextResponse.json({
      success: true,
      message: 'Stock removed successfully'
    })
    
  } catch (error) {
    console.error('❌ Error removing stock:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to remove stock',
      error: error.message
    }, { status: 500 })
  }
}
