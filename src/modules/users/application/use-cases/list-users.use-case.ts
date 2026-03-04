import type { UsersDTO } from '../dtos/users.dto';

export class ListUsersUseCase {
  async execute(): Promise<UsersDTO[]> {
    return [];
  }
}
