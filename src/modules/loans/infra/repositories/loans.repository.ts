import { prisma } from '../../../../shared/infra/database/prisma/client';
import { LoanEntity } from '../../domain/entities/loans.entity';
import type { ILoansRepository } from '../../domain/repositories/ILoansRepository';

export class LoansRepository implements ILoansRepository {
  async create(data: { bookId: string; userId: string; loanDate: Date; dueDate: Date }): Promise<LoanEntity> {
    const loan = await prisma.loan.create({
      data: {
        bookId: data.bookId,
        userId: data.userId,
        loanDate: data.loanDate,
        dueDate: data.dueDate,
        status: 'ACTIVE',
      },
    });

    return this.toEntity(loan);
  }

  async findActiveByBookId(bookId: string): Promise<LoanEntity | null> {
    const loan = await prisma.loan.findFirst({
      where: {
        bookId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });

    return loan ? this.toEntity(loan) : null;
  }

  async findById(id: string): Promise<LoanEntity | null> {
    const loan = await prisma.loan.findUnique({ where: { id } });
    return loan ? this.toEntity(loan) : null;
  }

  async listActive(userId?: string): Promise<LoanEntity[]> {
    const loans = await prisma.loan.findMany({
      where: {
        status: 'ACTIVE',
        userId,
      },
      orderBy: { loanDate: 'desc' },
    });

    return loans.map((loan) => this.toEntity(loan));
  }

  async listOverdue(now: Date): Promise<LoanEntity[]> {
    const loans = await prisma.loan.findMany({
      where: {
        status: 'ACTIVE',
        dueDate: { lt: now },
      },
      orderBy: { dueDate: 'asc' },
    });

    return loans.map((loan) => this.toEntity(loan));
  }

  async listHistory(filters: { userId?: string; bookId?: string }): Promise<LoanEntity[]> {
    const loans = await prisma.loan.findMany({
      where: {
        userId: filters.userId,
        bookId: filters.bookId,
      },
      orderBy: { loanDate: 'desc' },
    });

    return loans.map((loan) => this.toEntity(loan));
  }

  async listByUser(userId: string): Promise<LoanEntity[]> {
    const loans = await prisma.loan.findMany({
      where: {
        userId,
      },
      orderBy: { loanDate: 'desc' },
    });

    return loans.map((loan) => this.toEntity(loan));
  }

  async returnLoan(data: {
    id: string;
    returnDate: Date;
    lateDays: number;
    status: 'RETURNED' | 'OVERDUE';
  }): Promise<LoanEntity> {
    const loan = await prisma.loan.update({
      where: { id: data.id },
      data: {
        returnDate: data.returnDate,
        lateDays: data.lateDays,
        status: data.status,
      },
    });

    return this.toEntity(loan);
  }

  private toEntity(loan: {
    id: string;
    bookId: string;
    userId: string;
    loanDate: Date;
    dueDate: Date;
    returnDate: Date | null;
    status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
    lateDays: number;
    createdAt: Date;
    updatedAt: Date;
  }): LoanEntity {
    return new LoanEntity(
      loan.id,
      loan.bookId,
      loan.userId,
      loan.loanDate,
      loan.dueDate,
      loan.returnDate,
      loan.status,
      loan.lateDays,
      loan.createdAt,
      loan.updatedAt,
    );
  }
}
