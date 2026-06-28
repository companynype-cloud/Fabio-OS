import * as React from 'react'
import type { LucideIcon } from 'lucide-react'

interface ComingSoonProps {
  title: string
  description: string
  icon: LucideIcon
  sprint?: string
}

export function ComingSoon({ title, description, icon: Icon, sprint }: ComingSoonProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-border border-b px-6 py-4">
        <h1 className="text-on-surface text-xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-surface-high flex h-16 w-16 items-center justify-center rounded-2xl">
            <Icon className="text-muted-foreground h-8 w-8" />
          </div>
          <div className="space-y-1">
            <p className="text-on-surface font-medium">{title}</p>
            <p className="text-muted-foreground text-sm">
              {sprint ? `Implementado no ${sprint}` : 'Em desenvolvimento'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
