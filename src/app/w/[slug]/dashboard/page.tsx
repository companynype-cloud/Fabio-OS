import { Metadata } from 'next'
import { LayoutDashboard } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Dashboard — Life OS' }

export default function DashboardPage() {
  return (
    <ComingSoon
      title="Dashboard"
      description="Visão geral de métricas e progresso"
      icon={LayoutDashboard}
      sprint="Sprint 3"
    />
  )
}
