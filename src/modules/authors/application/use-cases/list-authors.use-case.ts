import type { AuthorsDTO } from '../dtos/authors.dto';

export class ListAuthorsUseCase {
  async execute(): Promise<AuthorsDTO[]> {
    return [];
  }
}
