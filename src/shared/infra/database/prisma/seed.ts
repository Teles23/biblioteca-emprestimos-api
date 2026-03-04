import 'dotenv/config';

import bcrypt from 'bcrypt';

import { disconnectPrisma, prisma } from './client';

const DEFAULT_ADMIN_EMAIL = 'admin@biblioteca.local';
const DEFAULT_ADMIN_PASSWORD = 'Admin@123';

async function ensureAdminUser(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || 'Administrador';

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    if (!existing.roles.includes('ROLE_ADMIN')) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          roles: [...new Set([...existing.roles, 'ROLE_ADMIN'])],
        },
      });
    }

    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      roles: ['ROLE_ADMIN', 'ROLE_USER'],
      status: 'ACTIVE',
    },
  });
}

async function ensureCategories(): Promise<string[]> {
  const categories = ['Ficcao', 'Tecnologia', 'Historia', 'Ciencia'];
  const ids: string[] = [];

  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      create: { name },
      update: {},
    });

    ids.push(category.id);
  }

  return ids;
}

async function ensureAuthors(): Promise<string[]> {
  const authors = [
    { name: 'George Orwell', biography: 'Autor de 1984 e A Revolucao dos Bichos.' },
    { name: 'Robert C. Martin', biography: 'Autor de Clean Code.' },
    { name: 'Mary Beard', biography: 'Historiadora e escritora britanica.' },
  ];

  const ids: string[] = [];

  for (const authorData of authors) {
    const existing = await prisma.author.findFirst({
      where: { name: authorData.name },
    });

    if (existing) {
      ids.push(existing.id);
      continue;
    }

    const author = await prisma.author.create({
      data: authorData,
    });

    ids.push(author.id);
  }

  return ids;
}

async function ensureDemoBook(categoryId: string, authorId: string): Promise<void> {
  await prisma.book.upsert({
    where: { title: '1984' },
    create: {
      title: '1984',
      publicationYear: 1949,
      categoryId,
      status: 'AVAILABLE',
      authors: {
        create: [
          {
            authorId,
          },
        ],
      },
    },
    update: {},
  });
}

async function main(): Promise<void> {
  await ensureAdminUser();
  const categories = await ensureCategories();
  const authors = await ensureAuthors();
  await ensureDemoBook(categories[0], authors[0]);
}

main()
  .then(async () => {
    await disconnectPrisma();
  })
  .catch(async (error: unknown) => {
    console.error('Seed falhou:', error);
    await disconnectPrisma();
    process.exit(1);
  });
