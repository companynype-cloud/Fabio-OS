import * as React from 'react'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

function Breadcrumb({ ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav aria-label="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2',
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentPropsWithoutRef<'li'>) {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />
}

function BreadcrumbLink({
  className,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { href?: string }) {
  return (
    <a
      href={href}
      className={cn('hover:text-foreground transition-colors', className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('text-foreground font-medium', className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
