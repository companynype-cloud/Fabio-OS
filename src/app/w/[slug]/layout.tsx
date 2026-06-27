import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { WorkspaceShell } from '@/components/layout/workspace-shell'

interface WorkspaceLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { slug } = await params

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const workspace = await db.workspace.findUnique({
    where: { slug, deletedAt: null },
    include: {
      members: { where: { userId: session.user.id } },
    },
  })

  if (!workspace || workspace.members.length === 0) {
    redirect('/novo-workspace')
  }

  return (
    <WorkspaceShell workspaceSlug={slug} workspaceName={workspace.name}>
      {children}
    </WorkspaceShell>
  )
}
