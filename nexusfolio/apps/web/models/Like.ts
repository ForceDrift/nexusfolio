import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILike extends Document {
  userId: string; // Auth0 user ID
  videoId: string; // Video ID
  createdAt?: Date;
}

const LikeSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    videoId: {
      type: String,
      required: [true, 'Video ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one like per user per video
LikeSchema.index({ userId: 1, videoId: 1 }, { unique: true });

// Index for efficient queries
LikeSchema.index({ videoId: 1 });
LikeSchema.index({ userId: 1 });

const Like: Model<ILike> = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);

export default Like;
