import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'src/shared/infra/database/prisma/schema.prisma',
  migrations: {
    path: 'src/shared/infra/database/prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
    // @ts-ignore - Prisma 7 directUrl support is required for Supabase migrations
    directUrl: env('DIRECT_URL'),
  },
} as any);
