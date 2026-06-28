import { Metadata } from 'next'
import { Puzzle } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Integrações — Life OS' }

export default function IntegracoesPage() {
  return (
    <ComingSoon
      title="Integrações"
      description="Conecte suas ferramentas favoritas"
      icon={Puzzle}
      sprint="Sprint 8"
    />
  )
}
