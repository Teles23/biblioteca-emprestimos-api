import type { CategoriesDTO } from '../dtos/categories.dto';
import type { ICategoriesRepository } from '../../domain/repositories/ICategoriesRepository';

export class ListCategoriesUseCase {
  constructor(private readonly categoriesRepository: ICategoriesRepository) {}

  async execute(): Promise<CategoriesDTO[]> {
    return this.categoriesRepository.list();
  }
}
