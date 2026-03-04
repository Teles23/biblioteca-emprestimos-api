export interface ICategoriesRepository {
  findById(id: string): Promise<CategorieEntity | null>;
}
