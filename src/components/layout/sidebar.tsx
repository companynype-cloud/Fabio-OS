'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getNavGroups } from '@/lib/navigation'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface SidebarProps {
  workspaceSlug: string
  workspaceName: string
  onCommandOpen: () => void
}

export function Sidebar({ workspaceSlug, workspaceName, onCommandOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  const pathname = usePathname()
  const navGroups = getNavGroups(workspaceSlug)

  return (
    <aside
      className={cn(
        'border-border bg-surface relative flex h-screen flex-col border-r transition-all duration-200',
        collapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Logo / Workspace */}
      <div className="border-border flex h-12 items-center gap-2.5 border-b px-3">
        <div className="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded">
          <span className="text-xs font-bold text-white">L</span>
        </div>
        {!collapsed && (
          <span className="text-on-surface truncate text-sm font-semibold">{workspaceName}</span>
        )}
      </div>

      {/* Search / Command */}
      <div className="p-2">
        <button
          onClick={onCommandOpen}
          className={cn(
            'border-border bg-surface-base flex w-full items-center gap-2 rounded border px-2 py-1.5',
            'text-muted-foreground hover:text-on-surface hover:border-outline-variant text-sm transition-colors duration-150',
            collapsed && 'justify-center'
          )}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left text-xs">Pesquisar...</span>
              <kbd className="font-mono text-xs opacity-60">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-3 py-2">
          {navGroups.map((group) => (
            <div key={group.id}>
              {group.label && !collapsed && (
                <p className="text-muted-foreground mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  const navItem = (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 rounded px-2 py-1.5 text-sm transition-colors duration-100',
                        isActive
                          ? 'bg-surface-high text-on-surface nav-active font-medium'
                          : 'text-muted-foreground hover:text-on-surface hover:bg-surface-base'
                      )}
                    >
                      <item.icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.badge != null && item.badge > 0 && (
                        <span className="bg-primary ml-auto flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </Link>
                  )

                  return (
                    <li key={item.id}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                          <TooltipContent side="right">{item.label}</TooltipContent>
                        </Tooltip>
                      ) : (
                        navItem
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="border-border bg-surface-high text-muted-foreground hover:text-on-surface shadow-elevated absolute top-16 -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  )
}
