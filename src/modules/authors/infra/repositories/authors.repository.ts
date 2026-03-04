import type { IAuthorsRepository } from '../../domain/repositories/IAuthorsRepository';
import { AuthorEntity } from '../../domain/entities/authors.entity';

export class AuthorsRepository implements IAuthorsRepository {
  async findById(id: string): Promise<AuthorEntity | null> {
    return new AuthorEntity(id);
  }
}
