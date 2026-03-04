import type { AuthorEntity } from '../entities/authors.entity';

export interface IAuthorsRepository {
  create(data: { name: string; biography?: string }): Promise<AuthorEntity>;
  list(): Promise<AuthorEntity[]>;
  findById(id: string): Promise<AuthorEntity | null>;
  update(id: string, data: { name: string; biography?: string }): Promise<AuthorEntity>;
  delete(id: string): Promise<void>;
  hasLinkedBooks(id: string): Promise<boolean>;
}
