import { prisma } from '../../../../shared/infra/database/prisma/client';
import { CategorieEntity } from '../../domain/entities/categories.entity';
import type { ICategoriesRepository } from '../../domain/repositories/ICategoriesRepository';

export class CategoriesRepository implements ICategoriesRepository {
  async create(data: { name: string }): Promise<CategorieEntity> {
    const category = await prisma.category.create({
      data: { name: data.name },
    });

    return this.toEntity(category);
  }

  async list(): Promise<CategorieEntity[]> {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return categories.map((category) => this.toEntity(category));
  }

  async findById(id: string): Promise<CategorieEntity | null> {
    const category = await prisma.category.findUnique({ where: { id } });
    return category ? this.toEntity(category) : null;
  }

  async findByName(name: string): Promise<CategorieEntity | null> {
    const category = await prisma.category.findUnique({ where: { name } });
    return category ? this.toEntity(category) : null;
  }

  async update(id: string, data: { name: string }): Promise<CategorieEntity> {
    const category = await prisma.category.update({
      where: { id },
      data: { name: data.name },
    });

    return this.toEntity(category);
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }

  async hasLinkedBooks(id: string): Promise<boolean> {
    const linked = await prisma.book.findFirst({
      where: { categoryId: id },
      select: { id: true },
    });

    return Boolean(linked);
  }

  private toEntity(category: { id: string; name: string; createdAt: Date; updatedAt: Date }): CategorieEntity {
    return new CategorieEntity(category.id, category.name, category.createdAt, category.updatedAt);
  }
}
