import { useMemo } from 'react'
import { KanbanSquare, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useKrnl } from '@/krnl/KrnlContext'

const statusOrder = ['assigned', 'in_progress', 'submitted', 'verified'] as const

const statusLabels: Record<(typeof statusOrder)[number], string> = {
  assigned: 'Assigned',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  verified: 'Verified',
}

export default function Tasks() {
  const { state, loading, updateTaskStatus } = useKrnl()

  const columns = useMemo(() => {
    const tasks = state?.tasks ?? []
    return statusOrder.map((status) => ({
      status,
      tasks: tasks.filter((t) => t.status === status),
    }))
  }, [state?.tasks])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-primary mb-1">
            KRNL Tasks
          </h1>
          <p className="text-sm text-text-muted">
            Tasks linked to your score.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-text-muted">
          <KanbanSquare className="w-5 h-5 text-accent" />
          <span>Kanban view</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((column) => (
          <Card key={column.status} variant="glass">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-text-primary">
                {statusLabels[column.status]}
              </h2>
              <span className="text-xs text-text-muted">
                {column.tasks.length} tasks
              </span>
            </div>
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {loading && !state && (
                <div className="text-sm text-text-muted">Loading tasks...</div>
              )}
              {!loading && column.tasks.length === 0 && (
                <div className="text-sm text-text-muted">No tasks in this column</div>
              )}
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-bg-secondary rounded-card border border-border hover:border-accent/40 hover:bg-bg-panel transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-sm font-medium text-text-primary mb-1">
                        {task.title}
                      </div>
                      <p className="text-xs text-text-muted line-clamp-3">
                        {task.description}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-accent-soft text-accent rounded-button whitespace-nowrap">
                      {task.points} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>Weight: {task.weight}</span>
                    {task.dueAt && <span>Due: {task.dueAt}</span>}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">
                      {task.verifier ? `Verifier: ${task.verifier}` : 'Unassigned verifier'}
                    </span>
                    {task.status !== 'verified' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const currentIndex = statusOrder.indexOf(task.status)
                          const nextStatus = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)]
                          void updateTaskStatus(task.id, nextStatus)
                        }}
                        className="text-[11px] px-2 py-1"
                      >
                        Advance
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                    {task.status === 'verified' && (
                      <span className="inline-flex items-center text-[11px] text-success">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


