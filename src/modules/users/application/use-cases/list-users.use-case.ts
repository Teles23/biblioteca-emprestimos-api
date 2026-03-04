import type { UsersDTO } from '../dtos/users.dto';
import type { IUsersRepository } from '../../domain/repositories/IUsersRepository';

export class ListUsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(): Promise<UsersDTO[]> {
    return this.usersRepository.list();
  }
}
