'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { slugify } from '@/lib/utils'

export function CreateWorkspaceForm() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [name, setName] = React.useState('')
  const slug = slugify(name)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    const res = await fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), slug }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error ?? 'Erro ao criar workspace')
      setLoading(false)
      return
    }

    const workspace = await res.json()
    router.push(`/w/${workspace.slug}/hoje`)
  }

  return (
    <div className="border-border bg-surface-low rounded-xl border p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome do workspace"
          placeholder="Minha Vida, João Silva..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        {slug && (
          <p className="text-muted-foreground font-mono text-xs">
            URL: /w/<span className="text-primary">{slug}</span>
          </p>
        )}
        <Button type="submit" className="w-full" loading={loading} disabled={!name.trim()}>
          Criar workspace
        </Button>
      </form>
    </div>
  )
}
