import type { CategorieEntity } from '../entities/categories.entity';

export interface ICategoriesRepository {
  findById(id: string): Promise<CategorieEntity | null>;
}
