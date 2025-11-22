export type KrnlTaskStatus = 'assigned' | 'in_progress' | 'submitted' | 'verified'

export interface KrnlTask {
  id: string
  title: string
  description: string
  status: KrnlTaskStatus
  weight: number
  points: number
  createdAt: string
  dueAt?: string
  verifier?: string
}

export interface KrnlReputationSummary {
  score: number
  identity: number
  contribution: number
  trust: number
  social: number
  engagement: number
}

export interface KrnlProfile {
  did: string
  wallets: string[]
  identityStrength: number
  badges: string[]
}

export interface KrnlState {
  profile: KrnlProfile
  reputation: KrnlReputationSummary
  tasks: KrnlTask[]
}

export class KrnlClient {
  async getState(): Promise<KrnlState> {
    const res = await fetch('/api/krnl/state')
    if (!res.ok) {
      throw new Error('Failed to fetch KRNL state')
    }
    return res.json()
  }

  async getTasks(): Promise<KrnlTask[]> {
    const res = await fetch('/api/krnl/tasks')
    if (!res.ok) {
      throw new Error('Failed to fetch tasks')
    }
    return res.json()
  }

  async updateTaskStatus(id: string, status: KrnlTaskStatus): Promise<KrnlTask> {
    const res = await fetch(`/api/krnl/tasks/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      throw new Error('Failed to update task status')
    }
    return res.json()
  }
}