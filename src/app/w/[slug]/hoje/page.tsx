import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Hoje — Life OS' }

export default function HojePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-on-surface text-xl font-semibold tracking-tight">Hoje</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">Seu foco para hoje</p>
      </div>
      <div className="border-border rounded-xl border border-dashed p-16 text-center">
        <p className="text-muted-foreground text-sm">Dashboard implementado no Sprint 3</p>
      </div>
    </div>
  )
}
