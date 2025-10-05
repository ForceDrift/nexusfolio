import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string; // Auth0 user ID (sub)
  name: string;
  email: string;
  picture?: string;
  sub: string; // Auth0 user ID
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: [true, 'User ID (sub) is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    picture: {
      type: String,
      trim: true,
    },
    sub: {
      type: String,
      required: [true, 'Auth0 sub is required'],
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
UserSchema.index({ sub: 1 });
UserSchema.index({ email: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
