import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReport extends Document {
  userId: string;
  stockCode: string;
  companyName: string;
  reportType: 'analysis' | 'news' | 'research' | 'summary';
  title: string;
  content: string;
  reportDate: Date;
  metadata?: {
    source?: string;
    confidence?: number;
    tags?: string[];
    wordCount?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const ReportSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    stockCode: {
      type: String,
      required: [true, 'Stock code is required'],
      uppercase: true,
      trim: true,
      minlength: [1, 'Stock code cannot be empty'],
      maxlength: [10, 'Stock code cannot exceed 10 characters'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
    },
    reportType: {
      type: String,
      required: [true, 'Report type is required'],
      enum: ['analysis', 'news', 'research', 'summary'],
      default: 'analysis',
    },
    title: {
      type: String,
      required: [true, 'Report title is required'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Report content is required'],
    },
    reportDate: {
      type: Date,
      required: [true, 'Report date is required'],
      default: Date.now,
    },
    metadata: {
      source: {
        type: String,
        default: 'gemini-ai',
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.8,
      },
      tags: [{
        type: String,
        trim: true,
      }],
      wordCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
ReportSchema.index({ userId: 1, stockCode: 1, reportType: 1 });
ReportSchema.index({ userId: 1, reportDate: -1 });
ReportSchema.index({ stockCode: 1, reportType: 1 });

// Pre-save middleware to calculate word count
ReportSchema.pre('save', function(next) {
  if (this.content) {
    this.metadata.wordCount = this.content.split(/\s+/).length;
  }
  next();
});

const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;
