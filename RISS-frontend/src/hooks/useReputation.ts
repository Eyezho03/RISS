import { useState, useEffect, useCallback } from 'react'
import type { ReputationScore, ActivityProof, ActivityType } from '@/types/reputation'

/**
 * useReputation Hook
 * Manages reputation scoring and activity proofs
 * Integrates with KRNL Protocol for task-based scoring and backend API.
 */
export function useReputation(address?: string | null) {
  const [score, setScore] = useState<ReputationScore>({
    total: 0,
    identity: 0,
    contribution: 0,
    trust: 0,
    social: 0,
    engagement: 0,
  })
  const [activities, setActivities] = useState<ActivityProof[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Calculate reputation score from activities
  const calculateScore = useCallback((proofs: ActivityProof[]): ReputationScore => {
    let identity = 0
    let contribution = 0
    let trust = 0
    let social = 0
    let engagement = 0

    proofs.forEach((proof) => {
      if (proof.verificationLevel !== 'verified') return

      const impact = proof.scoreImpact || 0

      switch (proof.type) {
        case 'verification':
        case 'certification':
          identity += impact
          break
        case 'github_commit':
        case 'github_pr':
        case 'krnl_task_completed':
        case 'bounty_completed':
          contribution += impact
          break
        case 'endorsement':
        case 'dao_vote':
          trust += impact
          break
        case 'github_issue':
        case 'dao_proposal':
          social += impact
          break
        case 'course_completion':
        case 'event_attendance':
          engagement += impact
          break
      }
    })

    // Cap each category at 100
    identity = Math.min(identity, 100)
    contribution = Math.min(contribution, 100)
    trust = Math.min(trust, 100)
    social = Math.min(social, 100)
    engagement = Math.min(engagement, 100)

    // Weighted total score
    const total = Math.round(
      identity * 0.25 +
        contribution * 0.35 +
        trust * 0.20 +
        social * 0.10 +
        engagement * 0.10
    )

    return { total, identity, contribution, trust, social, engagement }
  }, [])

  // Load activities and score
  useEffect(() => {
    const loadReputation = async (): Promise<void> => {
      setIsLoading(true)
      try {
        if (address) {
          // Primary path: load from backend API using wallet address
          const res = await fetch(`/api/reputation/${encodeURIComponent(address)}/breakdown`)
          if (res.ok) {
            const data = await res.json()

            const apiActivities: ActivityProof[] = (data.activities || []).map((a: any) => ({
              id: a.id,
              type: a.type as ActivityType,
              title: a.title,
              description: a.description ?? '',
              source: a.source,
              timestamp:
                typeof a.timestamp === 'string'
                  ? a.timestamp
                  : new Date(a.timestamp).toISOString(),
              verificationLevel: a.verificationLevel ?? 'pending',
              scoreImpact: a.scoreImpact ?? 0,
              metadata: a.metadata,
            }))

            setActivities(apiActivities)
            // Use backend-computed score as the source of truth
            setScore(data.score as ReputationScore)
            return
          }
        }

        // Fallback: local mock/storage when no address or API not available
        const stored = typeof window !== 'undefined'
          ? window.localStorage.getItem('riss_activities')
          : null
        const loadedActivities: ActivityProof[] = stored ? JSON.parse(stored) : []

        if (loadedActivities.length === 0) {
          const mockActivities: ActivityProof[] = [
            {
              id: '1',
              type: 'verification',
              title: 'Identity Verified',
              description: 'Identity document verified',
              source: 'RISS',
              timestamp: new Date().toISOString(),
              verificationLevel: 'verified',
              scoreImpact: 25,
            },
          ]
          setActivities(mockActivities)
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('riss_activities', JSON.stringify(mockActivities))
          }
          const calculatedScore = calculateScore(mockActivities)
          setScore(calculatedScore)
        } else {
          setActivities(loadedActivities)
          const calculatedScore = calculateScore(loadedActivities)
          setScore(calculatedScore)
        }
      } catch (error) {
        console.error('Failed to load reputation:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void loadReputation()
  }, [address, calculateScore])

  // Add new activity proof
  const addActivity = useCallback(
    async (activity: Omit<ActivityProof, 'id' | 'timestamp'>): Promise<void> => {
      const newActivity: ActivityProof = {
        ...activity,
        id: `activity_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        timestamp: new Date().toISOString(),
      }

      const updated = [...activities, newActivity]
      setActivities(updated)
      localStorage.setItem('riss_activities', JSON.stringify(updated))

      const newScore = calculateScore(updated)
      setScore(newScore)
    },
    [activities, calculateScore]
  )

  // Update activity verification status
  const updateActivityStatus = useCallback(
    (activityId: string, status: ActivityProof['verificationLevel']): void => {
      const updated = activities.map((activity) =>
        activity.id === activityId ? { ...activity, verificationLevel: status } : activity
      )
      setActivities(updated)
      localStorage.setItem('riss_activities', JSON.stringify(updated))

      const newScore = calculateScore(updated)
      setScore(newScore)
    },
    [activities, calculateScore]
  )

  return {
    score,
    activities,
    isLoading,
    addActivity,
    updateActivityStatus,
    refreshScore: () => {
      const newScore = calculateScore(activities)
      setScore(newScore)
    },
  }
}

