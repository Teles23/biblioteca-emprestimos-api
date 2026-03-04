import type { AuthUserEntity } from '../entities/auth.entity';

export interface IAuthRepository {
  findByEmail(email: string): Promise<AuthUserEntity | null>;
}
