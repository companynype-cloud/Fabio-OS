import { db } from '@/lib/db'
import { Widget } from './widget'
import { formatRelative } from '@/utils/format'

interface ActivityFeedProps {
  workspaceId: string
}

type ActivityItem = {
  id: string
  icon: string
  label: string
  time: Date | string
  meta?: string
}

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'm1',
    icon: '✅',
    label: 'Tarefa "Deploy staging" concluída',
    time: new Date(Date.now() - 15 * 60_000),
  },
  {
    id: 'm2',
    icon: '💡',
    label: 'Ideia "API de webhooks" criada',
    time: new Date(Date.now() - 45 * 60_000),
  },
  {
    id: 'm3',
    icon: '📝',
    label: 'Nota "Reunião cliente X" atualizada',
    time: new Date(Date.now() - 2 * 3_600_000),
  },
]

export async function ActivityFeed({ workspaceId }: ActivityFeedProps) {
  const since = new Date()
  since.setHours(since.getHours() - 24)

  const recentTasks = await db.task.findMany({
    where: {
      workspaceId,
      status: 'DONE',
      completedAt: { gte: since },
    },
    orderBy: { completedAt: 'desc' },
    take: 5,
    select: { id: true, title: true, completedAt: true },
  })

  const realActivity: ActivityItem[] = recentTasks.map((t) => ({
    id: t.id,
    icon: '✅',
    label: `Tarefa "${t.title}" concluída`,
    time: t.completedAt ?? new Date(),
  }))

  const allActivity = [...realActivity, ...MOCK_ACTIVITY]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8)

  return (
    <Widget title="Atividade recente">
      {allActivity.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
          <p className="text-sm text-[var(--outline)]">Nenhuma atividade recente</p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border-subtle)]">
          {allActivity.map((item) => (
            <li key={item.id} className="flex items-start gap-3 px-4 py-2.5">
              <span className="mt-0.5 flex-shrink-0 text-sm leading-none">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs">{item.label}</p>
                {item.meta && <p className="truncate text-xs text-[var(--outline)]">{item.meta}</p>}
              </div>
              <span className="flex-shrink-0 text-xs whitespace-nowrap text-[var(--outline)]">
                {formatRelative(item.time)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Widget>
  )
}

export function ActivityFeedSkeleton() {
  return (
    <Widget title="Atividade recente">
      <ul className="animate-pulse divide-y divide-[var(--border-subtle)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-start gap-3 px-4 py-2.5">
            <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded bg-[var(--surface-high)]" />
            <div className="flex-1">
              <div className="h-3 w-full rounded bg-[var(--surface-high)]" />
            </div>
            <div className="h-3 w-12 flex-shrink-0 rounded bg-[var(--surface-high)]" />
          </li>
        ))}
      </ul>
    </Widget>
  )
}
