import * as React from 'react'
import { cn } from '@/lib/utils'

interface WidgetProps {
  title?: string
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function Widget({ title, action, className, children }: WidgetProps) {
  return (
    <div className={cn('glass overflow-hidden rounded-lg', className)}>
      {title && (
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <span className="label-mono text-xs tracking-widest text-[var(--outline)] uppercase">
            {title}
          </span>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

export function WidgetSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('glass animate-pulse overflow-hidden rounded-lg', className)}>
      <div className="border-b border-[var(--border)] px-4 py-3">
        <div className="h-3 w-24 rounded bg-[var(--surface-high)]" />
      </div>
      <div className="space-y-3 p-4">
        <div className="h-4 w-full rounded bg-[var(--surface-high)]" />
        <div className="h-4 w-3/4 rounded bg-[var(--surface-high)]" />
        <div className="h-4 w-1/2 rounded bg-[var(--surface-high)]" />
      </div>
    </div>
  )
}
