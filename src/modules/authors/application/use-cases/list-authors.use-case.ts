import type { AuthorsDTO } from '../dtos/authors.dto';
import type { IAuthorsRepository } from '../../domain/repositories/IAuthorsRepository';

export class ListAuthorsUseCase {
  constructor(private readonly authorsRepository: IAuthorsRepository) {}

  async execute(): Promise<AuthorsDTO[]> {
    return this.authorsRepository.list();
  }
}
