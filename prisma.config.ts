import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'src/shared/infra/database/prisma/schema.prisma',
  migrations: {
    path: 'src/shared/infra/database/prisma/migrations',
  },
});
