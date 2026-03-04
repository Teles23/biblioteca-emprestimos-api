import type { BooksDTO } from '../dtos/books.dto';
import type { IBooksRepository } from '../../domain/repositories/IBooksRepository';

export class ListBooksUseCase {
  constructor(private readonly booksRepository: IBooksRepository) {}

  async execute(): Promise<BooksDTO[]> {
    return this.booksRepository.list();
  }
}
