import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../../src/shared/errors/app-error';
import { prisma } from '../../src/shared/infra/database/prisma/client';
import { BooksController } from '../../src/modules/books/infra/controllers/books.controller';
import { BooksRepository } from '../../src/modules/books/infra/repositories/books.repository';

function createResponseMock(): Response {
  const response = {} as Response;
  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  response.send = jest.fn().mockReturnValue(response);
  return response;
}

describe('BooksController', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create book successfully', async () => {
    const controller = new BooksController();
    const request = {
      body: {
        title: 'Domain-Driven Design',
        publicationYear: 2003,
        categoryId: 'cat-1',
        authorIds: ['author-1'],
      },
    } as Request;
    const response = createResponseMock();
    const next = jest.fn();

    jest.spyOn(BooksRepository.prototype, 'findByTitle').mockResolvedValue(null);
    jest.spyOn(prisma.category, 'findUnique').mockResolvedValue({ id: 'cat-1' } as never);
    jest.spyOn(prisma.author, 'count').mockResolvedValue(1);
    jest.spyOn(BooksRepository.prototype, 'create').mockResolvedValue({
      id: 'book-1',
      title: 'Domain-Driven Design',
      publicationYear: 2003,
      categoryId: 'cat-1',
      status: 'AVAILABLE',
      authors: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await controller.create(request, response, next as unknown as NextFunction);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail creating book when category does not exist', async () => {
    const controller = new BooksController();
    const request = {
      body: {
        title: 'Clean Architecture',
        publicationYear: 2017,
        categoryId: 'missing-cat',
        authorIds: ['author-1'],
      },
    } as Request;
    const response = createResponseMock();
    const next = jest.fn();

    jest.spyOn(BooksRepository.prototype, 'findByTitle').mockResolvedValue(null);
    jest.spyOn(prisma.category, 'findUnique').mockResolvedValue(null);

    await controller.create(request, response, next as unknown as NextFunction);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0] as AppError;
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(404);
  });
});
