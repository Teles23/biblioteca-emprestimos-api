import { prisma } from '../../../../shared/infra/database/prisma/client';
import { AuthorEntity } from '../../../authors/domain/entities/authors.entity';
import { BookEntity } from '../../domain/entities/books.entity';
import type { IBooksRepository } from '../../domain/repositories/IBooksRepository';

export class BooksRepository implements IBooksRepository {
  async create(data: {
    title: string;
    publicationYear: number;
    categoryId: string;
    authorIds: string[];
  }): Promise<BookEntity> {
    const book = await prisma.book.create({
      data: {
        title: data.title,
        publicationYear: data.publicationYear,
        categoryId: data.categoryId,
        status: 'AVAILABLE',
        authors: {
          createMany: {
            data: data.authorIds.map((authorId) => ({ authorId })),
          },
        },
      },
      include: {
        authors: {
          include: {
            author: true,
          },
        },
      },
    });

    return this.toEntity(book);
  }

  async list(): Promise<BookEntity[]> {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        authors: {
          include: {
            author: true,
          },
        },
      },
    });

    return books.map((book) => this.toEntity(book));
  }

  async findById(id: string): Promise<BookEntity | null> {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        authors: {
          include: {
            author: true,
          },
        },
      },
    });

    return book ? this.toEntity(book) : null;
  }

  async findByTitle(title: string): Promise<BookEntity | null> {
    const book = await prisma.book.findUnique({
      where: { title },
      include: {
        authors: {
          include: {
            author: true,
          },
        },
      },
    });

    return book ? this.toEntity(book) : null;
  }

  async update(
    id: string,
    data: {
      title: string;
      publicationYear: number;
      categoryId: string;
      authorIds: string[];
    },
  ): Promise<BookEntity> {
    const book = await prisma.$transaction(async (tx) => {
      await tx.bookAuthor.deleteMany({
        where: { bookId: id },
      });

      return tx.book.update({
        where: { id },
        data: {
          title: data.title,
          publicationYear: data.publicationYear,
          categoryId: data.categoryId,
          authors: {
            createMany: {
              data: data.authorIds.map((authorId) => ({ authorId })),
            },
          },
        },
        include: {
          authors: {
            include: {
              author: true,
            },
          },
        },
      });
    });

    return this.toEntity(book);
  }

  async delete(id: string): Promise<void> {
    await prisma.book.delete({ where: { id } });
  }

  private toEntity(book: {
    id: string;
    title: string;
    publicationYear: number;
    categoryId: string;
    status: 'AVAILABLE' | 'BORROWED';
    createdAt: Date;
    updatedAt: Date;
    authors: Array<{
      author: {
        id: string;
        name: string;
        biography: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
    }>;
  }): BookEntity {
    const authors = book.authors.map(
      ({ author }) => new AuthorEntity(author.id, author.name, author.biography, author.createdAt, author.updatedAt),
    );

    return new BookEntity(
      book.id,
      book.title,
      book.publicationYear,
      book.categoryId,
      book.status,
      authors,
      book.createdAt,
      book.updatedAt,
    );
  }
}
