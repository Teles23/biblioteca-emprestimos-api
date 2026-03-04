import type { IUsersRepository } from '../../domain/repositories/IUsersRepository';
import { UserEntity } from '../../domain/entities/users.entity';

export class UsersRepository implements IUsersRepository {
  async findById(id: string): Promise<UserEntity | null> {
    return new UserEntity(id);
  }
}
