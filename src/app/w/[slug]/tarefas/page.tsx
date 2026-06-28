import { Metadata } from 'next'
import { CheckSquare } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Tarefas — Life OS' }

export default function TarefasPage() {
  return (
    <ComingSoon
      title="Tarefas"
      description="Gerencie suas tarefas e to-dos"
      icon={CheckSquare}
      sprint="Sprint 2"
    />
  )
}
