import { Metadata } from 'next'
import { requireWorkspace } from '@/server/workspace'
import { formatDate } from '@/utils/format'

export const metadata: Metadata = { title: 'Hoje — Life OS' }

interface Props {
  params: Promise<{ slug: string }>
}

export default async function HojePage({ params }: Props) {
  const { slug } = await params
  const { workspace, user } = await requireWorkspace(slug)

  const today = formatDate(new Date())
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="flex h-full flex-col">
      <div className="border-border border-b px-6 py-4">
        <p className="text-muted-foreground label-mono">{today}</p>
        <h1 className="text-on-surface mt-1 text-2xl font-semibold tracking-tight">
          {greeting}, {user.name?.split(' ')[0] ?? 'usuário'} 👋
        </h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Workspace: <span className="text-foreground font-medium">{workspace.name}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <div key={s.label} className="border-border bg-surface rounded-xl border p-4">
              <p className="text-muted-foreground label-mono mb-2">{s.label}</p>
              <p className="text-muted-foreground text-sm">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SECTIONS = [
  { label: 'Tarefas do dia', description: 'Módulo implementado no Sprint 2' },
  { label: 'Foco', description: 'Temporizador Pomodoro — Sprint 4' },
  { label: 'Hábitos', description: 'Check-in diário — Sprint 5' },
  { label: 'Agenda', description: 'Próximos eventos — Sprint 4' },
  { label: 'Progresso', description: 'Métricas de hoje — Sprint 3' },
  { label: 'IA', description: 'Insights do assistente — Sprint 7' },
]
