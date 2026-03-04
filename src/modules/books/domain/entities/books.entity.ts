import type { AuthorEntity } from '../../../authors/domain/entities/authors.entity';

export class BookEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly publicationYear: number,
    public readonly categoryId: string,
    public readonly status: 'AVAILABLE' | 'BORROWED',
    public readonly authors: AuthorEntity[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
