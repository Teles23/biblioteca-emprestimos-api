import type { BookEntity } from '../entities/books.entity';

export interface IBooksRepository {
  findById(id: string): Promise<BookEntity | null>;
}
