import { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Diário — Life OS' }

export default function DiarioPage() {
  return (
    <ComingSoon
      title="Diário"
      description="Reflexões e registros diários"
      icon={BookOpen}
      sprint="Sprint 5"
    />
  )
}
