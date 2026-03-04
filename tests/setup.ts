import { disconnectPrisma } from '../src/shared/infra/database/prisma/client';

afterAll(async () => {
  await disconnectPrisma();
});
