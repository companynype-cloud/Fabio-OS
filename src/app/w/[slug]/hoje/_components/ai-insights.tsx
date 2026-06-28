import { Widget } from './widget'
import { cn } from '@/lib/utils'

type InsightType = 'tip' | 'alert' | 'achievement' | 'suggestion'

interface Insight {
  id: string
  type: InsightType
  title: string
  content: string
}

const MOCK_INSIGHTS: Insight[] = [
  {
    id: '1',
    type: 'alert',
    title: '3 tarefas atrasadas',
    content: 'Você tem tarefas com prazo vencido esta semana. Considere repriorizar ou reagendar.',
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Sequência de 5 dias!',
    content: 'Você manteve seus hábitos por 5 dias consecutivos. Continue assim!',
  },
  {
    id: '3',
    type: 'suggestion',
    title: 'Momento ideal para foco',
    content:
      'Com base no seu histórico, 10h–12h é seu pico de produtividade. Reserve esse bloco para trabalho profundo.',
  },
]

const TYPE_CONFIG: Record<InsightType, { icon: string; color: string }> = {
  tip: { icon: '💡', color: 'text-yellow-400' },
  alert: { icon: '⚠️', color: 'text-red-400' },
  achievement: { icon: '🏆', color: 'text-green-400' },
  suggestion: { icon: '✨', color: 'text-blue-400' },
}

export function AIInsights() {
  return (
    <Widget title="IA · Insights">
      <div className="space-y-3 p-4">
        <p className="text-xs text-[var(--outline)]">
          Com base nas suas atividades, aqui estão os insights de hoje:
        </p>
        {MOCK_INSIGHTS.map((insight) => {
          const config = TYPE_CONFIG[insight.type]
          return (
            <div
              key={insight.id}
              className="flex gap-3 rounded border border-[var(--border-subtle)] bg-[var(--surface-base)] p-3"
            >
              <span className="mt-0.5 flex-shrink-0 text-base leading-none">{config.icon}</span>
              <div className="min-w-0 flex-1">
                <p className={cn('text-xs font-medium', config.color)}>{insight.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--outline)]">
                  {insight.content}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Widget>
  )
}

export function AIInsightsSkeleton() {
  return (
    <Widget title="IA · Insights">
      <div className="animate-pulse space-y-3 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3 rounded bg-[var(--surface-base)] p-3">
            <div className="h-5 w-5 rounded bg-[var(--surface-high)]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 rounded bg-[var(--surface-high)]" />
              <div className="h-3 w-full rounded bg-[var(--surface-high)]" />
              <div className="h-3 w-3/4 rounded bg-[var(--surface-high)]" />
            </div>
          </div>
        ))}
      </div>
    </Widget>
  )
}
