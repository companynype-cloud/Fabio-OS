import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'
import { headers } from 'next/headers'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string().min(1).max(60),
  slug: z.string().min(1).max(60).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const { name } = parsed.data
  let slug = parsed.data.slug ?? slugify(name)

  // Garantir slug único
  const existing = await db.workspace.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Date.now().toString(36)}`

  const workspace = await db.workspace.create({
    data: {
      name,
      slug,
      members: {
        create: { userId: session.user.id, role: 'OWNER' },
      },
    },
  })

  return NextResponse.json(workspace, { status: 201 })
}
