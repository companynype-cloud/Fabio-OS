import { Metadata } from 'next'
import { Wallet } from 'lucide-react'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata: Metadata = { title: 'Finanças — Life OS' }

export default function FinancasPage() {
  return (
    <ComingSoon
      title="Finanças"
      description="Controle financeiro pessoal"
      icon={Wallet}
      sprint="Sprint 6"
    />
  )
}
