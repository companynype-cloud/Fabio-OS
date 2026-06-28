import Link from 'next/link'
import { db } from '@/lib/db'
import { Widget } from './widget'
import { formatDate } from '@/utils/format'
import { cn } from '@/lib/utils'

const PRIORITY_COLORS = {
  URGENT: 'bg-red-500',
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-blue-500',
  NONE: 'bg-[var(--surface-high)]',
} as const

const STATUS_LABELS = {
  INBOX: 'Inbox',
  TODO: 'A fazer',
  IN_PROGRESS: 'Em andamento',
  IN_REVIEW: 'Em revisão',
  DONE: 'Concluído',
  CANCELLED: 'Cancelado',
} as const

interface PriorityFocusProps {
  workspaceId: string
  workspaceSlug: string
}

export async function PriorityFocus({ workspaceId, workspaceSlug }: PriorityFocusProps) {
  const tasks = await db.task.findMany({
    where: {
      workspaceId,
      deletedAt: null,
      status: { in: ['INBOX', 'TODO', 'IN_PROGRESS', 'IN_REVIEW'] },
    },
    orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }, { sortOrder: 'asc' }],
    take: 5,
    select: {
      id: true,
      title: true,
      priority: true,
      status: true,
      dueDate: true,
      project: { select: { name: true, color: true } },
    },
  })

  const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date())

  const action = (
    <Link
      href={`/w/${workspaceSlug}/tarefas`}
      className="text-xs text-[var(--outline)] transition-colors hover:text-[var(--foreground)]"
    >
      Ver todas →
    </Link>
  )

  if (!tasks.length) {
    return (
      <Widget title="Foco do dia" action={action}>
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
          <div className="mb-2 text-2xl">✓</div>
          <p className="text-sm font-medium">Nenhuma tarefa pendente</p>
          <p className="mt-1 text-xs text-[var(--outline)]">Você está em dia!</p>
        </div>
      </Widget>
    )
  }

  return (
    <Widget title="Foco do dia" action={action}>
      {overdue.length > 0 && (
        <div className="border-b border-red-900/40 bg-red-950/30 px-4 py-2">
          <p className="text-xs text-red-400">
            {overdue.length} tarefa{overdue.length > 1 ? 's' : ''} em atraso
          </p>
        </div>
      )}
      <ul className="divide-y divide-[var(--border-subtle)]">
        {tasks.map((task) => {
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
          return (
            <li
              key={task.id}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface-base)]"
            >
              <span
                className={cn(
                  'mt-1.5 h-2 w-2 flex-shrink-0 rounded-full',
                  PRIORITY_COLORS[task.priority]
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{task.title}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  {task.project && (
                    <span
                      className="text-xs"
                      style={{ color: task.project.color ?? 'var(--outline)' }}
                    >
                      {task.project.name}
                    </span>
                  )}
                  {task.dueDate && (
                    <span
                      className={cn(
                        'text-xs',
                        isOverdue ? 'text-red-400' : 'text-[var(--outline)]'
                      )}
                    >
                      {isOverdue ? '⚠ ' : ''}
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                  <span className="text-xs text-[var(--outline)]">
                    {STATUS_LABELS[task.status]}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </Widget>
  )
}

export function PriorityFocusSkeleton() {
  return (
    <Widget title="Foco do dia">
      <ul className="divide-y divide-[var(--border-subtle)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex animate-pulse items-start gap-3 px-4 py-3">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--surface-high)]" />
            <div className="flex-1 space-y-1.5">
              <div
                className={cn(
                  'h-4 rounded bg-[var(--surface-high)]',
                  i % 2 === 0 ? 'w-full' : 'w-3/4'
                )}
              />
              <div className="h-3 w-1/3 rounded bg-[var(--surface-high)]" />
            </div>
          </li>
        ))}
      </ul>
    </Widget>
  )
}
