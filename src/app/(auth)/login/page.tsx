import { Metadata } from 'next'
import { LoginForm } from '@/features/auth/login-form'

export const metadata: Metadata = { title: 'Entrar — Life OS' }

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="bg-primary mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl">
            <span className="text-lg font-bold text-white">L</span>
          </div>
          <h1 className="text-on-surface text-xl font-semibold tracking-tight">Life OS</h1>
          <p className="text-muted-foreground mt-1 text-sm">Entre na sua conta</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
