import { type NextFunction, type Request, type Response } from 'express';

import { AppError } from '../../../../shared/errors/app-error';
import { prisma } from '../../../../shared/infra/database/prisma/client';
import { addDays, diffInDays } from '../../../../shared/utils/date';
import { LoansRepository } from '../repositories/loans.repository';

export class LoansController {
  private readonly loansRepository = new LoansRepository();

  async create(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { bookId, userId } = request.body as { bookId?: string; userId?: string };

    try {
      if (!bookId || !userId) {
        throw new AppError('Livro e usuario sao obrigatorios.', 400);
      }

      const [book, user] = await Promise.all([
        prisma.book.findUnique({ where: { id: bookId } }),
        prisma.user.findUnique({ where: { id: userId } }),
      ]);

      if (!book) {
        throw new AppError('Livro nao encontrado.', 404);
      }

      if (!user) {
        throw new AppError('Usuario nao encontrado.', 404);
      }

      if (book.status !== 'AVAILABLE') {
        throw new AppError('Livro indisponivel para emprestimo.', 409);
      }

      const activeLoan = await this.loansRepository.findActiveByBookId(bookId);
      if (activeLoan) {
        throw new AppError('Livro ja possui emprestimo ativo.', 409);
      }

      const loanDate = new Date();
      const dueDate = addDays(loanDate, 14);

      const loan = await prisma.$transaction(async (tx) => {
        const createdLoan = await tx.loan.create({
          data: {
            bookId,
            userId,
            loanDate,
            dueDate,
            status: 'ACTIVE',
          },
        });

        await tx.book.update({
          where: { id: bookId },
          data: { status: 'BORROWED' },
        });

        return createdLoan;
      });

      return response.status(201).json(loan);
    } catch (error) {
      next(error);
    }
  }

  async returnLoan(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const { id } = request.params;

    try {
      const loan = await this.loansRepository.findById(id);

      if (!loan) {
        throw new AppError('Emprestimo nao encontrado.', 404);
      }

      if (loan.status !== 'ACTIVE') {
        throw new AppError('Somente emprestimos ativos podem ser devolvidos.', 409);
      }

      const returnDate = new Date();
      const lateDays = diffInDays(loan.dueDate, returnDate);
      const status = lateDays > 0 ? 'OVERDUE' : 'RETURNED';

      const updatedLoan = await prisma.$transaction(async (tx) => {
        const returned = await tx.loan.update({
          where: { id: loan.id },
          data: {
            returnDate,
            lateDays,
            status,
          },
        });

        await tx.book.update({
          where: { id: loan.bookId },
          data: { status: 'AVAILABLE' },
        });

        return returned;
      });

      return response.status(200).json(updatedLoan);
    } catch (error) {
      next(error);
    }
  }

  async listActive(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const userId = typeof request.query.userId === 'string' ? request.query.userId : undefined;

    try {
      const loans = await prisma.loan.findMany({
        where: {
          status: 'ACTIVE',
          userId,
        },
        include: {
          book: {
            select: { id: true, title: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { loanDate: 'desc' },
      });

      return response.status(200).json(loans);
    } catch (error) {
      next(error);
    }
  }

  async listOverdue(_request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    try {
      const now = new Date();
      const loans = await prisma.loan.findMany({
        where: {
          status: 'ACTIVE',
          dueDate: { lt: now },
        },
        include: {
          book: {
            select: { id: true, title: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { dueDate: 'asc' },
      });

      return response.status(200).json(loans);
    } catch (error) {
      next(error);
    }
  }

  async listHistory(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const userId = typeof request.query.userId === 'string' ? request.query.userId : undefined;
    const bookId = typeof request.query.bookId === 'string' ? request.query.bookId : undefined;

    try {
      const loans = await prisma.loan.findMany({
        where: {
          userId,
          bookId,
        },
        include: {
          book: {
            select: { id: true, title: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { loanDate: 'desc' },
      });

      return response.status(200).json(loans);
    } catch (error) {
      next(error);
    }
  }

  async listMe(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!request.user?.id) {
        throw new AppError('Nao autenticado.', 401);
      }

      const loans = await prisma.loan.findMany({
        where: {
          userId: request.user.id,
        },
        include: {
          book: {
            select: { id: true, title: true },
          },
        },
        orderBy: { loanDate: 'desc' },
      });

      return response.status(200).json(loans);
    } catch (error) {
      next(error);
    }
  }
}
