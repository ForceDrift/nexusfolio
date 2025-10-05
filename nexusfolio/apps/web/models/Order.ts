import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: string;
  symbol: string;
  quantity: number;
  orderType: 'market' | 'limit' | 'stop';
  limitPrice?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  filledAt?: Date;
  filledPrice?: number;
  totalAmount?: number;
  portfolioId?: string; // For collaborative orders
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    orderType: {
      type: String,
      enum: ['market', 'limit', 'stop'],
      required: [true, 'Order type is required'],
    },
    limitPrice: {
      type: Number,
      min: [0, 'Limit price cannot be negative'],
    },
    stopPrice: {
      type: Number,
      min: [0, 'Stop price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'filled', 'cancelled', 'rejected'],
      default: 'pending',
      index: true,
    },
    filledAt: {
      type: Date,
    },
    filledPrice: {
      type: Number,
      min: [0, 'Filled price cannot be negative'],
    },
    totalAmount: {
      type: Number,
      min: [0, 'Total amount cannot be negative'],
    },
    portfolioId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
OrderSchema.index({ userId: 1, symbol: 1 });
OrderSchema.index({ portfolioId: 1, symbol: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
