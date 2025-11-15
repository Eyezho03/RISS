import { useState } from 'react'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAppContext } from '@/context/AppContext'
import { ReputationScore } from '@/components/ReputationScore'
import {
  Building2,
  Users,
  Award,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Settings,
} from 'lucide-react'
import type { KrnlTask, UserProfile } from '@/types/reputation'

export default function OrganizationDashboard(): JSX.Element {
  const { krnlTasks, reputation } = useAppContext()
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', scoreWeight: 50 })

  // Mock organization data
  const orgData = {
    id: 'org_1',
    name: 'Web3 Builders DAO',
    type: 'dao',
    description: 'A community of Web3 developers building the future',
    reputation: reputation.score,
    memberCount: 150,
    taskCount: krnlTasks.tasks.length,
    createdAt: new Date().toISOString(),
  }

  // Mock members
  const members: UserProfile[] = [
    {
      did: 'did:riss:member1',
      username: 'alice.eth',
      walletAddresses: ['0x1234...5678'],
      reputation: { total: 85, identity: 90, contribution: 80, trust: 75, social: 70, engagement: 65 },
      badges: [],
      activityCount: 42,
      verificationLevel: 'verified',
      joinedAt: new Date().toISOString(),
    },
    {
      did: 'did:riss:member2',
      username: 'bob.dev',
      walletAddresses: ['0xabcd...efgh'],
      reputation: { total: 72, identity: 75, contribution: 70, trust: 65, social: 60, engagement: 55 },
      badges: [],
      activityCount: 28,
      verificationLevel: 'verified',
      joinedAt: new Date().toISOString(),
    },
  ]

  const handleCreateTask = async (): Promise<void> => {
    if (!newTask.title || !newTask.description) return

    try {
      await krnlTasks.createTask({
        title: newTask.title,
        description: newTask.description,
        createdBy: orgData.id,
        requiredProofs: [],
        scoreWeight: newTask.scoreWeight,
      })
      setNewTask({ title: '', description: '', scoreWeight: 50 })
      setIsCreateTaskModalOpen(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const tasksByStatus = {
    open: krnlTasks.getTasksByStatus('open'),
    in_progress: krnlTasks.getTasksByStatus('in_progress'),
    completed: krnlTasks.getTasksByStatus('completed'),
    validated: krnlTasks.getTasksByStatus('validated'),
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          {/* Header */}
          <div className="bg-panel border-2 border-accent p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Building2 size={32} className="text-accent" />
                  <h1 className="font-display text-4xl font-bold text-accent">{orgData.name}</h1>
                </div>
                <p className="font-body text-muted">{orgData.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsSettingsModalOpen(true)}>
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users size={20} className="text-accent" />
                <div className="font-body text-sm text-muted">Members</div>
              </div>
              <div className="font-display text-2xl font-bold text-accent">{orgData.memberCount}</div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Award size={20} className="text-accent" />
                <div className="font-body text-sm text-muted">Tasks</div>
              </div>
              <div className="font-display text-2xl font-bold text-accent">{orgData.taskCount}</div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp size={20} className="text-accent" />
                <div className="font-body text-sm text-muted">Reputation</div>
              </div>
              <div className="font-display text-2xl font-bold text-accent">
                {orgData.reputation.total}
              </div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle2 size={20} className="text-accent" />
                <div className="font-body text-sm text-muted">Completed</div>
              </div>
              <div className="font-display text-2xl font-bold text-accent">
                {tasksByStatus.validated.length}
              </div>
            </div>
          </div>

          {/* Organization Reputation */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <h2 className="font-display text-2xl font-bold text-accent mb-6">Organization Reputation</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ReputationScore score={orgData.reputation} size="md" />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Active Members</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {members.filter((m) => m.activityCount > 0).length}
                    </div>
                  </div>
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Verified Members</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {members.filter((m) => m.verificationLevel === 'verified').length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Management */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-accent">Task Management</h2>
              <Button onClick={() => setIsCreateTaskModalOpen(true)}>
                <Plus size={16} className="mr-2" />
                Create Task
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(tasksByStatus).map(([status, tasks]) => (
                <div key={status} className="bg-bg border-2 border-muted/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-accent capitalize">
                      {status.replace('_', ' ')}
                    </h3>
                    <span className="font-body text-sm text-muted bg-panel px-2 py-1 border border-muted/20">
                      {tasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="bg-panel border-2 border-muted/20 p-2 cursor-pointer hover:border-accent transition-colors"
                      >
                        <h4 className="font-display text-sm font-bold text-accent mb-1">
                          {task.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">+{task.scoreWeight} pts</span>
                          {task.assignedTo && (
                            <span className="text-muted">Assigned</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div className="text-center py-4">
                        <p className="font-body text-xs text-muted">No tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <h2 className="font-display text-2xl font-bold text-accent mb-6">Top Contributors</h2>
            <div className="space-y-4">
              {members.map((member, index) => (
                <div
                  key={member.did}
                  className="bg-bg border-2 border-muted/20 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent/20 border-2 border-accent flex items-center justify-center">
                      <span className="font-display text-lg font-bold text-accent">
                        {member.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-accent">{member.username}</h3>
                      <p className="font-body text-sm text-muted">
                        {member.activityCount} activities • Score: {member.reputation.total}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-accent">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StaggerReveal>
      </div>

      {/* Create Task Modal */}
      <Modal
        open={isCreateTaskModalOpen}
        onOpenChange={setIsCreateTaskModalOpen}
        title="Create Organization Task"
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

      {/* Settings Modal */}
      <Modal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
        title="Organization Settings"
      >
        <div className="space-y-4">
          <Input label="Organization Name" defaultValue={orgData.name} />
          <div>
            <label className="font-display font-bold text-sm text-accent mb-2 block">
              Description
            </label>
            <textarea
              className="w-full bg-bg border-2 border-muted/20 p-3 font-body text-muted focus:border-accent focus:outline-none"
              rows={4}
              defaultValue={orgData.description}
            />
          </div>
          <Button className="w-full">Save Changes</Button>
        </div>
      </Modal>
    </div>
  )
}

