import { Metadata } from 'next'
import { Bot } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Assistente IA — Life OS' }

export default function AssistentePage() {
  return (
    <ComingSoon
      title="Assistente IA"
      description="Seu assistente pessoal inteligente"
      icon={Bot}
      sprint="Sprint 7"
    />
  )
}
