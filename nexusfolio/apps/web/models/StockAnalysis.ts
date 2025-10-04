// models/StockAnalysis.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStockAnalysis extends Document {
  userId: string;
  stockCode: string;
  companyName: string;
  analysisDate: Date;
  markdownReport: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const StockAnalysisSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true, // Index for faster queries
    },
    stockCode: {
      type: String,
      required: [true, 'Stock code is required'],
      uppercase: true, // Store stock codes in uppercase
      trim: true,
      minlength: [1, 'Stock code cannot be empty'],
      maxlength: [10, 'Stock code cannot exceed 10 characters'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    analysisDate: {
      type: Date,
      required: [true, 'Analysis date is required'],
      default: Date.now,
    },
    markdownReport: {
      type: String,
      required: [true, 'Markdown report is required'],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Ensure unique analysis per user and stock (one analysis per user per stock)
StockAnalysisSchema.index({ userId: 1, stockCode: 1 }, { unique: true });

// Index for querying by user
StockAnalysisSchema.index({ userId: 1, createdAt: -1 });

const StockAnalysis: Model<IStockAnalysis> = mongoose.models.StockAnalysis || mongoose.model<IStockAnalysis>('StockAnalysis', StockAnalysisSchema);

export default StockAnalysis;
