import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-8 py-16 text-center',
        className
      )}
    >
      {Icon && (
        <div className="bg-surface-high flex h-10 w-10 items-center justify-center rounded-xl">
          <Icon className="text-muted-foreground h-5 w-5" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-on-surface text-sm font-medium">{title}</p>
        {description && (
          <p className="text-muted-foreground max-w-[280px] text-xs">{description}</p>
        )}
      </div>
      {action && (
        <Button size="sm" variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
