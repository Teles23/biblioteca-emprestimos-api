import { type NextFunction, type Request, type Response } from 'express';

import { AppError } from '../../../../shared/errors/app-error';
import { ListAuthorsUseCase } from '../../application/use-cases/list-authors.use-case';
import { AuthorsRepository } from '../repositories/authors.repository';

export class AuthorsController {
  private readonly authorsRepository = new AuthorsRepository();

  async create(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { name, biography } = request.body as { name?: string; biography?: string };

    try {
      if (!name) {
        throw new AppError('Nome do autor e obrigatorio.', 400);
      }

      const author = await this.authorsRepository.create({ name, biography });
      return response.status(201).json(author);
    } catch (error) {
      next(error);
    }
  }

  async list(_request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = await new ListAuthorsUseCase(this.authorsRepository).execute();
      return response.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async findById(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;

    try {
      const author = await this.authorsRepository.findById(id);

      if (!author) {
        throw new AppError('Autor nao encontrado.', 404);
      }

      return response.status(200).json(author);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;
    const { name, biography } = request.body as { name?: string; biography?: string };

    try {
      if (!name) {
        throw new AppError('Nome do autor e obrigatorio.', 400);
      }

      const current = await this.authorsRepository.findById(id);

      if (!current) {
        throw new AppError('Autor nao encontrado.', 404);
      }

      const author = await this.authorsRepository.update(id, { name, biography });
      return response.status(200).json(author);
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;

    try {
      const current = await this.authorsRepository.findById(id);

      if (!current) {
        throw new AppError('Autor nao encontrado.', 404);
      }

      const hasLinkedBooks = await this.authorsRepository.hasLinkedBooks(id);

      if (hasLinkedBooks) {
        throw new AppError('Autor vinculado a livros. Exclusao bloqueada.', 409);
      }

      await this.authorsRepository.delete(id);

      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
