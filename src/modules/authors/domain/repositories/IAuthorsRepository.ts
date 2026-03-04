export interface IAuthorsRepository {
  findById(id: string): Promise<AuthorEntity | null>;
}
