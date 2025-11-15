import { useState, useEffect, useCallback } from 'react'
import type { KrnlTask } from '@/types/reputation'

/**
 * useKrnlTasks Hook
 * Manages KRNL Protocol task integration
 * Handles task creation, assignment, completion, and validation
 */
export function useKrnlTasks() {
  const [tasks, setTasks] = useState<KrnlTask[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load tasks
  useEffect(() => {
    const loadTasks = async (): Promise<void> => {
      setIsLoading(true)
      try {
        // Mock: Load from localStorage or KRNL API
        const stored = localStorage.getItem('krnl_tasks')
        const loadedTasks: KrnlTask[] = stored ? JSON.parse(stored) : []

        // Add mock tasks if empty
        if (loadedTasks.length === 0) {
          const mockTasks: KrnlTask[] = [
            {
              id: 'task_1',
              title: 'Implement RISS Dashboard',
              description: 'Build the main dashboard with reputation breakdown',
              status: 'open',
              createdBy: 'did:riss:org1',
              requiredProofs: ['github_commit', 'screenshot'],
              scoreWeight: 50,
              createdAt: new Date().toISOString(),
            },
          ]
          setTasks(mockTasks)
          localStorage.setItem('krnl_tasks', JSON.stringify(mockTasks))
        } else {
          setTasks(loadedTasks)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks')
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  // Create new task
  const createTask = useCallback(
    async (task: Omit<KrnlTask, 'id' | 'createdAt' | 'status'>): Promise<KrnlTask> => {
      setIsLoading(true)
      setError(null)

      try {
        const newTask: KrnlTask = {
          ...task,
          id: `task_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          status: 'open',
          createdAt: new Date().toISOString(),
        }

        const updated = [...tasks, newTask]
        setTasks(updated)
        localStorage.setItem('krnl_tasks', JSON.stringify(updated))

        return newTask
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create task'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [tasks]
  )

  // Update task status
  const updateTaskStatus = useCallback(
    (taskId: string, status: KrnlTask['status']): void => {
      const updated = tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : task.completedAt,
            validatedAt: status === 'validated' ? new Date().toISOString() : task.validatedAt,
          }
        }
        return task
      })
      setTasks(updated)
      localStorage.setItem('krnl_tasks', JSON.stringify(updated))
    },
    [tasks]
  )

  // Assign task to user
  const assignTask = useCallback(
    (taskId: string, userId: string): void => {
      const updated = tasks.map((task) =>
        task.id === taskId
          ? { ...task, assignedTo: userId, status: 'assigned' as const }
          : task
      )
      setTasks(updated)
      localStorage.setItem('krnl_tasks', JSON.stringify(updated))
    },
    [tasks]
  )

  // Submit proof for task completion
  const submitProof = useCallback(
    async (taskId: string, proofs: string[]): Promise<void> => {
      setIsLoading(true)
      setError(null)

      try {
        const updated = tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
              }
            : task
        )
        setTasks(updated)
        localStorage.setItem('krnl_tasks', JSON.stringify(updated))

        // In production, this would call KRNL Protocol smart contract
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to submit proof'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [tasks]
  )

  // Validate task (for verifiers)
  const validateTask = useCallback(
    (taskId: string, verifierId: string): void => {
      const updated = tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: 'validated' as const,
              validatedAt: new Date().toISOString(),
              verifier: verifierId,
            }
          : task
      )
      setTasks(updated)
      localStorage.setItem('krnl_tasks', JSON.stringify(updated))
    },
    [tasks]
  )

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTaskStatus,
    assignTask,
    submitProof,
    validateTask,
    getTasksByStatus: (status: KrnlTask['status']) =>
      tasks.filter((task) => task.status === status),
    getTasksByUser: (userId: string) =>
      tasks.filter((task) => task.assignedTo === userId || task.createdBy === userId),
  }
}

