import { Widget } from './widget'

interface NextMeetingProps {
  workspaceSlug: string
}

const MOCK_NEXT_MEETING = {
  title: 'Revisão de sprint',
  startsIn: 12,
  startTime: '10:00',
  endTime: '11:30',
  attendees: ['Ana Silva', 'Carlos Melo', 'Bia Costa'],
  videoUrl: 'https://meet.google.com',
  color: '#8b5cf6',
}

export function NextMeeting({ workspaceSlug }: NextMeetingProps) {
  const meeting = MOCK_NEXT_MEETING

  if (!meeting) {
    return (
      <Widget title="Próxima reunião">
        <div className="p-4 text-center">
          <p className="text-sm text-[var(--outline)]">Sem reuniões agendadas</p>
        </div>
      </Widget>
    )
  }

  return (
    <Widget title="Próxima reunião">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="w-1 flex-shrink-0 self-stretch rounded-full"
            style={{ background: meeting.color }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{meeting.title}</p>
            <p className="mt-0.5 text-xs text-[var(--outline)]">
              {meeting.startTime} – {meeting.endTime}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {meeting.attendees.slice(0, 3).map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-[var(--surface-base)] px-2 py-0.5 text-xs text-[var(--outline)]"
                >
                  {name.split(' ')[0]}
                </span>
              ))}
              {meeting.attendees.length > 3 && (
                <span className="text-xs text-[var(--outline)]">
                  +{meeting.attendees.length - 3}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="font-mono text-xs text-[var(--primary)]">
              em {meeting.startsIn}min
            </span>
          </div>
        </div>
        {meeting.videoUrl && (
          <a
            href={meeting.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-[var(--surface-base)] py-2 text-xs transition-colors hover:bg-[var(--surface-high)]"
          >
            <span>▶</span> Entrar na reunião
          </a>
        )}
      </div>
    </Widget>
  )
}

export function NextMeetingSkeleton() {
  return (
    <Widget title="Próxima reunião">
      <div className="animate-pulse p-4">
        <div className="flex gap-3">
          <div className="w-1 self-stretch rounded-full bg-[var(--surface-high)]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-[var(--surface-high)]" />
            <div className="h-3 w-1/3 rounded bg-[var(--surface-high)]" />
            <div className="mt-2 flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-5 w-14 rounded-full bg-[var(--surface-high)]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Widget>
  )
}
