'use client'

import * as React from 'react'
import { Command } from 'cmdk'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Search,
  Home,
  CheckSquare,
  FolderKanban,
  Lightbulb,
  FileText,
  Target,
  Bot,
  Settings,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceSlug: string
}

interface CommandAction {
  id: string
  label: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  action?: () => void
  group: string
  shortcut?: string
}

export function CommandPalette({ open, onOpenChange, workspaceSlug }: CommandPaletteProps) {
  const router = useRouter()
  const w = `/w/${workspaceSlug}`

  const actions: CommandAction[] = [
    // Navegação
    { id: 'hoje', label: 'Hoje', icon: Home, href: `${w}/hoje`, group: 'Navegar' },
    { id: 'tarefas', label: 'Tarefas', icon: CheckSquare, href: `${w}/tarefas`, group: 'Navegar' },
    {
      id: 'projetos',
      label: 'Projetos',
      icon: FolderKanban,
      href: `${w}/projetos`,
      group: 'Navegar',
    },
    { id: 'ideias', label: 'Ideias', icon: Lightbulb, href: `${w}/ideias`, group: 'Navegar' },
    { id: 'notas', label: 'Notas', icon: FileText, href: `${w}/notas`, group: 'Navegar' },
    { id: 'objetivos', label: 'Objetivos', icon: Target, href: `${w}/objetivos`, group: 'Navegar' },
    {
      id: 'assistente',
      label: 'Assistente IA',
      icon: Bot,
      href: `${w}/assistente`,
      group: 'Navegar',
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings,
      href: `${w}/configuracoes`,
      group: 'Navegar',
    },
  ]

  const groups = Array.from(new Set(actions.map((a) => a.group)))

  function runAction(action: CommandAction) {
    onOpenChange(false)
    if (action.href) {
      router.push(action.href)
    } else if (action.action) {
      action.action()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/60 bg-surface-low shadow-modal max-w-xl overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:uppercase">
          <div className="border-border flex items-center border-b px-3">
            <Search className="text-muted-foreground mr-2 h-4 w-4 shrink-0" />
            <Command.Input
              placeholder="O que você quer fazer?"
              className="text-on-surface placeholder:text-muted-foreground flex h-11 w-full bg-transparent py-3 text-sm outline-none"
            />
            <kbd className="border-border text-muted-foreground hidden items-center gap-0.5 rounded border px-1.5 py-0.5 font-mono text-xs sm:flex">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="text-muted-foreground py-8 text-center text-sm">
              Nenhum resultado encontrado.
            </Command.Empty>
            {groups.map((group) => (
              <Command.Group key={group} heading={group}>
                {actions
                  .filter((a) => a.group === group)
                  .map((action) => (
                    <Command.Item
                      key={action.id}
                      value={action.label}
                      onSelect={() => runAction(action)}
                      className={cn(
                        'text-on-surface flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm',
                        'aria-selected:bg-surface-high transition-colors duration-75'
                      )}
                    >
                      <div className="bg-surface-high flex h-6 w-6 items-center justify-center rounded">
                        <action.icon className="text-muted-foreground h-3.5 w-3.5" />
                      </div>
                      <span>{action.label}</span>
                      {action.shortcut && (
                        <kbd className="text-muted-foreground ml-auto font-mono text-xs">
                          {action.shortcut}
                        </kbd>
                      )}
                    </Command.Item>
                  ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
