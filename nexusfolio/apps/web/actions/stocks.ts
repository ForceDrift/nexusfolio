'use server';

import dbConnect from '@/utils/dbConnect';
import Stock from '@/models/Stock';
import { isValidObjectId } from 'mongoose';

export interface StockData {
  _id: string;
  userId: string;
  stockCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionResult {
  success: boolean;
  message: string;
  data?: StockData | StockData[];
  error?: string;
}

// GET - Fetch all stocks for a user
export async function getUserStocks(userId: string): Promise<ActionResult> {
  try {
    await dbConnect();
    
    if (!userId) {
      return { success: false, message: 'User ID is required' };
    }

    const stocks = await Stock.find({ userId }).sort({ createdAt: -1 });
    
    // Convert Mongoose documents to plain objects
    const plainStocks = stocks.map(stock => ({
      _id: stock._id.toString(),
      userId: stock.userId,
      stockCode: stock.stockCode,
      createdAt: stock.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: stock.updatedAt?.toISOString() || new Date().toISOString()
    }));
    
    return { 
      success: true, 
      message: `Fetched ${plainStocks.length} stocks`,
      data: plainStocks
    };
  } catch (error: any) {
    console.error('Failed to fetch stocks:', error);
    return { 
      success: false, 
      message: 'Failed to fetch stocks', 
      error: error.message 
    };
  }
}

// POST - Add a new stock for a user
export async function addUserStock(userId: string, stockCode: string): Promise<ActionResult> {
  try {
    await dbConnect();
    
    if (!userId || !stockCode) {
      return { success: false, message: 'User ID and Stock Code are required' };
    }

    // Check for existing stock to prevent duplicates
    const existingStock = await Stock.findOne({ userId, stockCode: stockCode.toUpperCase() });
    if (existingStock) {
      return { 
        success: false, 
        message: `Stock ${stockCode.toUpperCase()} already exists for this user` 
      };
    }

    const newStock = await Stock.create({ userId, stockCode });
    
    // Convert Mongoose document to plain object
    const plainStock = {
      _id: newStock._id.toString(),
      userId: newStock.userId,
      stockCode: newStock.stockCode,
      createdAt: newStock.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: newStock.updatedAt?.toISOString() || new Date().toISOString()
    };
    
    return { 
      success: true, 
      message: `Stock ${plainStock.stockCode} added successfully!`,
      data: plainStock
    };
  } catch (error: any) {
    console.error('Failed to add stock:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return { success: false, message: messages.join(', ') };
    }
    
    return { 
      success: false, 
      message: 'Failed to add stock', 
      error: error.message 
    };
  }
}

// DELETE - Remove a stock for a user
export async function deleteUserStock(stockId: string, userId: string): Promise<ActionResult> {
  try {
    await dbConnect();
    
    if (!stockId || !userId) {
      return { success: false, message: 'Stock ID and User ID are required' };
    }

    if (!isValidObjectId(stockId)) {
      return { success: false, message: 'Invalid Stock ID format' };
    }

    const deletedStock = await Stock.findOneAndDelete({ _id: stockId, userId });

    if (!deletedStock) {
      return { 
        success: false, 
        message: 'Stock not found or user not authorized' 
      };
    }

    return { 
      success: true, 
      message: 'Stock deleted successfully' 
    };
  } catch (error: any) {
    console.error('Failed to delete stock:', error);
    return { 
      success: false, 
      message: 'Failed to delete stock', 
      error: error.message 
    };
  }
}
