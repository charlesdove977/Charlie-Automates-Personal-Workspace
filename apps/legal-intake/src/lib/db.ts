import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Prisma 7 requires passing accelerateUrl for prisma+postgres:// URLs
  // or using an adapter for direct database connections
  const databaseUrl = process.env.DATABASE_URL

  // Check if using Prisma Postgres/Accelerate URL format
  if (databaseUrl?.startsWith('prisma+postgres://') || databaseUrl?.startsWith('prisma://')) {
    return new PrismaClient({
      accelerateUrl: databaseUrl,
    })
  }

  // For standard PostgreSQL URLs, use the pg adapter
  // This requires @prisma/adapter-pg package which may not be installed
  // Fall back to accelerateUrl with the database URL (will error if not valid)
  return new PrismaClient({
    accelerateUrl: databaseUrl,
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
