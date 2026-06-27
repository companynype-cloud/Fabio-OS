'use client'

import * as React from 'react'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from '@/lib/auth-client'

interface HeaderProps {
  onCommandOpen: () => void
}

function getInitials(name?: string | null) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Header({ onCommandOpen }: HeaderProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <header className="border-border bg-surface flex h-12 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        {/* Breadcrumb placeholder — populated per-page via slots */}
        <div id="breadcrumb-slot" />
      </div>

      <div className="flex items-center gap-1.5">
        {/* Quick search */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onCommandOpen}
          className="text-muted-foreground"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground relative">
          <Bell className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus-visible:ring-primary ml-1 rounded-full focus-visible:ring-1 focus-visible:outline-none">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-on-surface text-sm font-medium">{user?.name ?? 'Usuário'}</p>
                <p className="text-muted-foreground text-xs">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/configuracoes')}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={handleSignOut}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
