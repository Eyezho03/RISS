import mongoose, { Schema, Document } from 'mongoose';

export interface IVerificationRequest extends Document {
  requestId: string;
  userId: mongoose.Types.ObjectId;
  requestType: 'identity' | 'skill' | 'project' | 'krnl_contract';
  status: 'pending' | 'approved' | 'rejected';
  proofs: string[];
  submittedAt: Date;
  reviewedAt?: Date;
  reviewer?: string;
  comments?: string;
  onChainTxHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationRequestSchema = new Schema<IVerificationRequest>(
  {
    requestId: {
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
    requestType: {
      type: String,
      enum: ['identity', 'skill', 'project', 'krnl_contract'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    proofs: {
      type: [String],
      default: [],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    reviewer: {
      type: String,
    },
    comments: {
      type: String,
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

export const VerificationRequest = mongoose.model<IVerificationRequest>(
  'VerificationRequest',
  VerificationRequestSchema
);

