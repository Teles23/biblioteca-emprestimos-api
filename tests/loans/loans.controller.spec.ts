import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../../src/shared/errors/app-error';
import { prisma } from '../../src/shared/infra/database/prisma/client';
import { LoansController } from '../../src/modules/loans/infra/controllers/loans.controller';
import { LoansRepository } from '../../src/modules/loans/infra/repositories/loans.repository';

function createResponseMock(): Response {
  const response = {} as Response;
  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  response.send = jest.fn().mockReturnValue(response);
  return response;
}

describe('LoansController', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create loan successfully', async () => {
    const controller = new LoansController();
    const request = {
      body: {
        bookId: 'book-1',
        userId: 'user-1',
      },
    } as Request;
    const response = createResponseMock();
    const next = jest.fn();

    jest.spyOn(prisma.book, 'findUnique').mockResolvedValue({ id: 'book-1', status: 'AVAILABLE' } as never);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({ id: 'user-1' } as never);
    jest.spyOn(LoansRepository.prototype, 'findActiveByBookId').mockResolvedValue(null);

    const transactionSpy = jest.spyOn(prisma, '$transaction');
    transactionSpy.mockImplementation(async (callback: any) => {
      const tx = {
        loan: {
          create: jest.fn().mockResolvedValue({
            id: 'loan-1',
            bookId: 'book-1',
            userId: 'user-1',
            status: 'ACTIVE',
          }),
        },
        book: {
          update: jest.fn().mockResolvedValue({}),
        },
      };

      return callback(tx);
    });

    await controller.create(request, response, next as unknown as NextFunction);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail when book is unavailable', async () => {
    const controller = new LoansController();
    const request = {
      body: {
        bookId: 'book-1',
        userId: 'user-1',
      },
    } as Request;
    const response = createResponseMock();
    const next = jest.fn();

    jest.spyOn(prisma.book, 'findUnique').mockResolvedValue({ id: 'book-1', status: 'BORROWED' } as never);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({ id: 'user-1' } as never);

    await controller.create(request, response, next as unknown as NextFunction);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0] as AppError;
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(409);
  });

  it('should return overdue loan with late days', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-20T00:00:00.000Z'));

    const controller = new LoansController();
    const request = {
      params: { id: 'loan-1' },
    } as unknown as Request;
    const response = createResponseMock();
    const next = jest.fn();

    jest.spyOn(LoansRepository.prototype, 'findById').mockResolvedValue({
      id: 'loan-1',
      bookId: 'book-1',
      userId: 'user-1',
      loanDate: new Date('2026-01-01T00:00:00.000Z'),
      dueDate: new Date('2026-01-10T00:00:00.000Z'),
      returnDate: null,
      status: 'ACTIVE',
      lateDays: 0,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    const transactionSpy = jest.spyOn(prisma, '$transaction');
    transactionSpy.mockImplementation(async (callback: any) => {
      const tx = {
        loan: {
          update: jest.fn().mockResolvedValue({
            id: 'loan-1',
            status: 'OVERDUE',
            lateDays: 10,
          }),
        },
        book: {
          update: jest.fn().mockResolvedValue({}),
        },
      };

      return callback(tx);
    });

    await controller.returnLoan(request, response, next as unknown as NextFunction);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'OVERDUE',
        lateDays: 10,
      }),
    );
    expect(next).not.toHaveBeenCalled();

    jest.useRealTimers();
  });
});
