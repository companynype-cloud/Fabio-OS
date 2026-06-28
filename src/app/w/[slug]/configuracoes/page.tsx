import { Metadata } from 'next'
import { Settings } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Configurações — Life OS' }

export default function ConfiguracoesPage() {
  return (
    <ComingSoon
      title="Configurações"
      description="Preferências do workspace e conta"
      icon={Settings}
      sprint="Sprint 4"
    />
  )
}
