import { Metadata } from 'next'
import { FolderKanban } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Projetos — Life OS' }

export default function ProjetosPage() {
  return (
    <ComingSoon
      title="Projetos"
      description="Organize seu trabalho em projetos"
      icon={FolderKanban}
      sprint="Sprint 2"
    />
  )
}
