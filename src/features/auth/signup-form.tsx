'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signUp } from '@/lib/auth-client'

export function SignupForm() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{ name?: string; email?: string; password?: string }>(
    {}
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const email = form.get('email') as string
    const password = form.get('password') as string

    const errs: typeof errors = {}
    if (!name) errs.name = 'Nome obrigatório'
    if (!email) errs.email = 'Email obrigatório'
    if (!password || password.length < 8) errs.password = 'Mínimo 8 caracteres'
    if (Object.keys(errs).length) return setErrors(errs)
    setErrors({})

    setLoading(true)
    const { error } = await signUp.email({ name, email, password })
    setLoading(false)

    if (error) {
      toast.error(error.message ?? 'Erro ao criar conta')
      return
    }

    router.push('/novo-workspace')
  }

  return (
    <div className="border-border bg-surface-low space-y-4 rounded-xl border p-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="name"
          type="text"
          label="Nome"
          placeholder="Seu nome"
          autoComplete="name"
          error={errors.name}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          autoComplete="email"
          error={errors.email}
        />
        <Input
          name="password"
          type="password"
          label="Senha"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          error={errors.password}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Criar conta
        </Button>
      </form>

      <div className="text-muted-foreground text-center text-xs">
        Já tem conta?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </div>
    </div>
  )
}
