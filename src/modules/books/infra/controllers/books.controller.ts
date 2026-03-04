import { type NextFunction, type Request, type Response } from 'express';

import { AppError } from '../../../../shared/errors/app-error';
import { prisma } from '../../../../shared/infra/database/prisma/client';
import { ListBooksUseCase } from '../../application/use-cases/list-books.use-case';
import { BooksRepository } from '../repositories/books.repository';

export class BooksController {
  private readonly booksRepository = new BooksRepository();

  async create(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { title, publicationYear, categoryId, authorIds } = request.body as {
      title?: string;
      publicationYear?: number;
      categoryId?: string;
      authorIds?: string[];
    };

    try {
      if (!title || !publicationYear || !categoryId || !authorIds?.length) {
        throw new AppError('Titulo, ano, categoria e pelo menos um autor sao obrigatorios.', 400);
      }

      const existing = await this.booksRepository.findByTitle(title);
      if (existing) {
        throw new AppError('Livro com este titulo ja existe.', 409);
      }

      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        throw new AppError('Categoria nao encontrada.', 404);
      }

      const authorsCount = await prisma.author.count({
        where: { id: { in: authorIds } },
      });

      if (authorsCount !== new Set(authorIds).size) {
        throw new AppError('Um ou mais autores nao foram encontrados.', 404);
      }

      const book = await this.booksRepository.create({
        title,
        publicationYear,
        categoryId,
        authorIds: [...new Set(authorIds)],
      });

      return response.status(201).json(book);
    } catch (error) {
      next(error);
    }
  }

  async list(_request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = await new ListBooksUseCase(this.booksRepository).execute();
      return response.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async findById(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;

    try {
      const book = await this.booksRepository.findById(id);

      if (!book) {
        throw new AppError('Livro nao encontrado.', 404);
      }

      return response.status(200).json(book);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;
    const { title, publicationYear, categoryId, authorIds } = request.body as {
      title?: string;
      publicationYear?: number;
      categoryId?: string;
      authorIds?: string[];
    };

    try {
      if (!title || !publicationYear || !categoryId || !authorIds?.length) {
        throw new AppError('Titulo, ano, categoria e pelo menos um autor sao obrigatorios.', 400);
      }

      const existingBook = await this.booksRepository.findById(id);
      if (!existingBook) {
        throw new AppError('Livro nao encontrado.', 404);
      }

      const duplicateTitle = await this.booksRepository.findByTitle(title);
      if (duplicateTitle && duplicateTitle.id !== id) {
        throw new AppError('Livro com este titulo ja existe.', 409);
      }

      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        throw new AppError('Categoria nao encontrada.', 404);
      }

      const authorsCount = await prisma.author.count({
        where: { id: { in: authorIds } },
      });

      if (authorsCount !== new Set(authorIds).size) {
        throw new AppError('Um ou mais autores nao foram encontrados.', 404);
      }

      const book = await this.booksRepository.update(id, {
        title,
        publicationYear,
        categoryId,
        authorIds: [...new Set(authorIds)],
      });

      return response.status(200).json(book);
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;

    try {
      const book = await this.booksRepository.findById(id);
      if (!book) {
        throw new AppError('Livro nao encontrado.', 404);
      }

      if (book.status === 'BORROWED') {
        throw new AppError('Livro emprestado nao pode ser excluido.', 409);
      }

      await this.booksRepository.delete(id);
      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
