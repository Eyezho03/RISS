import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  did: string;
  walletAddress: string;
  username?: string;
  email?: string;
  reputationScore: {
    total: number;
    identity: number;
    contribution: number;
    trust: number;
    social: number;
    engagement: number;
  };
  verificationLevel: 'unverified' | 'basic' | 'verified' | 'premium';
  socialAccounts?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    did: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      sparse: true,
    },
    email: {
      type: String,
      sparse: true,
    },
    reputationScore: {
      total: { type: Number, default: 0 },
      identity: { type: Number, default: 0 },
      contribution: { type: Number, default: 0 },
      trust: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
    },
    verificationLevel: {
      type: String,
      enum: ['unverified', 'basic', 'verified', 'premium'],
      default: 'unverified',
    },
    socialAccounts: {
      github: String,
      twitter: String,
      linkedin: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);

