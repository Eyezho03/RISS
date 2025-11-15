/**
 * RISS Reputation Types
 * Core types for the Reputation & Identity Scoring System
 */

export interface ReputationScore {
  total: number
  identity: number
  contribution: number
  trust: number
  social: number
  engagement: number
}

export interface ActivityProof {
  id: string
  type: ActivityType
  title: string
  description: string
  source: string
  timestamp: string
  verificationLevel: 'pending' | 'verified' | 'rejected'
  scoreImpact: number
  metadata?: Record<string, unknown>
}

export type ActivityType =
  | 'github_commit'
  | 'github_pr'
  | 'github_issue'
  | 'krnl_task_completed'
  | 'krnl_task_created'
  | 'dao_vote'
  | 'dao_proposal'
  | 'transaction'
  | 'certification'
  | 'course_completion'
  | 'endorsement'
  | 'verification'
  | 'bounty_completed'
  | 'audit'
  | 'event_attendance'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  category: 'identity' | 'contribution' | 'trust' | 'achievement'
}

export interface VerificationRequest {
  id: string
  type: 'identity' | 'skill' | 'project' | 'krnl_contract'
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  verifier?: string
  proofs: string[]
  comments?: string
}

export interface KrnlTask {
  id: string
  title: string
  description: string
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'validated'
  createdBy: string
  assignedTo?: string
  requiredProofs: string[]
  scoreWeight: number
  verifier?: string
  createdAt: string
  completedAt?: string
  validatedAt?: string
}

export interface UserProfile {
  did: string
  username: string
  avatar?: string
  walletAddresses: string[]
  reputation: ReputationScore
  badges: Badge[]
  activityCount: number
  verificationLevel: 'unverified' | 'basic' | 'verified' | 'premium'
  joinedAt: string
  socialAccounts?: {
    github?: string
    twitter?: string
    linkedin?: string
  }
}

export interface Organization {
  id: string
  name: string
  type: 'dao' | 'project' | 'community' | 'grant_program'
  description: string
  reputation: ReputationScore
  memberCount: number
  taskCount: number
  createdAt: string
}

