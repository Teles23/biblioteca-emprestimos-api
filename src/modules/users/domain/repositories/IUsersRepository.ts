import type { UserEntity } from '../entities/users.entity';

export interface IUsersRepository {
  create(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    roles: string[];
  }): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  list(): Promise<UserEntity[]>;
}
