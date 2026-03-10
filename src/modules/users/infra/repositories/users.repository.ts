import { prisma } from '../../../../shared/infra/database/prisma/client';
import { UserEntity } from '../../domain/entities/users.entity';
import type { IUsersRepository } from '../../domain/repositories/IUsersRepository';

export class UsersRepository implements IUsersRepository {
  async create(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    roles: string[];
  }): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        roles: data.roles,
        status: 'ACTIVE',
      },
    });

    return this.toEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? this.toEntity(user) : null;
  }

  async list(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { loans: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => this.toEntity({
      ...user,
      loanCount: user._count?.loans,
    }));
  }

  private toEntity(user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    roles: string[];
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date;
    updatedAt: Date;
    loanCount?: number;
  }): UserEntity {
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.phone,
      user.roles,
      user.status,
      user.createdAt,
      user.updatedAt,
      user.loanCount,
    );
  }

  async update(id: string, data: { name?: string; email?: string; phone?: string; roles?: string[]; status?: 'ACTIVE' | 'INACTIVE' }): Promise<UserEntity> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return this.toEntity(user);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
