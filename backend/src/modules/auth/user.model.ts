import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  knownDevices: string[];
  subscriptionTier: 'free' | 'pro';
  stripeCustomerId?: string;
  isAdmin: boolean;
  copilotChats: number;
  resumesGenerated: number;
  icons: { name: string; url: string }[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  firstName: { type: String },
  lastName: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  knownDevices: [{ type: String }],
  subscriptionTier: { type: String, enum: ['free', 'pro'], default: 'free' },
  stripeCustomerId: { type: String },
  isAdmin: { type: Boolean, default: false },
  copilotChats: { type: Number, default: 0 },
  resumesGenerated: { type: Number, default: 0 },
  icons: [{ 
    name: { type: String, required: true },
    url: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
