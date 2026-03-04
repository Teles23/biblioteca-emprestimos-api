import type { BookEntity } from '../entities/books.entity';

export interface IBooksRepository {
  create(data: {
    title: string;
    publicationYear: number;
    categoryId: string;
    authorIds: string[];
  }): Promise<BookEntity>;
  list(): Promise<BookEntity[]>;
  findById(id: string): Promise<BookEntity | null>;
  findByTitle(title: string): Promise<BookEntity | null>;
  update(
    id: string,
    data: {
      title: string;
      publicationYear: number;
      categoryId: string;
      authorIds: string[];
    },
  ): Promise<BookEntity>;
  delete(id: string): Promise<void>;
}
