import { Metadata } from 'next'
import { RefreshCw } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Revisão Semanal — Life OS' }

export default function RevisaoPage() {
  return (
    <ComingSoon
      title="Revisão Semanal"
      description="Reflita e planeje a próxima semana"
      icon={RefreshCw}
      sprint="Sprint 6"
    />
  )
}
