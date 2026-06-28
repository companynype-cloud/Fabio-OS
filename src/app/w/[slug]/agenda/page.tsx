import { Metadata } from 'next'
import { Calendar } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Agenda — Life OS' }

export default function AgendaPage() {
  return (
    <ComingSoon
      title="Agenda"
      description="Calendário e eventos"
      icon={Calendar}
      sprint="Sprint 4"
    />
  )
}
