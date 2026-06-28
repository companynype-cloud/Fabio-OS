import { Metadata } from 'next'
import { Video } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Reuniões — Life OS' }

export default function ReunioesPage() {
  return (
    <ComingSoon
      title="Reuniões"
      description="Notas e follow-ups de reuniões"
      icon={Video}
      sprint="Sprint 4"
    />
  )
}
