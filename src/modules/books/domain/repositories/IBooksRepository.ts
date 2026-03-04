export interface IBooksRepository {
  findById(id: string): Promise<BookEntity | null>;
}
