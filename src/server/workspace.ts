import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireUser } from './auth'

export async function requireWorkspace(slug: string) {
  const user = await requireUser()

  const workspace = await db.workspace.findUnique({
    where: { slug, deletedAt: null },
    include: {
      members: { where: { userId: user.id } },
    },
  })

  if (!workspace || workspace.members.length === 0) {
    redirect('/novo-workspace')
  }

  return { workspace, member: workspace.members[0], user }
}

export async function getUserWorkspaces(userId: string) {
  return db.workspace.findMany({
    where: {
      deletedAt: null,
      members: { some: { userId } },
    },
    include: {
      members: { where: { userId }, take: 1 },
    },
    orderBy: { createdAt: 'asc' },
  })
}
