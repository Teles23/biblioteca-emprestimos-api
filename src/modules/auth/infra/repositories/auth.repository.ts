import { prisma } from '../../../../shared/infra/database/prisma/client';
import { AuthUserEntity } from '../../domain/entities/auth.entity';
import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class AuthRepository implements IAuthRepository {
  async create(data: { name: string; email: string; password: string; roles: string[] }): Promise<AuthUserEntity> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        roles: data.roles,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        roles: true,
      },
    });

    return new AuthUserEntity(user.id, user.name, user.email, user.password, user.roles);
  }

  async findByEmail(email: string): Promise<AuthUserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        roles: true,
      },
    });

    if (!user) {
      return null;
    }

    return new AuthUserEntity(user.id, user.name, user.email, user.password, user.roles);
  }
}
