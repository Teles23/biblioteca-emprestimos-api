import type { CategorieEntity } from '../entities/categories.entity';

export interface ICategoriesRepository {
  create(data: { name: string }): Promise<CategorieEntity>;
  list(): Promise<CategorieEntity[]>;
  findById(id: string): Promise<CategorieEntity | null>;
  findByName(name: string): Promise<CategorieEntity | null>;
  update(id: string, data: { name: string }): Promise<CategorieEntity>;
  delete(id: string): Promise<void>;
  hasLinkedBooks(id: string): Promise<boolean>;
}
