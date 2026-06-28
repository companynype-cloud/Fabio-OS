'use client'

import * as React from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { CommandPalette } from './command-palette'

interface WorkspaceShellProps {
  children: React.ReactNode
  workspaceSlug: string
  workspaceName: string
}

export function WorkspaceShell({ children, workspaceSlug, workspaceName }: WorkspaceShellProps) {
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar
        workspaceSlug={workspaceSlug}
        workspaceName={workspaceName}
        onCommandOpen={() => setCommandOpen(true)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onCommandOpen={() => setCommandOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        workspaceSlug={workspaceSlug}
      />
    </div>
  )
}
