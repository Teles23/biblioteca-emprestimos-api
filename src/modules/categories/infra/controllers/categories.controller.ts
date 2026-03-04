import { type NextFunction, type Request, type Response } from 'express';

import { AppError } from '../../../../shared/errors/app-error';
import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case';
import { CategoriesRepository } from '../repositories/categories.repository';

export class CategoriesController {
  private readonly categoriesRepository = new CategoriesRepository();

  async create(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { name } = request.body as { name?: string };

    try {
      if (!name) {
        throw new AppError('Nome da categoria e obrigatorio.', 400);
      }

      const existing = await this.categoriesRepository.findByName(name);

      if (existing) {
        throw new AppError('Categoria ja cadastrada.', 409);
      }

      const category = await this.categoriesRepository.create({ name });

      return response.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async list(_request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = await new ListCategoriesUseCase(this.categoriesRepository).execute();
      return response.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async findById(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;

    try {
      const category = await this.categoriesRepository.findById(id);

      if (!category) {
        throw new AppError('Categoria nao encontrada.', 404);
      }

      return response.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;
    const { name } = request.body as { name?: string };

    try {
      if (!name) {
        throw new AppError('Nome da categoria e obrigatorio.', 400);
      }

      const current = await this.categoriesRepository.findById(id);

      if (!current) {
        throw new AppError('Categoria nao encontrada.', 404);
      }

      const duplicate = await this.categoriesRepository.findByName(name);
      if (duplicate && duplicate.id !== id) {
        throw new AppError('Categoria ja cadastrada.', 409);
      }

      const category = await this.categoriesRepository.update(id, { name });

      return response.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;

    try {
      const current = await this.categoriesRepository.findById(id);

      if (!current) {
        throw new AppError('Categoria nao encontrada.', 404);
      }

      const hasLinkedBooks = await this.categoriesRepository.hasLinkedBooks(id);

      if (hasLinkedBooks) {
        throw new AppError('Categoria vinculada a livros. Exclusao bloqueada.', 409);
      }

      await this.categoriesRepository.delete(id);

      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
