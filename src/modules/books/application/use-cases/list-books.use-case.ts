import type { BooksDTO } from '../dtos/books.dto';

export class ListBooksUseCase {
  async execute(): Promise<BooksDTO[]> {
    return [];
  }
}
