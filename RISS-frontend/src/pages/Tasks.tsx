import { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { CheckCircle2, Clock, FileText, Plus, X } from 'lucide-react'
import type { KrnlTask } from '@/types/reputation'

export default function Tasks(): JSX.Element {
  const { krnlTasks, did } = useAppContext()
  const [selectedTask, setSelectedTask] = useState<KrnlTask | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', scoreWeight: 50 })

  const statusColors = {
    open: 'border-muted text-muted',
    assigned: 'border-blue-500 text-blue-500',
    in_progress: 'border-yellow-500 text-yellow-500',
    completed: 'border-green-500 text-green-500',
    validated: 'border-accent text-accent',
  }

  const handleCreateTask = async (): Promise<void> => {
    if (!newTask.title || !newTask.description) return

    try {
      await krnlTasks.createTask({
        title: newTask.title,
        description: newTask.description,
        createdBy: did.did || 'anonymous',
        requiredProofs: [],
        scoreWeight: newTask.scoreWeight,
      })
      setNewTask({ title: '', description: '', scoreWeight: 50 })
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleTaskClick = (task: KrnlTask): void => {
    setSelectedTask(task)
    setIsDetailsModalOpen(true)
  }

  const handleSubmitProof = async (taskId: string): Promise<void> => {
    try {
      await krnlTasks.submitProof(taskId, [])
      setIsDetailsModalOpen(false)
    } catch (error) {
      console.error('Failed to submit proof:', error)
    }
  }

  const tasksByStatus = {
    open: krnlTasks.getTasksByStatus('open'),
    assigned: krnlTasks.getTasksByStatus('assigned'),
    in_progress: krnlTasks.getTasksByStatus('in_progress'),
    completed: krnlTasks.getTasksByStatus('completed'),
    validated: krnlTasks.getTasksByStatus('validated'),
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-accent mb-2">KRNL Tasks</h1>
              <p className="font-body text-muted">
                Complete tasks to build your reputation and earn RISS points
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Create Task
            </Button>
          </div>

          {/* Task Board - Kanban Style */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(tasksByStatus).map(([status, tasks]) => (
              <div key={status} className="bg-panel border-2 border-muted/20 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-accent capitalize">{status.replace('_', ' ')}</h3>
                  <span className="font-body text-sm text-muted bg-bg px-2 py-1 border border-muted/20">
                    {tasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`bg-bg border-2 ${statusColors[status as keyof typeof statusColors]} p-3 cursor-pointer hover:bg-panel transition-colors`}
                      onClick={() => handleTaskClick(task)}
                    >
                      <h4 className="font-display font-bold text-accent mb-1">{task.title}</h4>
                      <p className="font-body text-xs text-muted line-clamp-2 mb-2">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">+{task.scoreWeight} pts</span>
                        {task.assignedTo && (
                          <span className="text-muted">Assigned</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-8">
                      <p className="font-body text-sm text-muted">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </StaggerReveal>
      </div>

      {/* Create Task Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create KRNL Task"
      >
        <div className="space-y-4">
          <Input
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Enter task title"
          />
          <div>
            <label className="font-display font-bold text-sm text-accent mb-2 block">
              Description
            </label>
            <textarea
              className="w-full bg-bg border-2 border-muted/20 p-3 font-body text-muted focus:border-accent focus:outline-none"
              rows={4}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Enter task description"
            />
          </div>
          <Input
            label="Score Weight"
            type="number"
            value={newTask.scoreWeight.toString()}
            onChange={(e) =>
              setNewTask({ ...newTask, scoreWeight: parseInt(e.target.value) || 0 })
            }
            placeholder="50"
          />
          <Button onClick={handleCreateTask} className="w-full">
            Create Task
          </Button>
        </div>
      </Modal>

      {/* Task Details Modal */}
      <Modal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        title={selectedTask?.title || 'Task Details'}
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <h4 className="font-display font-bold text-accent mb-2">Description</h4>
              <p className="font-body text-muted">{selectedTask.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-body text-sm text-muted mb-1">Status</div>
                <div className="font-display font-bold text-accent capitalize">
                  {selectedTask.status.replace('_', ' ')}
                </div>
              </div>
              <div>
                <div className="font-body text-sm text-muted mb-1">Score Weight</div>
                <div className="font-display font-bold text-accent">
                  +{selectedTask.scoreWeight} pts
                </div>
              </div>
            </div>
            {selectedTask.requiredProofs.length > 0 && (
              <div>
                <h4 className="font-display font-bold text-accent mb-2">Required Proofs</h4>
                <ul className="space-y-1">
                  {selectedTask.requiredProofs.map((proof, index) => (
                    <li key={index} className="font-body text-sm text-muted">
                      • {proof}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedTask.status === 'assigned' && selectedTask.assignedTo === did.did && (
              <Button onClick={() => handleSubmitProof(selectedTask.id)} className="w-full">
                <CheckCircle2 size={16} className="mr-2" />
                Submit Proof
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

