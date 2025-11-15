import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  proofId: string;
  userId: mongoose.Types.ObjectId;
  activityType: string;
  title: string;
  description?: string;
  source: string;
  timestamp: Date;
  scoreImpact: number;
  verificationLevel: 'pending' | 'verified' | 'rejected';
  verifier?: string;
  metadata?: Record<string, unknown>;
  onChainTxHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    proofId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    source: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    scoreImpact: {
      type: Number,
      default: 0,
    },
    verificationLevel: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
      index: true,
    },
    verifier: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    onChainTxHash: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);

