import Link from 'next/link'
import { Widget } from './widget'
import { cn } from '@/lib/utils'

interface AgendaEvent {
  id: string
  time: string
  endTime: string
  title: string
  type: 'meeting' | 'task' | 'block'
  color?: string
  location?: string
  isCurrent?: boolean
  isPast?: boolean
}

const MOCK_EVENTS: AgendaEvent[] = [
  {
    id: '1',
    time: '09:00',
    endTime: '09:30',
    title: 'Daily standup',
    type: 'meeting',
    color: '#3b82f6',
    location: 'Google Meet',
    isPast: true,
  },
  {
    id: '2',
    time: '10:00',
    endTime: '11:30',
    title: 'Revisão de sprint',
    type: 'meeting',
    color: '#8b5cf6',
    isCurrent: true,
  },
  {
    id: '3',
    time: '13:00',
    endTime: '14:00',
    title: 'Almoço / Foco deep work',
    type: 'block',
    color: '#f59e0b',
  },
  {
    id: '4',
    time: '15:00',
    endTime: '16:00',
    title: 'Call com cliente',
    type: 'meeting',
    color: '#10b981',
    location: 'Zoom',
  },
]

interface DayAgendaProps {
  workspaceSlug: string
}

export function DayAgenda({ workspaceSlug }: DayAgendaProps) {
  const now = new Date()
  const hourNow = now.getHours() + now.getMinutes() / 60

  const action = (
    <Link
      href={`/w/${workspaceSlug}/agenda`}
      className="text-xs text-[var(--outline)] transition-colors hover:text-[var(--foreground)]"
    >
      Abrir agenda →
    </Link>
  )

  return (
    <Widget title="Agenda de hoje" action={action}>
      <div className="space-y-1.5 p-3">
        {MOCK_EVENTS.map((event) => {
          const [h, m] = event.time.split(':').map(Number)
          const [eh, em] = event.endTime.split(':').map(Number)
          const startDecimal = h + m / 60
          const endDecimal = eh + em / 60
          const isCurrent = hourNow >= startDecimal && hourNow < endDecimal
          const isPast = endDecimal < hourNow

          return (
            <div
              key={event.id}
              className={cn(
                'flex gap-3 rounded px-3 py-2.5 transition-colors',
                isCurrent ? 'border-l-2 bg-[var(--surface-low)]' : 'hover:bg-[var(--surface-base)]',
                isPast && 'opacity-40'
              )}
              style={isCurrent ? { borderColor: event.color } : undefined}
            >
              <div className="flex-shrink-0 text-right">
                <p className="font-mono text-xs text-[var(--outline)]">{event.time}</p>
                <p className="font-mono text-xs text-[var(--outline)]/50">{event.endTime}</p>
              </div>
              <div
                className="my-0.5 w-0.5 flex-shrink-0 self-stretch rounded-full"
                style={{ background: event.color ?? 'var(--border)' }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{event.title}</p>
                {event.location && (
                  <p className="mt-0.5 truncate text-xs text-[var(--outline)]">{event.location}</p>
                )}
              </div>
              {isCurrent && (
                <span className="flex-shrink-0 rounded bg-[var(--primary)]/20 px-1.5 py-0.5 text-xs text-[var(--primary)]">
                  agora
                </span>
              )}
            </div>
          )
        })}
        {MOCK_EVENTS.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-[var(--outline)]">Dia livre de compromissos</p>
          </div>
        )}
      </div>
    </Widget>
  )
}

export function DayAgendaSkeleton() {
  return (
    <Widget title="Agenda de hoje">
      <div className="animate-pulse space-y-1.5 p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 px-3 py-2.5">
            <div className="w-10 space-y-1">
              <div className="h-3 rounded bg-[var(--surface-high)]" />
              <div className="h-3 rounded bg-[var(--surface-high)]" />
            </div>
            <div className="my-0.5 w-0.5 self-stretch bg-[var(--surface-high)]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-3/4 rounded bg-[var(--surface-high)]" />
              <div className="h-3 w-1/3 rounded bg-[var(--surface-high)]" />
            </div>
          </div>
        ))}
      </div>
    </Widget>
  )
}
