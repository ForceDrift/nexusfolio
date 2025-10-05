import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICollaborativeStock extends Document {
  portfolioId: string;
  addedBy: string; // userId who added the stock
  addedByName: string; // display name of who added it
  stockCode: string;
  notes?: string; // optional notes from the person who added it
  createdAt?: Date;
  updatedAt?: Date;
}

const CollaborativeStockSchema: Schema = new Schema(
  {
    portfolioId: {
      type: String,
      required: [true, 'Portfolio ID is required'],
      index: true,
    },
    addedBy: {
      type: String,
      required: [true, 'Added by user ID is required'],
      index: true,
    },
    addedByName: {
      type: String,
      required: [true, 'Added by name is required'],
      trim: true,
      maxlength: [100, 'Added by name cannot exceed 100 characters'],
    },
    stockCode: {
      type: String,
      required: [true, 'Stock code is required'],
      trim: true,
      uppercase: true,
      maxlength: [10, 'Stock code cannot exceed 10 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can't add the same stock twice to the same portfolio
CollaborativeStockSchema.index({ portfolioId: 1, stockCode: 1 }, { unique: true });

const CollaborativeStock: Model<ICollaborativeStock> = mongoose.models.CollaborativeStock || mongoose.model<ICollaborativeStock>('CollaborativeStock', CollaborativeStockSchema);

export default CollaborativeStock;
