import type { AuthUserEntity } from '../entities/auth.entity';

export interface IAuthRepository {
  create(data: {
    name: string;
    email: string;
    password: string;
    roles: string[];
  }): Promise<AuthUserEntity>;
  findByEmail(email: string): Promise<AuthUserEntity | null>;
}
