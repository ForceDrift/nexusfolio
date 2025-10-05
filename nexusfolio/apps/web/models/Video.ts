// models/Video.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVideo extends Document {
  userId: string;
  displayName: string;
  profileIcon?: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  visibility: 'private' | 'public' | 'team';
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  gcsUrl: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
  metadata: {
    uploadedAt: Date;
    lastAccessed?: Date;
    viewCount?: number;
    downloadCount?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const VideoSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [100, 'Display name cannot exceed 100 characters'],
    },
    profileIcon: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: ['tutorial', 'presentation', 'demo', 'meeting', 'other'],
      default: 'other',
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [50, 'Tag cannot exceed 50 characters'],
    }],
    visibility: {
      type: String,
      enum: ['private', 'public', 'team'],
      default: 'private',
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      unique: true, // Ensure unique file names
    },
    originalFileName: {
      type: String,
      required: [true, 'Original file name is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size cannot be negative'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    gcsUrl: {
      type: String,
      required: [true, 'GCS URL is required'],
    },
    thumbnailUrl: {
      type: String,
    },
    duration: {
      type: Number,
      min: [0, 'Duration cannot be negative'],
    },
    metadata: {
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
      lastAccessed: {
        type: Date,
      },
      viewCount: {
        type: Number,
        default: 0,
        min: [0, 'View count cannot be negative'],
      },
      downloadCount: {
        type: Number,
        default: 0,
        min: [0, 'Download count cannot be negative'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
VideoSchema.index({ userId: 1, createdAt: -1 }); // User's videos by creation date
VideoSchema.index({ userId: 1, category: 1 }); // User's videos by category
VideoSchema.index({ visibility: 1, createdAt: -1 }); // Public videos
VideoSchema.index({ tags: 1 }); // Videos by tags
VideoSchema.index({ 'metadata.viewCount': -1 }); // Most viewed videos

// Ensure unique fileName across all videos
VideoSchema.index({ fileName: 1 }, { unique: true });

const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;