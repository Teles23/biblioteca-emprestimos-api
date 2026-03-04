import type { AuthorEntity } from '../entities/authors.entity';

export interface IAuthorsRepository {
  findById(id: string): Promise<AuthorEntity | null>;
}
