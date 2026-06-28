import { Metadata } from 'next'
import { Target } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Objetivos — Life OS' }

export default function ObjetivosPage() {
  return (
    <ComingSoon
      title="Objetivos"
      description="Defina e acompanhe seus objetivos"
      icon={Target}
      sprint="Sprint 5"
    />
  )
}
