import { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Notas — Life OS' }

export default function NotasPage() {
  return (
    <ComingSoon
      title="Notas"
      description="Sua base de conhecimento pessoal"
      icon={FileText}
      sprint="Sprint 3"
    />
  )
}
