import { defineConfig, env } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

export default defineConfig({
  schema: 'schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrate: {
    async adapter() {
      const pool = new Pool({
        connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      })
      return new PrismaPg(pool)
    },
  },
})
