import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { env } from '../../../../config/env';

const isProduction = process.env.NODE_ENV === 'production';
const useSSL = isProduction && process.env.DATABASE_SSL !== 'false';

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
}
