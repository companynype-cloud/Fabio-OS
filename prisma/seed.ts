import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
})
const db = new PrismaClient({ adapter: new PrismaPg(pool) })

async function main() {
  console.log('🌱 Seeding database...')

  // Demo user — password is "senha123" (hashed by Better Auth, set via API or manually)
  const user = await db.user.upsert({
    where: { email: 'demo@lifeos.app' },
    update: {},
    create: {
      email: 'demo@lifeos.app',
      name: 'Demo User',
      timezone: 'America/Sao_Paulo',
      locale: 'pt-BR',
    },
  })

  // Demo workspace
  const workspace = await db.workspace.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo',
      plan: 'FREE',
    },
  })

  // Membership
  await db.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'OWNER',
    },
  })

  console.log(`✅ User: ${user.email}`)
  console.log(`✅ Workspace: ${workspace.slug}`)
  console.log('🌱 Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
