import type { IBooksRepository } from '../../domain/repositories/IBooksRepository';
import { BookEntity } from '../../domain/entities/books.entity';

export class BooksRepository implements IBooksRepository {
  async findById(id: string): Promise<BookEntity | null> {
    return new BookEntity(id);
  }
}
