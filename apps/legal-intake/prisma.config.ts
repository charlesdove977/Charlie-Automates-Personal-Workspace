// Prisma config for Supabase connection
// CLI operations (migrations, introspection) use DIRECT_URL for non-pooled connection
// Runtime Prisma Client uses DATABASE_URL (pooled) from environment
import { config } from "dotenv";

// Load .env.local first (higher priority), then .env as fallback
config({ path: ".env.local" });
config({ path: ".env" });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use direct connection for CLI operations (migrations)
    // Prisma Client will use DATABASE_URL at runtime
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
