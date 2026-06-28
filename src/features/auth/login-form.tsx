'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signIn } from '@/lib/auth-client'

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string

    const errs: typeof errors = {}
    if (!email) errs.email = 'Email obrigatório'
    if (!password) errs.password = 'Senha obrigatória'
    if (Object.keys(errs).length) return setErrors(errs)
    setErrors({})

    setLoading(true)
    const { error } = await signIn.email({ email, password })
    setLoading(false)

    if (error) {
      toast.error(error.message ?? 'Credenciais inválidas')
      return
    }

    router.push('/')
  }

  return (
    <div className="border-border bg-surface-low space-y-4 rounded-xl border p-6">
      <form onSubmit={handleSubmit} className="space-y-3">
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
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Entrar
        </Button>
      </form>

      <div className="text-muted-foreground text-center text-xs">
        Não tem conta?{' '}
        <Link href="/cadastro" className="text-primary hover:underline">
          Criar conta
        </Link>
      </div>
    </div>
  )
}
