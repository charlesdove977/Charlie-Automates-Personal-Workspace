import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL

  // Check if using Prisma Postgres/Accelerate URL format
  if (databaseUrl?.startsWith('prisma+postgres://') || databaseUrl?.startsWith('prisma://')) {
    return new PrismaClient({
      accelerateUrl: databaseUrl,
    })
  }

  // Standard PostgreSQL URL - use pg adapter (required for Prisma 7)
  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
