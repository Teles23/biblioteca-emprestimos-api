import { prisma } from '../../../../shared/infra/database/prisma/client';
import { AuthorEntity } from '../../domain/entities/authors.entity';
import type { IAuthorsRepository } from '../../domain/repositories/IAuthorsRepository';

export class AuthorsRepository implements IAuthorsRepository {
  async create(data: { name: string; biography?: string }): Promise<AuthorEntity> {
    const author = await prisma.author.create({
      data: {
        name: data.name,
        biography: data.biography,
      },
    });

    return this.toEntity(author);
  }

  async list(): Promise<AuthorEntity[]> {
    const authors = await prisma.author.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return authors.map((author) => this.toEntity(author));
  }

  async findById(id: string): Promise<AuthorEntity | null> {
    const author = await prisma.author.findUnique({ where: { id } });
    return author ? this.toEntity(author) : null;
  }

  async update(id: string, data: { name: string; biography?: string }): Promise<AuthorEntity> {
    const author = await prisma.author.update({
      where: { id },
      data: {
        name: data.name,
        biography: data.biography,
      },
    });

    return this.toEntity(author);
  }

  async delete(id: string): Promise<void> {
    await prisma.author.delete({ where: { id } });
  }

  async hasLinkedBooks(id: string): Promise<boolean> {
    const linked = await prisma.bookAuthor.findFirst({
      where: { authorId: id },
      select: { authorId: true },
    });

    return Boolean(linked);
  }

  private toEntity(author: {
    id: string;
    name: string;
    biography: string | null;
    createdAt: Date;
    updatedAt: Date;
    bookCount?: number;
  }): AuthorEntity {
    return new AuthorEntity(
      author.id,
      author.name,
      author.biography,
      author.createdAt,
      author.updatedAt,
      author.bookCount,
    );
  }
}
