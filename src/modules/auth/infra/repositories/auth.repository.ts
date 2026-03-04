import { prisma } from '../../../../shared/infra/database/prisma/client';
import { AuthUserEntity } from '../../domain/entities/auth.entity';
import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class AuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<AuthUserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    return new AuthUserEntity(user.id, user.email, user.password);
  }
}
