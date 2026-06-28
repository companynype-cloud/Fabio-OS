import { Metadata } from 'next'
import { Lightbulb } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Ideias — Life OS' }

export default function IdeiasPage() {
  return (
    <ComingSoon
      title="Ideias"
      description="Capture e desenvolva suas ideias"
      icon={Lightbulb}
      sprint="Sprint 3"
    />
  )
}
