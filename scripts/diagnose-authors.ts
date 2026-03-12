import { prisma } from '../src/shared/infra/database/prisma/client';

async function main() {
  const authors = await prisma.author.findMany({ orderBy: { createdAt: 'desc' } });
  console.log('authors', authors.length);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
