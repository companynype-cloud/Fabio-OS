import { Metadata } from 'next'
import { Activity } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Hábitos — Life OS' }

export default function HabitosPage() {
  return (
    <ComingSoon
      title="Hábitos"
      description="Construa e acompanhe seus hábitos"
      icon={Activity}
      sprint="Sprint 5"
    />
  )
}
