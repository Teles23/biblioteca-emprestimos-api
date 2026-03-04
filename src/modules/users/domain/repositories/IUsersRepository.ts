import type { UserEntity } from '../entities/users.entity';

export interface IUsersRepository {
  findById(id: string): Promise<UserEntity | null>;
}
