// models/Stock.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStock extends Document {
  userId: string;
  stockCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const StockSchema: Schema = new Schema(
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
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Ensure unique stockCode per user
StockSchema.index({ userId: 1, stockCode: 1 }, { unique: true });

const Stock: Model<IStock> = mongoose.models.Stock || mongoose.model<IStock>('Stock', StockSchema);

export default Stock;
