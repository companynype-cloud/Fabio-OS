import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-surface-high animate-pulse rounded', className)} {...props} />
}

export { Skeleton }
