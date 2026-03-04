import type { ICategoriesRepository } from '../../domain/repositories/ICategoriesRepository';
import { CategorieEntity } from '../../domain/entities/categories.entity';

export class CategoriesRepository implements ICategoriesRepository {
  async findById(id: string): Promise<CategorieEntity | null> {
    return new CategorieEntity(id);
  }
}
