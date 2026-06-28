import { Suspense } from 'react'
import { Metadata } from 'next'
import { requireWorkspace } from '@/server/workspace'
import { Greeting } from './_components/greeting'
import { PriorityFocus, PriorityFocusSkeleton } from './_components/priority-focus'
import { DayAgenda, DayAgendaSkeleton } from './_components/day-agenda'
import { NextMeeting, NextMeetingSkeleton } from './_components/next-meeting'
import { HabitsToday, HabitsTodaySkeleton } from './_components/habits-today'
import { FinancialSummary, FinancialSummarySkeleton } from './_components/financial-summary'
import { AIInsights, AIInsightsSkeleton } from './_components/ai-insights'
import { ActivityFeed, ActivityFeedSkeleton } from './_components/activity-feed'

export const metadata: Metadata = { title: 'Hoje — Life OS' }

interface Props {
  params: Promise<{ slug: string }>
}

export default async function HojePage({ params }: Props) {
  const { slug } = await params
  const { workspace, user } = await requireWorkspace(slug)

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <Greeting name={user.name ?? 'Usuário'} date={today} greeting={greeting} />
          <div className="hidden items-center gap-2 md:flex">
            <a
              href={`/w/${slug}/assistente`}
              className="flex items-center gap-2 rounded border border-[var(--border)] bg-[var(--surface-low)] px-3 py-1.5 text-xs transition-colors hover:bg-[var(--surface-base)]"
            >
              <span>✨</span> Perguntar à IA
            </a>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-4 lg:col-span-2">
            <Suspense fallback={<PriorityFocusSkeleton />}>
              <PriorityFocus workspaceId={workspace.id} workspaceSlug={slug} />
            </Suspense>

            <Suspense fallback={<DayAgendaSkeleton />}>
              <DayAgenda workspaceSlug={slug} />
            </Suspense>

            <Suspense fallback={<ActivityFeedSkeleton />}>
              <ActivityFeed workspaceId={workspace.id} />
            </Suspense>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Suspense fallback={<NextMeetingSkeleton />}>
              <NextMeeting workspaceSlug={slug} />
            </Suspense>

            <Suspense fallback={<HabitsTodaySkeleton />}>
              <HabitsToday workspaceId={workspace.id} userId={user.id} workspaceSlug={slug} />
            </Suspense>

            <Suspense fallback={<FinancialSummarySkeleton />}>
              <FinancialSummary workspaceSlug={slug} />
            </Suspense>

            <Suspense fallback={<AIInsightsSkeleton />}>
              <AIInsights />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
