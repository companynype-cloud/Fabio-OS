import Link from 'next/link'
import { db } from '@/lib/db'
import { Widget } from './widget'
import { cn } from '@/lib/utils'

interface HabitsTodayProps {
  workspaceId: string
  userId: string
  workspaceSlug: string
}

export async function HabitsToday({ workspaceId, userId, workspaceSlug }: HabitsTodayProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const habits = await db.habit.findMany({
    where: {
      workspaceId,
      createdById: userId,
      deletedAt: null,
    },
    include: {
      logs: {
        where: {
          date: { gte: today, lt: tomorrow },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
    take: 8,
  })

  const completed = habits.filter((h) => h.logs.length > 0).length
  const total = habits.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const action = (
    <Link
      href={`/w/${workspaceSlug}/habitos`}
      className="text-xs text-[var(--outline)] transition-colors hover:text-[var(--foreground)]"
    >
      Ver todos →
    </Link>
  )

  if (!habits.length) {
    return (
      <Widget title="Hábitos" action={action}>
        <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
          <p className="text-sm font-medium">Nenhum hábito cadastrado</p>
          <Link
            href={`/w/${workspaceSlug}/habitos`}
            className="mt-2 text-xs text-[var(--primary)] hover:underline"
          >
            Criar primeiro hábito
          </Link>
        </div>
      </Widget>
    )
  }

  return (
    <Widget title="Hábitos" action={action}>
      <div className="px-4 pt-3 pb-2">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-[var(--outline)]">
            {completed}/{total} concluídos
          </span>
          <span className="text-xs font-medium">{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-high)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="space-y-1.5 px-4 pb-3">
        {habits.map((habit) => {
          const done = habit.logs.length > 0
          return (
            <li key={habit.id} className="flex items-center gap-2.5">
              <button
                className={cn(
                  'h-5 w-5 flex-shrink-0 rounded border transition-all',
                  done
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                    : 'border-[var(--border)] hover:border-[var(--outline)]'
                )}
                aria-label={done ? 'Desmarcar' : 'Marcar como feito'}
              >
                {done && (
                  <svg className="mx-auto h-3 w-3" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span
                className={cn(
                  'flex-1 truncate text-sm',
                  done && 'text-[var(--outline)] line-through'
                )}
              >
                {habit.icon && <span className="mr-1.5">{habit.icon}</span>}
                {habit.title}
              </span>
            </li>
          )
        })}
      </ul>
    </Widget>
  )
}

export function HabitsTodaySkeleton() {
  return (
    <Widget title="Hábitos">
      <div className="animate-pulse px-4 pt-3 pb-2">
        <div className="mb-3 h-1.5 rounded-full bg-[var(--surface-high)]" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="h-5 w-5 rounded border border-[var(--border)]" />
              <div className="h-4 flex-1 rounded bg-[var(--surface-high)]" />
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}
