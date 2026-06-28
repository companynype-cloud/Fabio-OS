import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { CreateWorkspaceForm } from '@/features/workspace/create-workspace-form'

export const metadata: Metadata = { title: 'Novo Workspace — Life OS' }

export default async function NewWorkspacePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  // Se já tem workspace, redireciona
  const existing = await db.workspaceMember.findFirst({
    where: { userId: session.user.id },
    include: { workspace: true },
  })
  if (existing) redirect(`/w/${existing.workspace.slug}/hoje`)

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="bg-primary mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl">
            <span className="text-lg font-bold text-white">L</span>
          </div>
          <h1 className="text-on-surface text-xl font-semibold tracking-tight">Novo workspace</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Seu espaço pessoal para organizar tudo
          </p>
        </div>
        <CreateWorkspaceForm />
      </div>
    </div>
  )
}
